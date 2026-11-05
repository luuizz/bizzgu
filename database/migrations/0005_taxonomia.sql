-- Taxonomia da loja: categorias (já existiam) ganham imagem e data de edição,
-- e entram as tags, que se ligam aos produtos (muitos para muitos).

alter table public.categories
  add column image text,
  add column updated_at timestamptz not null default now();

create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create table public.tags (
  id           bigint generated always as identity primary key,
  name         text not null check (char_length(name) between 1 and 60),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description  text check (char_length(description) <= 500),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger tags_updated_at
  before update on public.tags
  for each row execute function public.set_updated_at();

create table public.product_tags (
  product_id  bigint not null references public.products (id) on delete cascade,
  tag_id      bigint not null references public.tags (id) on delete cascade,
  primary key (product_id, tag_id)
);

create index product_tags_tag_idx on public.product_tags (tag_id);

alter table public.tags enable row level security;
alter table public.product_tags enable row level security;

revoke all on public.tags, public.product_tags from anonymous, authenticated;
grant select on public.tags, public.product_tags to anonymous, authenticated;
grant insert, update, delete on public.tags, public.product_tags to authenticated;

create policy "tags: leitura pública" on public.tags
  for select to anonymous, authenticated using (true);
create policy "tags: admin insere" on public.tags
  for insert to authenticated with check (public.is_admin());
create policy "tags: admin edita" on public.tags
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "tags: admin exclui" on public.tags
  for delete to authenticated using (public.is_admin());

-- A ligação produto↔tag é pública; o produto em si continua protegido pelo RLS de products
create policy "produto_tags: leitura pública" on public.product_tags
  for select to anonymous, authenticated using (true);
create policy "produto_tags: admin insere" on public.product_tags
  for insert to authenticated with check (public.is_admin());
create policy "produto_tags: admin exclui" on public.product_tags
  for delete to authenticated using (public.is_admin());

-- Tags iniciais
insert into public.tags (name, slug, description) values
  ('Lançamento', 'lancamento', 'Os produtos mais novos da loja.'),
  ('Gamer', 'gamer', 'Para quem leva o jogo a sério.'),
  ('Casa conectada', 'casa-conectada', 'Tecnologia para deixar a casa mais prática.'),
  ('Ideia de presente', 'ideia-de-presente', 'Sugestões para acertar no presente.'),
  ('Home office', 'home-office', 'Conforto e produtividade para trabalhar de casa.');

insert into public.product_tags (product_id, tag_id)
select p.id, t.id
from (values
  ('playstation-5-825gb-branco', 'lancamento'),
  ('playstation-5-825gb-branco', 'gamer'),
  ('playstation-5-825gb-branco', 'ideia-de-presente'),
  ('controle-dualsense-midnight-black', 'gamer'),
  ('controle-dualsense-midnight-black', 'ideia-de-presente'),
  ('headset-hyperx-cloud-stinger-2', 'gamer'),
  ('headset-hyperx-cloud-stinger-2', 'home-office'),
  ('samsung-galaxy-s21-fe-256gb-violeta', 'lancamento'),
  ('motorola-moto-g84-5g-256gb', 'lancamento'),
  ('iphone-13-128gb-meia-noite', 'ideia-de-presente'),
  ('smart-tv-lg-55-4k-thinq', 'casa-conectada'),
  ('smart-tv-samsung-43-crystal-4k', 'casa-conectada'),
  ('air-fryer-mondial-4l', 'casa-conectada'),
  ('air-fryer-mondial-4l', 'ideia-de-presente'),
  ('cadeira-escritorio-ergonomica-mesh', 'home-office'),
  ('cafe-em-graos-especial-1kg', 'home-office')
) as link (product_slug, tag_slug)
join public.products p on p.slug = link.product_slug
join public.tags t on t.slug = link.tag_slug;
