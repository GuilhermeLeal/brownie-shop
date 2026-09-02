export type CheckoutStep = "cart" | "details" | "review" | "success";

export type FulfillmentMethod = "delivery" | "pickup";

export type OrderDetails = {
  name: string;
  phone: string;
  desiredDate: string;
  fulfillmentMethod: FulfillmentMethod | "";
  address: string;
  notes: string;
};

export type OrderDetailsField =
  | "name"
  | "phone"
  | "desiredDate"
  | "fulfillmentMethod"
  | "address";

export type OrderDetailsErrors = Partial<
  Record<OrderDetailsField, string>
>;
