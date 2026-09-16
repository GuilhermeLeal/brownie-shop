declare namespace Cloudflare {
  interface Env {
    TURNSTILE_SECRET: string;
  }
}

declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}
