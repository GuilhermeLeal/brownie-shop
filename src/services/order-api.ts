import type {
  CreatedOrder,
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

function isCreatedOrder(value: unknown): value is CreatedOrder {
  return (
    isRecord(value) &&
    typeof value.orderId === "number" &&
    Number.isSafeInteger(value.orderId) &&
    value.orderId > 0 &&
    value.status === "pending_confirmation" &&
    typeof value.productsTotalCents === "number" &&
    Number.isSafeInteger(value.productsTotalCents) &&
    value.productsTotalCents >= 0
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
