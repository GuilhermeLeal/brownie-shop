"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CheckoutStep, OrderDetails } from "@/types/checkout";

const initialOrderDetails: OrderDetails = {
  name: "",
  phone: "",
  desiredDate: "",
  fulfillmentMethod: "",
  address: "",
  notes: "",
};

type CheckoutContextValue = {
  step: CheckoutStep;
  orderDetails: OrderDetails;
  setStep: (step: CheckoutStep) => void;
  updateOrderDetails: (updates: Partial<OrderDetails>) => void;
  resetCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [orderDetails, setOrderDetails] =
    useState<OrderDetails>(initialOrderDetails);

  const updateOrderDetails = useCallback(
    (updates: Partial<OrderDetails>) => {
      setOrderDetails((currentDetails) => ({
        ...currentDetails,
        ...updates,
      }));
    },
    [],
  );

  const resetCheckout = useCallback(() => {
    setStep("cart");
    setOrderDetails(initialOrderDetails);
  }, []);

  const value = useMemo(
    () => ({
      step,
      orderDetails,
      setStep,
      updateOrderDetails,
      resetCheckout,
    }),
    [step, orderDetails, updateOrderDetails, resetCheckout],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckout deve ser usado dentro de CheckoutProvider.");
  }

  return context;
}
