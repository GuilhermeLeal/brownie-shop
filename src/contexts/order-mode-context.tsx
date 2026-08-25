"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type OrderModeContextValue = {
  isOrderMode: boolean;
  startOrderMode: () => void;
  stopOrderMode: () => void;
};

const OrderModeContext = createContext<OrderModeContextValue | null>(null);

export function OrderModeProvider({ children }: { children: ReactNode }) {
  const [isOrderMode, setIsOrderMode] = useState(false);

  const startOrderMode = useCallback(() => {
    setIsOrderMode(true);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.getElementById("cardapio")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  const stopOrderMode = useCallback(() => {
    setIsOrderMode(false);
  }, []);

  const value = useMemo(
    () => ({ isOrderMode, startOrderMode, stopOrderMode }),
    [isOrderMode, startOrderMode, stopOrderMode],
  );

  return (
    <OrderModeContext.Provider value={value}>
      {children}
    </OrderModeContext.Provider>
  );
}

export function useOrderMode() {
  const context = useContext(OrderModeContext);

  if (!context) {
    throw new Error("useOrderMode deve ser usado dentro de OrderModeProvider.");
  }

  return context;
}
