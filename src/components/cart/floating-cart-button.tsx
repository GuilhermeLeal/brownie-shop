"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/contexts/cart-context";
import { useOrderMode } from "@/contexts/order-mode-context";

export function FloatingCartButton() {
  const { isOrderMode } = useOrderMode();
  const { totalQuantity, openCart } = useCart();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const shouldShowButton = isOrderMode && !isHeaderVisible;

  useEffect(() => {
    const siteHeader = document.querySelector<HTMLElement>("body > header");

    if (!siteHeader) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsHeaderVisible(entry.isIntersecting);
        }
      },
      { threshold: 0 },
    );

    observer.observe(siteHeader);

    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir pedido, ${totalQuantity} ${
        totalQuantity === 1 ? "item" : "itens"
      }`}
      aria-controls="cart-drawer"
      aria-haspopup="dialog"
      aria-hidden={!shouldShowButton}
      tabIndex={shouldShowButton ? 0 : -1}
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-40 flex size-14 items-center justify-center rounded-full bg-chocolate text-white shadow-lg transition-[opacity,transform] duration-200 ease-out hover:bg-primary hover:text-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-[calc(1.5rem+env(safe-area-inset-right))] ${
        shouldShowButton
          ? "cursor-pointer translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-3 scale-95 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-6"
      >
        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 8H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
      </svg>
      <span
        className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-chocolate ring-2 ring-background"
        aria-hidden="true"
      >
        {totalQuantity > 99 ? "99+" : totalQuantity}
      </span>
    </button>
  );
}
