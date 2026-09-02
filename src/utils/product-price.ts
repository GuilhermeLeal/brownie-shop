import type { Product } from "@/types/product";

export type ProductPricePresentation =
  | { kind: "fixed"; priceInCents: number }
  | { kind: "starting-at"; priceInCents: number }
  | { kind: "consult" };

export type ResolvedProductSelection = {
  flavor?: string;
  size?: {
    value: string;
    label: string;
  };
  unitPriceInCents: number;
};

export type ProductSelection = {
  flavor?: string;
  size?: string;
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

  const prices =
    product.priceType === "by-flavor" ? product.flavors : product.sizes;
  const lowestOptionPrice = prices.reduce<number | null>(
    (lowestPrice, option) =>
      lowestPrice === null
        ? option.priceInCents
        : Math.min(lowestPrice, option.priceInCents),
    null,
  );

  return lowestOptionPrice === null
    ? { kind: "consult" }
    : { kind: "starting-at", priceInCents: lowestOptionPrice };
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

  if (product.priceType === "by-size") {
    return null;
  }

  return product.flavors?.some(({ name }) => name === flavorName)
    ? product.priceInCents
    : null;
}

export function resolveProductSelection(
  product: Product,
  selection: ProductSelection = {},
): ResolvedProductSelection | null {
  if (product.priceType === "consult") {
    return null;
  }

  const normalizedFlavor = normalizeFlavor(selection.flavor);
  const normalizedSize = selection.size?.trim() || undefined;

  if (product.priceType === "by-flavor") {
    if (normalizedSize) {
      return null;
    }

    const flavor = product.flavors.find(
      ({ name }) => name === normalizedFlavor,
    );

    return flavor
      ? { flavor: flavor.name, unitPriceInCents: flavor.priceInCents }
      : null;
  }

  const flavor = product.flavors?.find(
    ({ name }) => name === normalizedFlavor,
  );

  if (product.flavors?.length ? !flavor : normalizedFlavor) {
    return null;
  }

  if (product.priceType === "by-size") {
    const size = product.sizes.find(({ value }) => value === normalizedSize);

    return size
      ? {
          flavor: flavor?.name,
          size: { value: size.value, label: size.label },
          unitPriceInCents: size.priceInCents,
        }
      : null;
  }

  if (normalizedSize) {
    return null;
  }

  return product.flavors?.length
    ? { flavor: flavor?.name, unitPriceInCents: product.priceInCents }
    : normalizedFlavor
    ? null
    : { unitPriceInCents: product.priceInCents };
}
