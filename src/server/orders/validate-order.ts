import {
  MAX_ORDER_ITEMS,
  MAX_ORDER_ITEM_QUANTITY,
  ORDER_NOTES_MAX_LENGTH,
  SHOP_TIME_ZONE,
} from "@/constants/order";
import { products } from "@/data/products";
import type { FulfillmentMethod } from "@/types/checkout";
import type { Product } from "@/types/product";
import { getDateInputValueInTimeZone, isValidDateInputValue } from "@/utils/date";
import { createCartItemId } from "@/utils/cart-item";
import { resolveProductSelection } from "@/utils/product-price";

const productsById = new Map<string, Product>(
  products.map((product) => [product.id, product]),
);

export type ValidatedOrderItem = {
  productId: string;
  productName: string;
  flavor: string | null;
  size: string | null;
  quantity: number;
  unitPriceInCents: number;
};

export type ValidatedOrder = {
  customerName: string;
  customerPhone: string;
  requestedDate: string;
  fulfillmentType: FulfillmentMethod;
  deliveryAddress: string | null;
  notes: string | null;
  productsTotalCents: number;
  items: ValidatedOrderItem[];
};

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(
  record: Record<string, unknown>,
  field: string,
  message: string,
  maximumLength: number,
) {
  const value = record[field];

  if (typeof value !== "string" || value.length > maximumLength) {
    throw new OrderValidationError(message);
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new OrderValidationError(message);
  }

  return normalizedValue;
}

function readOptionalString(
  record: Record<string, unknown>,
  field: string,
  maximumLength: number,
) {
  const value = record[field];

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string" || value.length > maximumLength) {
    throw new OrderValidationError("O pedido possui dados inválidos.");
  }

  return value.trim() || undefined;
}

function normalizeBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const hasCountryCode =
    digits.startsWith("55") && (digits.length === 12 || digits.length === 13);
  const localDigits = hasCountryCode ? digits.slice(2) : digits;

  if (localDigits.length !== 10 && localDigits.length !== 11) {
    throw new OrderValidationError(
      "Informe um telefone brasileiro válido com DDD.",
    );
  }

  return digits;
}

function readFulfillmentType(
  record: Record<string, unknown>,
): FulfillmentMethod {
  const value = record.fulfillmentType;

  if (value !== "delivery" && value !== "pickup") {
    throw new OrderValidationError("Escolha entrega ou retirada.");
  }

  return value;
}

function validateItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new OrderValidationError(
      "Adicione pelo menos um produto ao pedido.",
    );
  }

  if (value.length > MAX_ORDER_ITEMS) {
    throw new OrderValidationError("O pedido possui itens demais.");
  }

  const validatedItems = new Map<string, ValidatedOrderItem>();

  for (const input of value) {
    if (!isRecord(input)) {
      throw new OrderValidationError("O pedido possui um item inválido.");
    }

    const productId = readRequiredString(
      input,
      "productId",
      "O pedido possui um produto inválido.",
      100,
    );
    const quantity = input.quantity;

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_ORDER_ITEM_QUANTITY
    ) {
      throw new OrderValidationError(
        `Informe uma quantidade entre 1 e ${MAX_ORDER_ITEM_QUANTITY}.`,
      );
    }

    const product = productsById.get(productId);

    if (!product) {
      throw new OrderValidationError("O pedido possui um produto inválido.");
    }

    const flavor = readOptionalString(input, "flavor", 100);
    const size = readOptionalString(input, "size", 50);
    const selection = resolveProductSelection(product, { flavor, size });

    if (!selection) {
      throw new OrderValidationError(
        `Revise as opções selecionadas para ${product.name}.`,
      );
    }

    const itemId = createCartItemId(product.id, {
      flavor: selection.flavor,
      size: selection.size,
    });
    const currentItem = validatedItems.get(itemId);
    const combinedQuantity = (currentItem?.quantity ?? 0) + quantity;

    if (combinedQuantity > MAX_ORDER_ITEM_QUANTITY) {
      throw new OrderValidationError(
        `A quantidade de ${product.name} deve ser no máximo ${MAX_ORDER_ITEM_QUANTITY}.`,
      );
    }

    validatedItems.set(itemId, {
      productId: product.id,
      productName: product.name,
      flavor: selection.flavor ?? null,
      size: selection.size?.label ?? null,
      quantity: combinedQuantity,
      unitPriceInCents: selection.unitPriceInCents,
    });
  }

  return [...validatedItems.values()];
}

export function validateCreateOrderPayload(
  payload: unknown,
  today = getDateInputValueInTimeZone(SHOP_TIME_ZONE),
): ValidatedOrder {
  if (!isRecord(payload)) {
    throw new OrderValidationError("Envie os dados do pedido corretamente.");
  }

  const customerName = readRequiredString(
    payload,
    "customerName",
    "Informe seu nome.",
    120,
  );
  const customerPhone = normalizeBrazilianPhone(
    readRequiredString(
      payload,
      "customerPhone",
      "Informe seu telefone.",
      32,
    ),
  );
  const requestedDate = readRequiredString(
    payload,
    "requestedDate",
    "Escolha a data desejada.",
    10,
  );

  if (!isValidDateInputValue(requestedDate)) {
    throw new OrderValidationError("Informe uma data válida.");
  }

  if (requestedDate < today) {
    throw new OrderValidationError("Escolha hoje ou uma data futura.");
  }

  const fulfillmentType = readFulfillmentType(payload);
  const rawAddress = readOptionalString(payload, "deliveryAddress", 500);
  const deliveryAddress =
    fulfillmentType === "delivery" ? (rawAddress ?? null) : null;

  if (fulfillmentType === "delivery" && !deliveryAddress) {
    throw new OrderValidationError("Informe o endereço para entrega.");
  }

  const notes = readOptionalString(
    payload,
    "notes",
    ORDER_NOTES_MAX_LENGTH,
  );
  const items = validateItems(payload.items);
  const productsTotalCents = items.reduce(
    (total, item) => total + item.unitPriceInCents * item.quantity,
    0,
  );

  if (!Number.isSafeInteger(productsTotalCents)) {
    throw new OrderValidationError("O total do pedido é inválido.");
  }

  return {
    customerName,
    customerPhone,
    requestedDate,
    fulfillmentType,
    deliveryAddress,
    notes: notes ?? null,
    productsTotalCents,
    items,
  };
}
