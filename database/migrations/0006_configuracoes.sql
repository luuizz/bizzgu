-- Configurações da loja (Admin → Loja → Configurações): texto do "Sobre",
-- contatos e redes sociais. Uma linha só (id = 1).

create table public.store_settings (
  id              smallint primary key default 1 check (id = 1),
  about_title     text not null default 'Conheça a Bizzgu' check (char_length(about_title) <= 120),
  about_summary   text check (char_length(about_summary) <= 400),
  about_text      text check (char_length(about_text) <= 8000),
  about_image     text,
  support_email   text check (support_email is null or support_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  press_email     text check (press_email is null or press_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone           text check (char_length(phone) <= 30),
  whatsapp        text check (whatsapp is null or whatsapp ~ '^[0-9]{10,15}$'),
  business_hours  text check (char_length(business_hours) <= 120),
  address         text check (char_length(address) <= 200),
  instagram       text check (instagram is null or instagram ~ '^https://'),
  facebook        text check (facebook is null or facebook ~ '^https://'),
  youtube         text check (youtube is null or youtube ~ '^https://'),
  linkedin        text check (linkedin is null or linkedin ~ '^https://'),
  x               text check (x is null or x ~ '^https://'),
  tiktok          text check (tiktok is null or tiktok ~ '^https://'),
  updated_at      timestamptz not null default now()
);

create trigger store_settings_updated_at
  before update on public.store_settings
  for each row execute function public.set_updated_at();

alter table public.store_settings enable row level security;

revoke all on public.store_settings from anonymous, authenticated;
grant select on public.store_settings to anonymous, authenticated;
grant update on public.store_settings to authenticated;

create policy "configurações: leitura pública" on public.store_settings
  for select to anonymous, authenticated using (true);
create policy "configurações: admin edita" on public.store_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.store_settings (
  about_title, about_summary, about_text,
  support_email, press_email, business_hours,
  instagram, facebook, youtube, linkedin, x
) values (
  'Conheça a Bizzgu',
  'Eletrônicos, casa e lazer com preço justo, frete grátis acima de R$ 299 e atendimento de verdade.',
  E'A Bizzgu nasceu para deixar a compra de tecnologia simples: produtos selecionados, preço claro e entrega para todo o Brasil.\n\nDo smartphone novo ao café da manhã, reunimos o que faz diferença no dia a dia, com parcelamento em até 10x sem juros e frete grátis a partir de R$ 299.\n\nEste é um projeto de portfólio: o catálogo, os pedidos e o pagamento são de demonstração e nenhum valor é cobrado.',
  'oi@bizzgu.com.br', 'contato@bizzgu.com.br', '24 horas',
  'https://www.instagram.com/', 'https://www.facebook.com/', 'https://www.youtube.com/',
  'https://www.linkedin.com/', 'https://x.com/'
);
