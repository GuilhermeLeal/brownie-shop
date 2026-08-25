export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  flavors?: readonly string[];
};
