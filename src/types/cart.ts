export type CartItem = {
  id: string;
  productId: string;
  name: string;
  unitPriceInCents: number;
  quantity: number;
  flavor?: string;
  size?: {
    value: string;
    label: string;
  };
};
