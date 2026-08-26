import type { Product } from "@/types/product";

export type ProductPricePresentation =
  | { kind: "fixed"; priceInCents: number }
  | { kind: "starting-at"; priceInCents: number }
  | { kind: "consult" };

export type ResolvedProductSelection = {
  flavor?: string;
  unitPriceInCents: number;
};

function normalizeFlavor(flavor?: string) {
  return flavor?.trim() || undefined;
}

export function getProductPricePresentation(
  product: Product,
): ProductPricePresentation {
  if (product.priceType === "consult") {
    return { kind: "consult" };
  }

  if (product.priceType === "fixed") {
    return { kind: "fixed", priceInCents: product.priceInCents };
  }

  const lowestFlavorPrice = product.flavors.reduce<number | null>(
    (lowestPrice, flavor) =>
      lowestPrice === null
        ? flavor.priceInCents
        : Math.min(lowestPrice, flavor.priceInCents),
    null,
  );

  return lowestFlavorPrice === null
    ? { kind: "consult" }
    : { kind: "starting-at", priceInCents: lowestFlavorPrice };
}

export function getFlavorPriceInCents(
  product: Product,
  flavorName: string,
) {
  if (product.priceType === "consult") {
    return null;
  }

  if (product.priceType === "by-flavor") {
    return (
      product.flavors.find(({ name }) => name === flavorName)?.priceInCents ??
      null
    );
  }

  return product.flavors?.some(({ name }) => name === flavorName)
    ? product.priceInCents
    : null;
}

export function resolveProductSelection(
  product: Product,
  selectedFlavor?: string,
): ResolvedProductSelection | null {
  if (product.priceType === "consult") {
    return null;
  }

  const normalizedFlavor = normalizeFlavor(selectedFlavor);

  if (product.priceType === "by-flavor") {
    const flavor = product.flavors.find(
      ({ name }) => name === normalizedFlavor,
    );

    return flavor
      ? { flavor: flavor.name, unitPriceInCents: flavor.priceInCents }
      : null;
  }

  if (product.flavors?.length) {
    const flavor = product.flavors.find(
      ({ name }) => name === normalizedFlavor,
    );

    return flavor
      ? { flavor: flavor.name, unitPriceInCents: product.priceInCents }
      : null;
  }

  return normalizedFlavor
    ? null
    : { unitPriceInCents: product.priceInCents };
}
