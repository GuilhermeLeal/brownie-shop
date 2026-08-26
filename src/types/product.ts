type ProductBase = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type ProductFlavor = {
  name: string;
};

export type PricedProductFlavor = ProductFlavor & {
  priceInCents: number;
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

export type ConsultPriceProduct = ProductBase & {
  priceType: "consult";
  flavors?: readonly ProductFlavor[];
  priceInCents?: never;
};

export type Product =
  | FixedPriceProduct
  | FlavorPricedProduct
  | ConsultPriceProduct;
