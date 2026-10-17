-- Create product-images storage bucket
-- Public bucket for product photos. App has no sign-in (single-tenant, anon-key),
-- so policies allow anon + authenticated to read, upload, update and delete.

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_read_product_images" ON storage.objects;
CREATE POLICY "anon_read_product_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_insert_product_images" ON storage.objects;
CREATE POLICY "anon_insert_product_images" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_update_product_images" ON storage.objects;
CREATE POLICY "anon_update_product_images" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_delete_product_images" ON storage.objects;
CREATE POLICY "anon_delete_product_images" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'product-images');
