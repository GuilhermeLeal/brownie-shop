import type {
  CreatedOrder,
  CreatedOrderItem,
  CreateOrderErrorResponse,
  CreateOrderInput,
} from "@/types/order";

export class OrderSubmissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderSubmissionError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown) {
  return value === null || typeof value === "string";
}

function isCreatedOrderItem(value: unknown): value is CreatedOrderItem {
  return (
    isRecord(value) &&
    typeof value.productId === "string" &&
    value.productId.length > 0 &&
    typeof value.productName === "string" &&
    value.productName.length > 0 &&
    isNullableString(value.flavor) &&
    isNullableString(value.size) &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0 &&
    typeof value.unitPriceInCents === "number" &&
    Number.isSafeInteger(value.unitPriceInCents) &&
    value.unitPriceInCents >= 0
  );
}

function isCreatedOrder(value: unknown): value is CreatedOrder {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return false;
  }

  const itemsTotalInCents = value.items.reduce<number | null>(
    (total, item) =>
      total !== null && isCreatedOrderItem(item)
        ? total + item.unitPriceInCents * item.quantity
        : null,
    0,
  );

  return (
    typeof value.orderId === "number" &&
    Number.isSafeInteger(value.orderId) &&
    value.orderId > 0 &&
    value.status === "pending_confirmation" &&
    typeof value.customerName === "string" &&
    value.customerName.length > 0 &&
    typeof value.requestedDate === "string" &&
    (value.fulfillmentType === "delivery" ||
      value.fulfillmentType === "pickup") &&
    isNullableString(value.notes) &&
    value.items.length > 0 &&
    itemsTotalInCents !== null &&
    typeof value.productsTotalCents === "number" &&
    Number.isSafeInteger(value.productsTotalCents) &&
    value.productsTotalCents >= 0 &&
    itemsTotalInCents === value.productsTotalCents
  );
}

function getResponseError(value: unknown) {
  return isRecord(value) && typeof value.error === "string"
    ? (value as CreateOrderErrorResponse).error
    : null;
}

export async function submitOrder(input: CreateOrderInput) {
  let response: Response;

  try {
    response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new OrderSubmissionError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new OrderSubmissionError(
      "O servidor retornou uma resposta inválida. Tente novamente.",
    );
  }

  if (!response.ok) {
    throw new OrderSubmissionError(
      getResponseError(data) ??
        "Não foi possível registrar o pedido. Tente novamente.",
    );
  }

  if (!isCreatedOrder(data)) {
    throw new OrderSubmissionError(
      "O servidor retornou uma resposta inválida. Tente novamente.",
    );
  }

  return data;
}
