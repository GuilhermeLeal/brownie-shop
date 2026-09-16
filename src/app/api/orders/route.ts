import { createOrder } from "@/server/orders/create-order";
import { handleOrderPost } from "@/server/orders/handle-order-post";
import { verifyTurnstileToken } from "@/server/turnstile";

export async function POST(request: Request) {
  const isProduction = process.env.NODE_ENV === "production";

  return handleOrderPost(request, {
    verifyTurnstile: async ({ token, remoteIp, expectedHostname }) => {
      const { env } = await import("cloudflare:workers");

      return verifyTurnstileToken({
        token,
        secret: env.TURNSTILE_SECRET,
        remoteIp,
        expectedHostname,
        isProduction,
      });
    },
    createOrder: async (order) => {
      const { env } = await import("cloudflare:workers");

      return createOrder(env.DB, order);
    },
  });
}
