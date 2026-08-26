-- Migration number: 0001 	 2026-08-26T00:38:24.010Z

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL CHECK (length(trim(customer_name)) > 0),
  customer_phone TEXT NOT NULL CHECK (length(trim(customer_phone)) > 0),
  requested_date TEXT NOT NULL CHECK (
    length(requested_date) = 10
    AND requested_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
  ),
  fulfillment_type TEXT NOT NULL CHECK (
    fulfillment_type IN ('delivery', 'pickup')
  ),
  delivery_address TEXT,
  notes TEXT,
  products_total_cents INTEGER NOT NULL CHECK (products_total_cents >= 0),
  status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (
    length(trim(status)) > 0
  ),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (
      fulfillment_type = 'delivery'
      AND delivery_address IS NOT NULL
      AND length(trim(delivery_address)) > 0
    )
    OR (
      fulfillment_type = 'pickup'
      AND delivery_address IS NULL
    )
  )
) STRICT;

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id TEXT NOT NULL CHECK (length(trim(product_id)) > 0),
  product_name TEXT NOT NULL CHECK (length(trim(product_name)) > 0),
  flavor TEXT CHECK (flavor IS NULL OR length(trim(flavor)) > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_orders_requested_date ON orders(requested_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
