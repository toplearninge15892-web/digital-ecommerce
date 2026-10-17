/*
# Create ecommerce schema (products, orders, order_items)

## Overview
This migration builds the database for the Nexo e-commerce demo. It is a
single-tenant app with NO sign-in screen, so the frontend talks to Supabase
with the anon key for its entire lifetime. All policies are scoped to
`TO anon, authenticated` so the anon-key client can read and write its own
data. `USING (true)` is intentional here because the data is shared/public
by design (a public storefront and anonymous guest checkout).

## New Tables

1. `products`
   - `id` (text, primary key) — slug-style identifier (e.g. "aerobook")
   - `name` (text, not null) — display name
   - `category` (text, not null) — one of the catalog categories
   - `brand` (text, not null) — brand name
   - `price` (integer, not null) — list price in MXN cents-equivalent (whole pesos)
   - `discount` (integer, not null, default 0) — percentage 0..30
   - `image` (text, not null) — image URL
   - `description` (text, not null) — product description
   - `popular` (boolean, not null, default false) — shown on home page
   - `created_at` (timestamptz, default now())

2. `orders`
   - `id` (uuid, primary key)
   - `code` (text, unique, not null) — human-friendly order code like "NX-2048"
   - `customer_name` (text, not null)
   - `customer_email` (text, not null)
   - `customer_phone` (text)
   - `state` (text) — Mexican state for shipping
   - `city` (text) — city for shipping
   - `address` (text) — shipping address line
   - `payment_method` (text, not null)
   - `status` (text, not null, default 'Entregado') — one of order statuses
   - `total` (integer, not null) — total in whole pesos
   - `created_at` (timestamptz, default now())

3. `order_items`
   - `id` (uuid, primary key)
   - `order_id` (uuid, references orders(id) ON DELETE CASCADE)
   - `product_id` (text, references products(id) ON DELETE RESTRICT)
   - `product_name` (text, not null) — snapshot of product name at purchase time
   - `unit_price` (integer, not null) — snapshot of final price per unit
   - `quantity` (integer, not null)
   - `subtotal` (integer, not null) — unit_price * quantity

## Indexes
- `products_category_idx` on products(category) for catalog filtering.
- `orders_created_at_idx` on orders(created_at DESC) for order history.
- `order_items_order_id_idx` on order_items(order_id) for join lookups.

## Security
- RLS enabled on all three tables.
- Policies: anon + authenticated can SELECT/INSERT/UPDATE/DELETE on all
  tables. This is correct for a no-auth public storefront with anonymous
  guest checkout. There is no user_id / ownership concept because there
  are no accounts.
*/

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  brand text NOT NULL,
  price integer NOT NULL,
  discount integer NOT NULL DEFAULT 0,
  image text NOT NULL,
  description text NOT NULL,
  popular boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  state text,
  city text,
  address text,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'Entregado',
  total integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  unit_price integer NOT NULL,
  quantity integer NOT NULL,
  subtotal integer NOT NULL
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- products policies
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- orders policies
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- order_items policies
DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);
