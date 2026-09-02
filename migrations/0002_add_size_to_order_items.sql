-- Migration number: 0002

ALTER TABLE order_items
ADD COLUMN size TEXT CHECK (size IS NULL OR length(trim(size)) > 0);
