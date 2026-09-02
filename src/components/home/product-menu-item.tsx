"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format-currency";
import {
  getFlavorPriceInCents,
  getProductPricePresentation,
} from "@/utils/product-price";

type ProductMenuItemProps = {
  product: Product;
  index: number;
  isOrderMode: boolean;
  selectedFlavor: string | null;
  selectedSize: string | null;
  onFlavorToggle: (productId: string, flavor: string) => void;
  onSizeToggle: (productId: string, size: string) => void;
  onProductInteraction: (productId: string) => void;
  onProductAdded: (productId: string) => void;
};

export function ProductMenuItem({
  product,
  index,
  isOrderMode,
  selectedFlavor,
  selectedSize,
  onFlavorToggle,
  onSizeToggle,
  onProductInteraction,
  onProductAdded,
}: ProductMenuItemProps) {
  const { addProduct } = useCart();
  const [selectionErrors, setSelectionErrors] = useState({
    flavor: false,
    size: false,
  });
  const [wasAdded, setWasAdded] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageOnRight = index % 2 !== 0;
  const itemNumber = String(index + 1).padStart(2, "0");
  const flavorErrorId = `${product.id}-flavor-error`;
  const sizeErrorId = `${product.id}-size-error`;
  const blockColor = index % 2 === 0 ? "bg-secondary/40" : "bg-primary/40";
  const desktopColumns = imageOnRight
    ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
    : "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]";
  const pricePresentation = getProductPricePresentation(product);
  const productPriceLabel =
    pricePresentation.kind === "consult"
      ? "Consultar valor"
      : `${
          pricePresentation.kind === "starting-at" ? "A partir de " : ""
        }${formatCurrency(pricePresentation.priceInCents)}`;
  const hasSelectableFlavors =
    isOrderMode && product.priceType !== "consult";
  const sizeOptions =
    product.priceType === "by-size" ? product.sizes : undefined;
  const hasSelectableSizes = isOrderMode && Boolean(sizeOptions?.length);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  function handleFlavorClick(flavor: string) {
    setSelectionErrors((currentErrors) => ({
      ...currentErrors,
      flavor: false,
    }));
    onFlavorToggle(product.id, flavor);
  }

  function handleSizeClick(size: string) {
    setSelectionErrors((currentErrors) => ({
      ...currentErrors,
      size: false,
    }));
    onSizeToggle(product.id, size);
  }

  function handleAddProduct() {
    onProductInteraction(product.id);

    if (product.priceType === "consult") {
      return;
    }

    const missingFlavor = Boolean(product.flavors?.length && !selectedFlavor);
    const missingSize = Boolean(sizeOptions?.length && !selectedSize);

    setSelectionErrors({ flavor: missingFlavor, size: missingSize });

    if (missingFlavor || missingSize) {
      setWasAdded(false);
      return;
    }

    const wasSuccessfullyAdded = addProduct(product, {
      flavor: selectedFlavor ?? undefined,
      size: selectedSize ?? undefined,
    });

    if (!wasSuccessfullyAdded) {
      setSelectionErrors({
        flavor: Boolean(product.flavors?.length),
        size: Boolean(sizeOptions?.length),
      });
      return;
    }

    setSelectionErrors({ flavor: false, size: false });
    setWasAdded(true);
    onProductAdded(product.id);

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = setTimeout(() => {
      setWasAdded(false);
    }, 1600);
  }

  function getFlavorLabel(flavorName: string) {
    const flavorPriceInCents = getFlavorPriceInCents(product, flavorName);

    return flavorPriceInCents === null
      ? flavorName
      : `${flavorName} — ${formatCurrency(flavorPriceInCents)}`;
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
          {productPriceLabel}
        </p>

        {product.flavors && (
          <div className="mt-7 border-l-4 border-chocolate/20 pl-4">
            {hasSelectableFlavors ? (
              <fieldset
                aria-describedby={
                  selectionErrors.flavor ? flavorErrorId : undefined
                }
              >
                <legend className="text-sm font-bold">Sabores</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.flavors.map((flavor) => {
                    const isSelected = selectedFlavor === flavor.name;

                    return (
                      <button
                        key={flavor.name}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleFlavorClick(flavor.name)}
                        className={`cursor-pointer rounded-full border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 ${
                          isSelected
                            ? "border-chocolate bg-chocolate font-semibold text-white"
                            : "border-chocolate/20 bg-white/85 text-chocolate/75 hover:bg-white"
                        }`}
                      >
                        {getFlavorLabel(flavor.name)}
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
                      key={flavor.name}
                      className="rounded-full bg-white/60 px-3 py-2 text-sm text-chocolate/75"
                    >
                      {getFlavorLabel(flavor.name)}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {hasSelectableFlavors && selectionErrors.flavor && (
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

        {sizeOptions && (
          <div className="mt-7 border-l-4 border-chocolate/20 pl-4">
            {hasSelectableSizes ? (
              <fieldset
                aria-describedby={selectionErrors.size ? sizeErrorId : undefined}
              >
                <legend className="text-sm font-bold">Tamanhos</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizeOptions.map((size) => {
                    const isSelected = selectedSize === size.value;

                    return (
                      <button
                        key={size.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSizeClick(size.value)}
                        className={`cursor-pointer rounded-full border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2 ${
                          isSelected
                            ? "border-chocolate bg-chocolate font-semibold text-white"
                            : "border-chocolate/20 bg-white/85 text-chocolate/75 hover:bg-white"
                        }`}
                      >
                        {size.label} — {formatCurrency(size.priceInCents)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <>
                <p className="text-sm font-bold">Tamanhos</p>
                <ul
                  className="mt-3 flex flex-wrap gap-2"
                  aria-label={`Tamanhos de ${product.name}`}
                >
                  {sizeOptions.map((size) => (
                    <li
                      key={size.value}
                      className="rounded-full bg-white/60 px-3 py-2 text-sm text-chocolate/75"
                    >
                      {size.label} — {formatCurrency(size.priceInCents)}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {hasSelectableSizes && selectionErrors.size && (
              <p
                id={sizeErrorId}
                role="alert"
                className="mt-3 text-sm font-semibold text-chocolate"
              >
                Escolha um tamanho para continuar.
              </p>
            )}
          </div>
        )}

        {isOrderMode &&
          (product.priceType === "consult" ? (
            <p className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white/65 px-6 py-3 font-bold text-chocolate/75 ring-1 ring-chocolate/10 sm:w-auto">
              Valor sob consulta
            </p>
          ) : (
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
          ))}
      </div>
    </article>
  );
}
