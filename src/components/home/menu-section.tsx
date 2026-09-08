"use client";

import { useState } from "react";

import { ProductMenuItem } from "@/components/home/product-menu-item";
import { products } from "@/data/products";

type ActiveProductSelection = {
  productId: string;
  flavor?: string;
  size?: string;
};

export function MenuSection() {
  const [activeProductSelection, setActiveProductSelection] =
    useState<ActiveProductSelection | null>(null);

  function handleFlavorToggle(productId: string, flavor: string) {
    setActiveProductSelection((currentSelection) => {
      const selection =
        currentSelection?.productId === productId
          ? currentSelection
          : { productId };
      const nextSelection = {
        ...selection,
        flavor: selection.flavor === flavor ? undefined : flavor,
      };

      return nextSelection.flavor || nextSelection.size ? nextSelection : null;
    });
  }

  function handleSizeToggle(productId: string, size: string) {
    setActiveProductSelection((currentSelection) => {
      const selection =
        currentSelection?.productId === productId
          ? currentSelection
          : { productId };
      const nextSelection = {
        ...selection,
        size: selection.size === size ? undefined : size,
      };

      return nextSelection.flavor || nextSelection.size ? nextSelection : null;
    });
  }

  function handleProductInteraction(productId: string) {
    setActiveProductSelection((currentSelection) =>
      currentSelection?.productId !== productId ? null : currentSelection,
    );
  }

  function clearProductSelection(productId: string) {
    setActiveProductSelection((currentSelection) =>
      currentSelection?.productId === productId ? null : currentSelection,
    );
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
            Conheça as opções disponíveis na versão normal do nosso cardápio.
          </p>
        </div>

        <ol className="mt-12 space-y-8 sm:mt-16 sm:space-y-10 lg:mt-20 lg:space-y-12">
          {products.map((product, index) => (
            <li key={product.id}>
              <ProductMenuItem
                product={product}
                index={index}
                selectedFlavor={
                  activeProductSelection?.productId === product.id
                    ? (activeProductSelection.flavor ?? null)
                    : null
                }
                selectedSize={
                  activeProductSelection?.productId === product.id
                    ? (activeProductSelection.size ?? null)
                    : null
                }
                onFlavorToggle={handleFlavorToggle}
                onSizeToggle={handleSizeToggle}
                onProductInteraction={handleProductInteraction}
                onProductAdded={clearProductSelection}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
