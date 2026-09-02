"use client";

import { useCallback, useEffect, useRef } from "react";

import { CartView } from "@/components/cart/cart-view";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderReview } from "@/components/checkout/order-review";
import { OrderSuccess } from "@/components/checkout/order-success";
import { useCart } from "@/contexts/cart-context";
import { useCheckout } from "@/contexts/checkout-context";
import type { CheckoutStep } from "@/types/checkout";

const stepTitles: Record<CheckoutStep, string> = {
  cart: "Seu pedido",
  details: "Dados do pedido",
  review: "Revise seu pedido",
  success: "Pedido criado",
};

const stepNumbers: Record<CheckoutStep, number> = {
  cart: 1,
  details: 2,
  review: 3,
  success: 4,
};

export function CartDrawer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef<CheckoutStep>("cart");
  const previousBodyOverflowRef = useRef<string | null>(null);
  const { items, isCartOpen, closeCart } = useCart();
  const { step, createdOrder, setStep } = useCheckout();
  const activeStep: CheckoutStep = items.length === 0 ? "cart" : step;

  const restorePageScroll = useCallback(() => {
    if (previousBodyOverflowRef.current === null) {
      return;
    }

    document.body.style.overflow = previousBodyOverflowRef.current;
    previousBodyOverflowRef.current = null;
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (!isCartOpen) {
      if (dialog.open) {
        dialog.dataset.state = "closing";
      }
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    dialog.dataset.state = "open";

    if (previousBodyOverflowRef.current === null) {
      previousBodyOverflowRef.current = document.body.style.overflow;
    }

    document.body.style.overflow = "hidden";
  }, [isCartOpen]);

  useEffect(() => {
    return () => {
      restorePageScroll();
    };
  }, [restorePageScroll]);

  useEffect(() => {
    if (isCartOpen && previousStepRef.current !== activeStep) {
      titleRef.current?.focus();
    }

    previousStepRef.current = activeStep;
  }, [activeStep, isCartOpen]);

  function finishClosing() {
    const dialog = dialogRef.current;

    if (!dialog || dialog.dataset.state !== "closing") {
      return;
    }

    dialog.close();
    dialog.dataset.state = "closed";
    restorePageScroll();
  }

  return (
    <dialog
      ref={dialogRef}
      id="cart-drawer"
      className="cart-drawer fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-chocolate backdrop:bg-chocolate/40 backdrop:backdrop-blur-[2px]"
      aria-labelledby="cart-drawer-title"
      onCancel={(event) => {
        event.preventDefault();
        closeCart();
      }}
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.dataset.state = "closed";
        }

        restorePageScroll();
        closeCart();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeCart();
        }
      }}
    >
      <section
        className="cart-drawer-panel ml-auto flex h-full w-full max-w-[30rem] flex-col bg-white shadow-2xl"
        onAnimationEnd={(event) => {
          if (event.currentTarget === event.target) {
            finishClosing();
          }
        }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-chocolate/10 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-chocolate/55">
              Modo pedido · Etapa {stepNumbers[activeStep]} de 4
            </p>
            <h2
              ref={titleRef}
              id="cart-drawer-title"
              tabIndex={-1}
              className="mt-1 font-heading text-3xl font-bold outline-none"
            >
              {stepTitles[activeStep]}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            autoFocus
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background transition-colors hover:bg-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate"
            aria-label="Fechar pedido"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              className="size-5"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {activeStep === "cart" && (
          <CartView onContinue={() => setStep("details")} />
        )}
        {activeStep === "details" && (
          <CheckoutForm
            onBack={() => setStep("cart")}
            onReview={() => setStep("review")}
          />
        )}
        {activeStep === "review" && (
          <OrderReview onBack={() => setStep("details")} />
        )}
        {activeStep === "success" && createdOrder && (
          <OrderSuccess order={createdOrder} onClose={closeCart} />
        )}
      </section>
    </dialog>
  );
}
