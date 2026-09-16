import { TURNSTILE_ERROR_MESSAGE } from "@/constants/turnstile";
import type { CreatedOrder, CreateOrderErrorResponse } from "@/types/order";
import type { ValidatedOrder } from "@/server/orders/validate-order";
import {
  OrderValidationError,
  validateCreateOrderPayload,
} from "@/server/orders/validate-order";

type TurnstileRequest = {
  token: string;
  remoteIp?: string;
  expectedHostname: string;
};

export type OrderPostDependencies = {
  verifyTurnstile: (request: TurnstileRequest) => Promise<boolean>;
  createOrder: (order: ValidatedOrder) => Promise<CreatedOrder>;
};

const responseHeaders = {
  "Cache-Control": "no-store",
};

function errorResponse(error: string, status: number) {
  const body: CreateOrderErrorResponse = { error };

  return Response.json(body, { status, headers: responseHeaders });
}

function readTurnstileToken(payload: unknown) {
  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload) ||
    !("turnstileToken" in payload) ||
    typeof payload.turnstileToken !== "string"
  ) {
    return null;
  }

  const token = payload.turnstileToken.trim();

  return token && token.length <= 2048 ? token : null;
}

export async function handleOrderPost(
  request: Request,
  dependencies: OrderPostDependencies,
) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("Envie os dados do pedido em formato válido.", 400);
  }

  try {
    const validatedOrder = validateCreateOrderPayload(payload);
    const turnstileToken = readTurnstileToken(payload);

    if (!turnstileToken) {
      return errorResponse(TURNSTILE_ERROR_MESSAGE, 400);
    }

    let isTurnstileValid: boolean;

    try {
      isTurnstileValid = await dependencies.verifyTurnstile({
        token: turnstileToken,
        remoteIp: request.headers.get("CF-Connecting-IP") ?? undefined,
        expectedHostname: new URL(request.url).hostname,
      });
    } catch {
      return errorResponse(TURNSTILE_ERROR_MESSAGE, 400);
    }

    if (!isTurnstileValid) {
      return errorResponse(TURNSTILE_ERROR_MESSAGE, 400);
    }

    const createdOrder = await dependencies.createOrder(validatedOrder);

    return Response.json(createdOrder, {
      status: 201,
      headers: responseHeaders,
    });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return errorResponse(error.message, 400);
    }

    console.error("Failed to create order in D1.", error);
    return errorResponse(
      "Não foi possível registrar o pedido agora. Tente novamente.",
      500,
    );
  }
}
