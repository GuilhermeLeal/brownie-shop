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
import type { CreatedOrder } from "@/types/order";

const initialOrderDetails: OrderDetails = {
  name: "",
  phone: "",
  desiredDate: "",
  fulfillmentMethod: "",
  notes: "",
};

type CheckoutContextValue = {
  step: CheckoutStep;
  orderDetails: OrderDetails;
  createdOrder: CreatedOrder | null;
  setStep: (step: CheckoutStep) => void;
  updateOrderDetails: (updates: Partial<OrderDetails>) => void;
  completeOrder: (order: CreatedOrder) => void;
  resetCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [orderDetails, setOrderDetails] =
    useState<OrderDetails>(initialOrderDetails);
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);

  const updateOrderDetails = useCallback(
    (updates: Partial<OrderDetails>) => {
      setOrderDetails((currentDetails) => ({
        ...currentDetails,
        ...updates,
      }));
    },
    [],
  );

  const completeOrder = useCallback((order: CreatedOrder) => {
    setCreatedOrder(order);
    setStep("success");
  }, []);

  const resetCheckout = useCallback(() => {
    setStep("cart");
    setOrderDetails(initialOrderDetails);
    setCreatedOrder(null);
  }, []);

  const value = useMemo(
    () => ({
      step,
      orderDetails,
      createdOrder,
      setStep,
      updateOrderDetails,
      completeOrder,
      resetCheckout,
    }),
    [
      step,
      orderDetails,
      createdOrder,
      updateOrderDetails,
      completeOrder,
      resetCheckout,
    ],
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
