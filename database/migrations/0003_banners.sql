-- Banners da home, gerenciados pelo painel (Admin → Banners).
--
-- Dois formatos:
--   'image' arte pronta: a imagem já traz o texto; o banner inteiro é um link
--   'text'  título, subtítulo e botão sobre o fundo da marca, com imagem opcional ao lado

create table public.banners (
  id            bigint generated always as identity primary key,
  layout        text not null default 'image' check (layout in ('image', 'text')),
  title         text not null check (char_length(title) between 1 and 120),
  subtitle      text check (char_length(subtitle) <= 200),
  cta_label     text check (char_length(cta_label) <= 40),
  link          text check (link is null or link ~ '^(/|https://)'),
  image         text,
  image_mobile  text,
  position      integer not null default 0,
  active        boolean not null default true,
  starts_at     timestamptz,
  ends_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint banners_image_layout check (layout = 'text' or image is not null),
  constraint banners_period check (starts_at is null or ends_at is null or starts_at < ends_at)
);

create index banners_position_idx on public.banners (position, id);

create trigger banners_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

alter table public.banners enable row level security;

revoke all on public.banners from anonymous, authenticated;
grant select on public.banners to anonymous, authenticated;
grant insert, update, delete on public.banners to authenticated;

-- Visitantes veem só os banners ativos e dentro do período; admins veem todos
create policy "banners: leitura dos publicados" on public.banners
  for select to anonymous, authenticated
  using (
    public.is_admin()
    or (active
        and (starts_at is null or starts_at <= now())
        and (ends_at is null or ends_at > now()))
  );

create policy "banners: admin insere" on public.banners
  for insert to authenticated with check (public.is_admin());
create policy "banners: admin edita" on public.banners
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "banners: admin exclui" on public.banners
  for delete to authenticated using (public.is_admin());

-- Os dois slides que estavam fixos no código
insert into public.banners (layout, title, subtitle, cta_label, link, image, position) values
  ('text', 'Seu smartphone vive travando?', 'Você merece um upgrade!', 'Faça o upgrade já!', '/categoria/celulares', 'banners/iphones.png', 1),
  ('text', 'A nova geração dos games chegou', 'PlayStation 5 com frete grátis e até 10x sem juros.', 'Ver consoles', '/categoria/games', null, 2);
