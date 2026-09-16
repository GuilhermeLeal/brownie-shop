import { TURNSTILE_ACTION } from "@/constants/turnstile";

const TURNSTILE_SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";
const LOCAL_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
]);

type TurnstileSiteverifyResponse = {
  success?: unknown;
  action?: unknown;
  hostname?: unknown;
};

export type VerifyTurnstileInput = {
  token: string;
  secret: string | undefined;
  remoteIp?: string;
  expectedHostname: string;
  isProduction: boolean;
  fetchImplementation?: typeof fetch;
};

export function getTurnstileSecret(
  configuredSecret: string | undefined,
  isProduction: boolean,
) {
  if (!isProduction) {
    return TURNSTILE_TEST_SECRET;
  }

  return configuredSecret?.trim() || null;
}

function isExpectedHostname(
  hostname: string,
  expectedHostname: string,
  isProduction: boolean,
) {
  if (isProduction) {
    return hostname === expectedHostname;
  }

  return hostname === expectedHostname && LOCAL_HOSTNAMES.has(hostname);
}

export async function verifyTurnstileToken({
  token,
  secret: configuredSecret,
  remoteIp,
  expectedHostname,
  isProduction,
  fetchImplementation = fetch,
}: VerifyTurnstileInput) {
  const secret = getTurnstileSecret(configuredSecret, isProduction);

  if (!secret || !token || token.length > 2048 || !expectedHostname) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  let response: Response;
  let result: TurnstileSiteverifyResponse;

  try {
    response = await fetchImplementation(TURNSTILE_SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return false;
    }

    result = (await response.json()) as TurnstileSiteverifyResponse;
  } catch {
    return false;
  }

  return (
    result.success === true &&
    result.action === TURNSTILE_ACTION &&
    typeof result.hostname === "string" &&
    isExpectedHostname(result.hostname, expectedHostname, isProduction)
  );
}
