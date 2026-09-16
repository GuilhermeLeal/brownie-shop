"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

import {
  TURNSTILE_ACTION,
  TURNSTILE_SITE_KEY,
} from "@/constants/turnstile";

type TurnstileWidgetOptions = {
  sitekey: string;
  action: string;
  theme: "light";
  language: "pt-BR";
  size: "flexible";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  "timeout-callback": () => void;
};

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: TurnstileWidgetOptions,
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileWidgetProps = {
  resetKey: number;
  onTokenChange: (token: string | null) => void;
  onVerificationError: () => void;
};

export function TurnstileWidget({
  resetKey,
  onTokenChange,
  onVerificationError,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const previousResetKeyRef = useRef(resetKey);
  const onTokenChangeRef = useRef(onTokenChange);
  const onVerificationErrorRef = useRef(onVerificationError);

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
    onVerificationErrorRef.current = onVerificationError;
  }, [onTokenChange, onVerificationError]);

  const renderWidget = useCallback(() => {
    const container = containerRef.current;
    const turnstile = window.turnstile;

    if (!container || !turnstile || widgetIdRef.current !== null) {
      return;
    }

    const handleVerificationFailure = () => {
      onTokenChangeRef.current(null);
      onVerificationErrorRef.current();
    };

    try {
      widgetIdRef.current = turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        action: TURNSTILE_ACTION,
        theme: "light",
        language: "pt-BR",
        size: "flexible",
        callback: (token) => onTokenChangeRef.current(token),
        "expired-callback": handleVerificationFailure,
        "error-callback": handleVerificationFailure,
        "timeout-callback": handleVerificationFailure,
      });
    } catch {
      handleVerificationFailure();
    }
  }, []);

  useEffect(() => {
    renderWidget();

    return () => {
      const widgetId = widgetIdRef.current;

      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }

      widgetIdRef.current = null;
    };
  }, [renderWidget]);

  useEffect(() => {
    if (previousResetKeyRef.current === resetKey) {
      return;
    }

    previousResetKeyRef.current = resetKey;
    onTokenChangeRef.current(null);

    const widgetId = widgetIdRef.current;

    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  }, [resetKey]);

  return (
    <div className="flex min-h-[65px] justify-center">
      <div
        ref={containerRef}
        className="w-full max-w-[300px]"
        aria-label="Verificação de segurança"
      />
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => onVerificationErrorRef.current()}
      />
    </div>
  );
}
