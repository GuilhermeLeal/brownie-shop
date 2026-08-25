"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format-currency";

type ProductMenuItemProps = {
  product: Product;
  index: number;
  isOrderMode: boolean;
  selectedFlavor: string | null;
  onFlavorToggle: (productId: string, flavor: string) => void;
  onProductInteraction: (productId: string) => void;
  onProductAdded: (productId: string) => void;
};

export function ProductMenuItem({
  product,
  index,
  isOrderMode,
  selectedFlavor,
  onFlavorToggle,
  onProductInteraction,
  onProductAdded,
}: ProductMenuItemProps) {
  const { addProduct } = useCart();
  const [showFlavorError, setShowFlavorError] = useState(false);
  const [wasAdded, setWasAdded] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageOnRight = index % 2 !== 0;
  const itemNumber = String(index + 1).padStart(2, "0");
  const flavorErrorId = `${product.id}-flavor-error`;
  const blockColor = index % 2 === 0 ? "bg-secondary/40" : "bg-primary/40";
  const desktopColumns = imageOnRight
    ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
    : "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]";

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  function handleFlavorClick(flavor: string) {
    setShowFlavorError(false);
    onFlavorToggle(product.id, flavor);
  }

  function handleAddProduct() {
    onProductInteraction(product.id);

    if (product.flavors?.length && !selectedFlavor) {
      setShowFlavorError(true);
      setWasAdded(false);
      return;
    }

    const wasSuccessfullyAdded = addProduct(
      product,
      selectedFlavor ?? undefined,
    );

    if (!wasSuccessfullyAdded) {
      setShowFlavorError(true);
      return;
    }

    setShowFlavorError(false);
    setWasAdded(true);
    onProductAdded(product.id);

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = setTimeout(() => {
      setWasAdded(false);
    }, 1600);
  }

  return (
    <article
      className={`grid items-center gap-6 rounded-[2.25rem] p-5 sm:gap-8 sm:rounded-[3rem] sm:p-8 md:gap-10 md:p-10 lg:gap-14 lg:p-12 ${blockColor} ${desktopColumns}`}
    >
      <figure
        className={`relative aspect-[8/5] overflow-hidden rounded-[1.5rem] bg-white/30 sm:rounded-[2rem] md:aspect-[4/3] ${
          imageOnRight ? "md:order-2" : "md:order-1"
        }`}
      >
        <Image
          src={product.image}
          alt={`Imagem temporária de demonstração para ${product.name}.`}
          fill
          sizes="(min-width: 1200px) 430px, (min-width: 768px) 38vw, 100vw"
          className="object-cover"
        />
        <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm sm:bottom-4 sm:left-4">
          Imagem temporária
        </figcaption>
      </figure>

      <div
        className={`max-w-lg ${
          imageOnRight ? "md:order-1 md:justify-self-end" : "md:order-2"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-chocolate/55">
          Item {itemNumber}
        </p>
        <h3 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {product.name}
        </h3>
        <p className="mt-4 text-pretty leading-7 text-chocolate/70">
          {product.description}
        </p>
        <p className="mt-5 text-lg font-bold">
          {formatCurrency(product.priceInCents)}
        </p>

        {product.flavors && (
          <div className="mt-7 border-l-4 border-chocolate/20 pl-4">
            {isOrderMode ? (
              <fieldset aria-describedby={showFlavorError ? flavorErrorId : undefined}>
                <legend className="text-sm font-bold">Sabores</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.flavors.map((flavor) => {
                    const isSelected = selectedFlavor === flavor;

                    return (
                      <button
                        key={flavor}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleFlavorClick(flavor)}
                        className={`cursor-pointer rounded-full border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 ${
                          isSelected
                            ? "border-chocolate bg-chocolate font-semibold text-white"
                            : "border-chocolate/20 bg-white/85 text-chocolate/75 hover:bg-white"
                        }`}
                      >
                        {flavor}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <>
                <p className="text-sm font-bold">Sabores</p>
                <ul
                  className="mt-3 flex flex-wrap gap-2"
                  aria-label={`Sabores de ${product.name}`}
                >
                  {product.flavors.map((flavor) => (
                    <li
                      key={flavor}
                      className="rounded-full bg-white/60 px-3 py-2 text-sm text-chocolate/75"
                    >
                      {flavor}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {isOrderMode && showFlavorError && (
              <p
                id={flavorErrorId}
                role="alert"
                className="mt-3 text-sm font-semibold text-chocolate"
              >
                Escolha um sabor para continuar.
              </p>
            )}
          </div>
        )}

        {isOrderMode && (
          <button
            type="button"
            onClick={handleAddProduct}
            className={`mt-7 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto ${
              wasAdded
                ? "bg-white text-chocolate ring-1 ring-chocolate/15"
                : "bg-chocolate text-white hover:bg-white hover:text-chocolate"
            }`}
          >
            <span aria-live="polite">
              {wasAdded ? "Adicionado ✓" : "Adicionar ao pedido"}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}
