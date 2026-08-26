"use client";

import { useRef, useState } from "react";

import { CartItem } from "@/components/cart/cart-item";
import { ClearCartModal } from "@/components/cart/clear-cart-modal";
import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/utils/format-currency";

type CartViewProps = {
  onContinue: () => void;
};

export function CartView({ onContinue }: CartViewProps) {
  const { items, totalQuantity, totalInCents, clearCart } = useCart();
  const clearCartButtonRef = useRef<HTMLButtonElement>(null);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const [clearCartItemCount, setClearCartItemCount] = useState(0);

  function handleClearCart() {
    setClearCartItemCount(totalQuantity);
    setIsClearCartModalOpen(true);
  }

  function handleConfirmClearCart() {
    clearCart();
    setIsClearCartModalOpen(false);
  }

  return (
    <>
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
                ref={clearCartButtonRef}
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

      <ClearCartModal
        isOpen={isClearCartModalOpen}
        itemCount={clearCartItemCount}
        triggerRef={clearCartButtonRef}
        onCancel={() => setIsClearCartModalOpen(false)}
        onConfirm={handleConfirmClearCart}
      />

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
          onClick={onContinue}
          disabled={items.length === 0}
          aria-describedby="delivery-fee-note"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-6 py-3 font-bold text-white transition-colors enabled:cursor-pointer enabled:hover:bg-primary enabled:hover:text-chocolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continuar pedido
        </button>
      </footer>
    </>
  );
}
