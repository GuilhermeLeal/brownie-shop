type ProductBase = {
  id: string;
  name: string;
  description: string;
  images: readonly string[];
};

export type ProductFlavor = {
  name: string;
};

export type PricedProductFlavor = ProductFlavor & {
  priceInCents: number;
};

type ProductSizeBase = {
  value: string;
  label: string;
  isApproximate?: boolean;
};

export type ProductSizeOption = ProductSizeBase & {
  priceInCents: number;
};

export type FlavorPricedProductSizeOption = ProductSizeBase & {
  flavorPrices: readonly PricedProductFlavor[];
};

export type FixedPriceProduct = ProductBase & {
  priceType: "fixed";
  priceInCents: number;
  flavors?: readonly ProductFlavor[];
};

export type FlavorPricedProduct = ProductBase & {
  priceType: "by-flavor";
  flavors: readonly PricedProductFlavor[];
  priceInCents?: never;
};

export type SizePricedProduct = ProductBase & {
  priceType: "by-size";
  sizes: readonly ProductSizeOption[];
  flavors?: readonly ProductFlavor[];
  priceInCents?: never;
};

export type SizeAndFlavorPricedProduct = ProductBase & {
  priceType: "by-size-and-flavor";
  sizes: readonly FlavorPricedProductSizeOption[];
  flavors: readonly ProductFlavor[];
  priceInCents?: never;
};

export type ConsultPriceProduct = ProductBase & {
  priceType: "consult";
  flavors?: readonly ProductFlavor[];
  priceInCents?: never;
};

export type Product =
  | FixedPriceProduct
  | FlavorPricedProduct
  | SizePricedProduct
  | SizeAndFlavorPricedProduct
  | ConsultPriceProduct;
