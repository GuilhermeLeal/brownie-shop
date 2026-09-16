import type { FulfillmentMethod } from "@/types/checkout";

export const pendingConfirmationStatus = "pending_confirmation" as const;

export type CreateOrderItemInput = {
  productId: string;
  flavor?: string;
  size?: string;
  quantity: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  requestedDate: string;
  fulfillmentType: FulfillmentMethod;
  turnstileToken: string;
  notes?: string;
  items: CreateOrderItemInput[];
};

export type CreatedOrderItem = {
  readonly productId: string;
  readonly productName: string;
  readonly flavor: string | null;
  readonly size: string | null;
  readonly quantity: number;
  readonly unitPriceInCents: number;
};

export type CreatedOrder = {
  readonly orderId: number;
  readonly status: typeof pendingConfirmationStatus;
  readonly customerName: string;
  readonly requestedDate: string;
  readonly fulfillmentType: FulfillmentMethod;
  readonly notes: string | null;
  readonly items: readonly CreatedOrderItem[];
  readonly productsTotalCents: number;
};

export type CreateOrderErrorResponse = {
  error: string;
};
