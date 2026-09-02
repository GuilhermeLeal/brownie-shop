import { createOrder } from "@/server/orders/create-order";
import {
  OrderValidationError,
  validateCreateOrderPayload,
} from "@/server/orders/validate-order";
import type { CreateOrderErrorResponse } from "@/types/order";

const responseHeaders = {
  "Cache-Control": "no-store",
};

function errorResponse(error: string, status: number) {
  const body: CreateOrderErrorResponse = { error };

  return Response.json(body, { status, headers: responseHeaders });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("Envie os dados do pedido em formato válido.", 400);
  }

  try {
    const validatedOrder = validateCreateOrderPayload(payload);
    const { env } = await import("cloudflare:workers");
    const createdOrder = await createOrder(env.DB, validatedOrder);

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
