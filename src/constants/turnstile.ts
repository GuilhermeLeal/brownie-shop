export const TURNSTILE_ACTION = "create_order";
export const TURNSTILE_ERROR_MESSAGE =
  "Não foi possível verificar sua solicitação. Tente novamente.";
export const TURNSTILE_PRODUCTION_SITE_KEY =
  "0x4AAAAAAE3WKzGB7qZyLLtH";
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";

export const TURNSTILE_SITE_KEY =
  process.env.NODE_ENV === "production"
    ? TURNSTILE_PRODUCTION_SITE_KEY
    : TURNSTILE_TEST_SITE_KEY;
