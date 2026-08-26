"use client";

import { useRef, useState } from "react";

import { ProductMenuItem } from "@/components/home/product-menu-item";
import { ExitOrderModal } from "@/components/order/exit-order-modal";
import { useCart } from "@/contexts/cart-context";
import { useCheckout } from "@/contexts/checkout-context";
import { useOrderMode } from "@/contexts/order-mode-context";
import { products } from "@/data/products";

type ActiveFlavorSelection = {
  productId: string;
  flavor: string;
};

export function MenuSection() {
  const { isOrderMode, stopOrderMode } = useOrderMode();
  const { items, totalQuantity, clearCart, closeCart } = useCart();
  const { resetCheckout } = useCheckout();
  const exitOrderButtonRef = useRef<HTMLButtonElement>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [exitItemCount, setExitItemCount] = useState(0);
  const [activeFlavorSelection, setActiveFlavorSelection] =
    useState<ActiveFlavorSelection | null>(null);

  function handleFlavorToggle(productId: string, flavor: string) {
    setActiveFlavorSelection((currentSelection) => {
      const clickedSelectedFlavor =
        currentSelection?.productId === productId &&
        currentSelection.flavor === flavor;

      return clickedSelectedFlavor ? null : { productId, flavor };
    });
  }

  function handleProductInteraction(productId: string) {
    setActiveFlavorSelection((currentSelection) =>
      currentSelection?.productId !== productId ? null : currentSelection,
    );
  }

  function clearProductFlavorSelection(productId: string) {
    setActiveFlavorSelection((currentSelection) =>
      currentSelection?.productId === productId ? null : currentSelection,
    );
  }

  function handleExitOrderMode() {
    if (items.length === 0) {
      setActiveFlavorSelection(null);
      resetCheckout();
      stopOrderMode();
      return;
    }

    setExitItemCount(totalQuantity);
    setIsExitModalOpen(true);
  }

  function handleConfirmExitOrderMode() {
    clearCart();
    closeCart();
    resetCheckout();
    setActiveFlavorSelection(null);
    stopOrderMode();
    setIsExitModalOpen(false);
  }

  return (
    <section
      id="cardapio"
      className="scroll-mt-6 bg-white py-20 sm:py-24 lg:py-32"
      aria-labelledby="menu-title"
    >
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-chocolate/60">
            Nosso cardápio
          </p>
          <h2
            id="menu-title"
            className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Escolha o seu favorito
          </h2>
          <p className="mt-4 text-pretty leading-7 text-chocolate/70">
            Descrições e preços provisórios para apresentar todas as opções da
            versão normal do cardápio.
          </p>
        </div>

        {isOrderMode && (
          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 rounded-[2rem] bg-background px-5 py-5 ring-1 ring-chocolate/10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3" role="status">
              <span
                className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary"
                aria-hidden="true"
              />
              <div>
                <p className="font-heading text-xl font-bold">
                  Montando seu pedido
                </p>
                <p className="mt-1 text-sm leading-6 text-chocolate/70">
                  Escolha os produtos que deseja adicionar.
                </p>
              </div>
            </div>
            <button
              ref={exitOrderButtonRef}
              type="button"
              onClick={handleExitOrderMode}
              className="min-h-11 cursor-pointer self-start rounded-full px-4 py-2 text-sm font-bold underline decoration-chocolate/30 underline-offset-4 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate sm:self-auto"
            >
              Sair do modo pedido
            </button>
          </div>
        )}

        <ExitOrderModal
          isOpen={isExitModalOpen}
          itemCount={exitItemCount}
          triggerRef={exitOrderButtonRef}
          onCancel={() => setIsExitModalOpen(false)}
          onConfirm={handleConfirmExitOrderMode}
        />

        <ol
          className={`space-y-8 sm:space-y-10 lg:space-y-12 ${
            isOrderMode ? "mt-8 sm:mt-10" : "mt-12 sm:mt-16 lg:mt-20"
          }`}
        >
          {products.map((product, index) => (
            <li key={product.id}>
              <ProductMenuItem
                product={product}
                index={index}
                isOrderMode={isOrderMode}
                selectedFlavor={
                  activeFlavorSelection?.productId === product.id
                    ? activeFlavorSelection.flavor
                    : null
                }
                onFlavorToggle={handleFlavorToggle}
                onProductInteraction={handleProductInteraction}
                onProductAdded={clearProductFlavorSelection}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
