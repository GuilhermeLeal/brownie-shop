-- Migration number: 0003

PRAGMA defer_foreign_keys = ON;

CREATE TABLE orders_new (
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
  notes TEXT,
  products_total_cents INTEGER NOT NULL CHECK (products_total_cents >= 0),
  status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (
    length(trim(status)) > 0
  ),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

INSERT INTO orders_new (
  id,
  customer_name,
  customer_phone,
  requested_date,
  fulfillment_type,
  notes,
  products_total_cents,
  status,
  created_at,
  updated_at
)
SELECT
  id,
  customer_name,
  customer_phone,
  requested_date,
  fulfillment_type,
  notes,
  products_total_cents,
  status,
  created_at,
  updated_at
FROM orders;

CREATE TABLE order_items_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id TEXT NOT NULL CHECK (length(trim(product_id)) > 0),
  product_name TEXT NOT NULL CHECK (length(trim(product_name)) > 0),
  flavor TEXT CHECK (flavor IS NULL OR length(trim(flavor)) > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  size TEXT CHECK (size IS NULL OR length(trim(size)) > 0),
  FOREIGN KEY (order_id) REFERENCES orders_new(id) ON DELETE CASCADE
) STRICT;

INSERT INTO order_items_new (
  id,
  order_id,
  product_id,
  product_name,
  flavor,
  quantity,
  unit_price_cents,
  size
)
SELECT
  id,
  order_id,
  product_id,
  product_name,
  flavor,
  quantity,
  unit_price_cents,
  size
FROM order_items;

DROP TABLE order_items;
DROP TABLE orders;

ALTER TABLE orders_new RENAME TO orders;
ALTER TABLE order_items_new RENAME TO order_items;

CREATE INDEX idx_orders_requested_date ON orders(requested_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
