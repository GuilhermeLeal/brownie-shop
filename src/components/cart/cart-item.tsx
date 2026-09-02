"use client";

import { useState } from "react";

import { useCart } from "@/contexts/cart-context";
import type { CartItem as CartItemType } from "@/types/cart";
import { getCartItemVariantLabel } from "@/utils/cart-item";
import { formatCurrency } from "@/utils/format-currency";

export function CartItem({ item }: { item: CartItemType }) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const subtotalInCents = item.unitPriceInCents * item.quantity;
  const variantLabel = getCartItemVariantLabel(item);

  function requestRemoval() {
    if (!isRemoving) {
      setIsRemoving(true);
    }
  }

  function handleDecreaseQuantity() {
    if (item.quantity === 1) {
      requestRemoval();
      return;
    }

    decreaseQuantity(item.id);
  }

  return (
    <li
      className={`grid rounded-[1.5rem] bg-background p-4 ${isRemoving ? "cart-item-removing" : "grid-rows-[1fr]"}`}
      aria-busy={isRemoving}
      onAnimationEnd={(event) => {
        if (event.currentTarget === event.target && isRemoving) {
          removeItem(item.id);
        }
      }}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold leading-tight">
              {item.name}
            </h3>
            {variantLabel && (
              <p className="mt-1 text-sm text-chocolate/65">
                {variantLabel}
              </p>
            )}
          </div>
          <p className="shrink-0 text-sm font-bold">
            {formatCurrency(subtotalInCents)}
          </p>
        </div>

        <p className="mt-3 text-xs text-chocolate/55">
          Unitário: {formatCurrency(item.unitPriceInCents)}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex items-center rounded-full bg-white p-1 ring-1 ring-chocolate/10"
            aria-label={`Quantidade de ${item.name}`}
          >
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              disabled={isRemoving}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full text-xl font-semibold transition-colors hover:bg-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate disabled:cursor-default"
              aria-label={
                item.quantity === 1
                  ? `Remover ${item.name} do pedido`
                  : `Diminuir quantidade de ${item.name}`
              }
            >
              <span aria-hidden="true">−</span>
            </button>
            <output
              className="min-w-9 text-center text-sm font-bold"
              aria-live="polite"
            >
              {item.quantity}
            </output>
            <button
              type="button"
              onClick={() => increaseQuantity(item.id)}
              disabled={isRemoving}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full text-xl font-semibold transition-colors hover:bg-secondary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate disabled:cursor-default"
              aria-label={`Aumentar quantidade de ${item.name}`}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>

          <button
            type="button"
            onClick={requestRemoval}
            disabled={isRemoving}
            className="min-h-11 cursor-pointer rounded-full px-3 py-2 text-sm font-semibold underline decoration-chocolate/30 underline-offset-4 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate disabled:cursor-default"
          >
            Remover
          </button>
        </div>
      </div>
    </li>
  );
}
