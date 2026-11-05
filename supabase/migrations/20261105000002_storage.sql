-- =============================================================================
-- Bizzgu — bucket público para imagens de produtos
-- Qualquer pessoa vê as imagens; só admin envia, troca ou apaga.
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "imagens de produto: leitura pública" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');

create policy "imagens de produto: admin envia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "imagens de produto: admin atualiza" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "imagens de produto: admin apaga" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
