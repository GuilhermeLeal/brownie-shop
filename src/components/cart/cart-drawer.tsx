"use client";

import { useCallback, useEffect, useRef } from "react";

import { CartItem } from "@/components/cart/cart-item";
import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/utils/format-currency";

export function CartDrawer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const {
    items,
    totalQuantity,
    totalInCents,
    isCartOpen,
    clearCart,
    closeCart,
  } = useCart();

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

  function finishClosing() {
    const dialog = dialogRef.current;

    if (!dialog || dialog.dataset.state !== "closing") {
      return;
    }

    dialog.close();
    dialog.dataset.state = "closed";
    restorePageScroll();
  }

  function handleClearCart() {
    const shouldClearCart = window.confirm(
      "Remover todos os itens do pedido?",
    );

    if (shouldClearCart) {
      clearCart();
    }
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
              Modo pedido
            </p>
            <h2
              id="cart-drawer-title"
              className="mt-1 font-heading text-3xl font-bold"
            >
              Seu pedido
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

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {items.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-[2rem] bg-background px-6 text-center">
              <span
                className="size-3 rounded-full bg-primary"
                aria-hidden="true"
              />
              <p className="mt-4 font-heading text-2xl font-bold">
                Seu pedido ainda está vazio.
              </p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-chocolate/65">
                Feche este painel e escolha seus produtos no cardápio.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-chocolate/65">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "itens"}
                </p>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="min-h-11 cursor-pointer rounded-full px-3 py-2 text-sm font-semibold underline decoration-chocolate/30 underline-offset-4 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate"
                >
                  Limpar pedido
                </button>
              </div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </ul>
            </>
          )}
        </div>

        <footer className="border-t border-chocolate/10 bg-white px-5 py-5 sm:px-6">
          <dl className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <dt>Itens</dt>
              <dd className="font-bold">{totalQuantity}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="font-semibold">Total dos produtos</dt>
              <dd className="font-heading text-xl font-bold">
                {formatCurrency(totalInCents)}
              </dd>
            </div>
          </dl>
          <p id="delivery-fee-note" className="mt-3 text-xs text-chocolate/55">
            A taxa de entrega não está incluída.
          </p>
          <button
            type="button"
            disabled={items.length === 0}
            aria-describedby="delivery-fee-note"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-6 py-3 font-bold text-white transition-colors enabled:cursor-pointer enabled:hover:bg-primary enabled:hover:text-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar pedido
          </button>
        </footer>
      </section>
    </dialog>
  );
}
