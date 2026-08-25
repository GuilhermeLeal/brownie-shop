export type Product = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  image: string;
  flavors?: readonly string[];
};
