import { pendingConfirmationStatus, type CreatedOrder } from "@/types/order";
import type { ValidatedOrder } from "@/server/orders/validate-order";

const insertOrderSql = `
  INSERT INTO orders (
    customer_name,
    customer_phone,
    requested_date,
    fulfillment_type,
    notes,
    products_total_cents,
    status
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

export async function createOrder(
  database: D1Database,
  order: ValidatedOrder,
): Promise<CreatedOrder> {
  const insertOrder = database.prepare(insertOrderSql).bind(
    order.customerName,
    order.customerPhone,
    order.requestedDate,
    order.fulfillmentType,
    order.notes,
    order.productsTotalCents,
    pendingConfirmationStatus,
  );
  const itemSelects = order.items
    .map(
      (_, index) =>
        `${index === 0 ? "" : "UNION ALL "}SELECT new_order.order_id, ?, ?, ?, ?, ?, ? FROM new_order`,
    )
    .join(" ");
  const itemValues = order.items.flatMap((item) => [
    item.productId,
    item.productName,
    item.flavor,
    item.size,
    item.quantity,
    item.unitPriceInCents,
  ]);
  const insertItems = database
    .prepare(`
      WITH new_order(order_id) AS MATERIALIZED (
        SELECT last_insert_rowid()
      )
      INSERT INTO order_items (
        order_id,
        product_id,
        product_name,
        flavor,
        size,
        quantity,
        unit_price_cents
      )
      ${itemSelects}
    `)
    .bind(...itemValues);

  const [orderResult] = await database.batch([insertOrder, insertItems]);
  const orderId = orderResult.meta.last_row_id;

  if (!Number.isSafeInteger(orderId) || orderId < 1) {
    throw new Error("D1 did not return a valid order ID.");
  }

  return {
    orderId,
    status: pendingConfirmationStatus,
    productsTotalCents: order.productsTotalCents,
  };
}
