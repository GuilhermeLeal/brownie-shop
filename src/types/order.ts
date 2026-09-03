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
  notes?: string;
  items: CreateOrderItemInput[];
};

export type CreatedOrder = {
  orderId: number;
  status: typeof pendingConfirmationStatus;
  productsTotalCents: number;
};

export type CreateOrderErrorResponse = {
  error: string;
};
