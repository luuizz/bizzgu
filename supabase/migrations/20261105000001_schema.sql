-- =============================================================================
-- Bizzgu — schema do e-commerce (Supabase / PostgreSQL)
-- Tabelas, segurança por linha (RLS) e funções de negócio.
-- Rode este arquivo no SQL Editor do Supabase (ou via `supabase db push`).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Utilitários
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Perfis (1:1 com auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cria o perfil automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- O usuário logado é admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Catálogo
-- -----------------------------------------------------------------------------
create table public.categories (
  id           bigint generated always as identity primary key,
  name         text not null,
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description  text,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create table public.products (
  id                bigint generated always as identity primary key,
  category_id       bigint references public.categories (id) on delete set null,
  name              text not null,
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description       text,
  price             numeric(10, 2) not null check (price >= 0),
  compare_at_price  numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  stock             int not null default 0 check (stock >= 0),
  images            text[] not null default '{}',
  featured          boolean not null default false,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index products_category_idx on public.products (category_id);
create index products_active_featured_idx on public.products (active, featured);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Pedidos
-- -----------------------------------------------------------------------------
create table public.orders (
  id                bigint generated always as identity primary key,
  user_id           uuid not null references public.profiles (id) on delete cascade,
  status            text not null default 'pending'
                    check (status in ('pending', 'paid', 'shipped', 'delivered', 'canceled')),
  payment_method    text not null check (payment_method in ('pix', 'credit_card', 'boleto')),
  subtotal          numeric(10, 2) not null,
  shipping          numeric(10, 2) not null,
  total             numeric(10, 2) not null,
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text,
  shipping_address  jsonb not null,
  paid_at           timestamptz,
  shipped_at        timestamptz,
  delivered_at      timestamptz,
  canceled_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index orders_user_idx on public.orders (user_id, created_at desc);
create index orders_status_idx on public.orders (status);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id            bigint generated always as identity primary key,
  order_id      bigint not null references public.orders (id) on delete cascade,
  product_id    bigint references public.products (id) on delete set null,
  product_name  text not null,
  product_slug  text,
  product_image text,
  unit_price    numeric(10, 2) not null,
  quantity      int not null check (quantity > 0)
);

create index order_items_order_idx on public.order_items (order_id);
create index order_items_product_idx on public.order_items (product_id);

-- -----------------------------------------------------------------------------
-- Lista de desejos
-- -----------------------------------------------------------------------------
create table public.wishlist_items (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  product_id  bigint not null references public.products (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- =============================================================================
-- Permissões e RLS
-- O Supabase concede tudo a anon/authenticated por padrão; aqui restringimos
-- explicitamente e deixamos as regras finas para as policies.
-- =============================================================================
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.wishlist_items enable row level security;

revoke all on public.profiles, public.categories, public.products,
              public.orders, public.order_items, public.wishlist_items
  from anon, authenticated;

-- Perfis: cada um vê o seu (admin vê todos) e só pode editar nome e telefone.
-- O papel (role) só muda pela função admin_set_role.
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

create policy "perfil: ler o próprio ou admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "perfil: editar o próprio" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Categorias: leitura pública, escrita só admin
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

create policy "categorias: leitura pública" on public.categories
  for select to anon, authenticated
  using (true);

create policy "categorias: admin insere" on public.categories
  for insert to authenticated with check (public.is_admin());
create policy "categorias: admin edita" on public.categories
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "categorias: admin exclui" on public.categories
  for delete to authenticated using (public.is_admin());

-- Produtos: público vê os ativos; admin vê e altera tudo
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

create policy "produtos: leitura dos ativos" on public.products
  for select to anon, authenticated
  using (active or public.is_admin());

create policy "produtos: admin insere" on public.products
  for insert to authenticated with check (public.is_admin());
create policy "produtos: admin edita" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "produtos: admin exclui" on public.products
  for delete to authenticated using (public.is_admin());

-- Pedidos: somente leitura pela API; toda escrita passa pelas funções abaixo,
-- que validam estoque e recalculam preços no servidor.
grant select on public.orders, public.order_items to authenticated;

create policy "pedidos: dono ou admin" on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "itens: dono do pedido ou admin" on public.order_items
  for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Lista de desejos: cada um mexe só na sua
grant select, insert, delete on public.wishlist_items to authenticated;

create policy "desejos: ler os próprios" on public.wishlist_items
  for select to authenticated using (user_id = auth.uid());
create policy "desejos: adicionar aos próprios" on public.wishlist_items
  for insert to authenticated with check (user_id = auth.uid());
create policy "desejos: remover dos próprios" on public.wishlist_items
  for delete to authenticated using (user_id = auth.uid());

-- =============================================================================
-- Funções de negócio (RPC)
-- =============================================================================

-- Frete: grátis a partir de R$ 299,00; senão R$ 19,90
create or replace function public.shipping_for(p_subtotal numeric)
returns numeric
language sql
immutable
as $$
  select case when p_subtotal >= 299 then 0::numeric else 19.90::numeric end;
$$;

-- Cria o pedido de forma atômica: trava os produtos, confere estoque,
-- usa o preço do banco (nunca o do navegador) e baixa o estoque.
--   p_items:    [{ "product_id": 1, "quantity": 2 }, ...]
--   p_customer: { "name", "email", "phone" }
--   p_address:  { "cep", "street", "number", "complement", "district", "city", "state" }
create or replace function public.create_order(
  p_items jsonb,
  p_customer jsonb,
  p_address jsonb,
  p_payment_method text
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user     uuid := auth.uid();
  v_order_id bigint;
  v_subtotal numeric(10, 2) := 0;
  v_item     record;
  v_product  public.products%rowtype;
  v_field    text;
begin
  if v_user is null then
    raise exception 'Faça login para finalizar a compra.' using errcode = '42501';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'O carrinho está vazio.' using errcode = '22023';
  end if;

  if p_payment_method not in ('pix', 'credit_card', 'boleto') then
    raise exception 'Forma de pagamento inválida.' using errcode = '22023';
  end if;

  if coalesce(trim(p_customer ->> 'name'), '') = '' or coalesce(trim(p_customer ->> 'email'), '') = '' then
    raise exception 'Informe nome e e-mail.' using errcode = '22023';
  end if;

  foreach v_field in array array['cep', 'street', 'number', 'city', 'state'] loop
    if coalesce(trim(p_address ->> v_field), '') = '' then
      raise exception 'Endereço incompleto: preencha o campo %.', v_field using errcode = '22023';
    end if;
  end loop;

  -- Primeiro passe: valida e trava (sempre na mesma ordem para evitar deadlock)
  for v_item in
    select (e ->> 'product_id')::bigint as product_id, sum((e ->> 'quantity')::int) as quantity
    from jsonb_array_elements(p_items) e
    group by 1
    order by 1
  loop
    if v_item.quantity is null or v_item.quantity <= 0 then
      raise exception 'Quantidade inválida.' using errcode = '22023';
    end if;

    select * into v_product from public.products where id = v_item.product_id for update;

    if not found or not v_product.active then
      raise exception 'Um dos produtos não está mais disponível.' using errcode = 'P0001';
    end if;

    if v_product.stock < v_item.quantity then
      raise exception 'Estoque insuficiente para "%": restam % unidade(s).', v_product.name, v_product.stock
        using errcode = 'P0001';
    end if;

    v_subtotal := v_subtotal + v_product.price * v_item.quantity;
  end loop;

  insert into public.orders (
    user_id, payment_method, subtotal, shipping, total,
    customer_name, customer_email, customer_phone, shipping_address
  ) values (
    v_user, p_payment_method, v_subtotal, public.shipping_for(v_subtotal),
    v_subtotal + public.shipping_for(v_subtotal),
    trim(p_customer ->> 'name'), trim(p_customer ->> 'email'),
    nullif(trim(p_customer ->> 'phone'), ''), p_address
  )
  returning id into v_order_id;

  -- Segundo passe: grava os itens (com cópia do nome/preço) e baixa o estoque
  for v_item in
    select (e ->> 'product_id')::bigint as product_id, sum((e ->> 'quantity')::int) as quantity
    from jsonb_array_elements(p_items) e
    group by 1
  loop
    insert into public.order_items (order_id, product_id, product_name, product_slug, product_image, unit_price, quantity)
    select v_order_id, p.id, p.name, p.slug, p.images[1], p.price, v_item.quantity
    from public.products p where p.id = v_item.product_id;

    update public.products set stock = stock - v_item.quantity where id = v_item.product_id;
  end loop;

  -- Mantém nome/telefone do perfil atualizados se ainda estiverem vazios
  update public.profiles
     set full_name = coalesce(full_name, trim(p_customer ->> 'name')),
         phone     = coalesce(phone, nullif(trim(p_customer ->> 'phone'), ''))
   where id = v_user;

  return v_order_id;
end;
$$;

-- Devolve ao estoque os itens de um pedido (uso interno)
create or replace function public.restock_order(p_order_id bigint)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.products p
     set stock = p.stock + oi.quantity
    from public.order_items oi
   where oi.order_id = p_order_id and oi.product_id = p.id;
$$;

-- Pagamento simulado: o cliente "paga" o próprio pedido pendente
create or replace function public.pay_order(p_order_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.orders
     set status = 'paid', paid_at = now()
   where id = p_order_id and user_id = auth.uid() and status = 'pending';

  if not found then
    raise exception 'Pedido não encontrado ou já pago.' using errcode = 'P0001';
  end if;
end;
$$;

-- O cliente cancela o próprio pedido enquanto ainda estiver pendente
create or replace function public.cancel_order(p_order_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.orders
     set status = 'canceled', canceled_at = now()
   where id = p_order_id and user_id = auth.uid() and status = 'pending';

  if not found then
    raise exception 'Só é possível cancelar pedidos aguardando pagamento.' using errcode = 'P0001';
  end if;

  perform public.restock_order(p_order_id);
end;
$$;

-- Admin: muda o status do pedido (cancelar devolve ao estoque)
create or replace function public.admin_update_order_status(p_order_id bigint, p_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current text;
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito a administradores.' using errcode = '42501';
  end if;

  if p_status not in ('pending', 'paid', 'shipped', 'delivered', 'canceled') then
    raise exception 'Status inválido.' using errcode = '22023';
  end if;

  select status into v_current from public.orders where id = p_order_id for update;

  if not found then
    raise exception 'Pedido não encontrado.' using errcode = 'P0001';
  end if;

  if v_current = 'canceled' and p_status <> 'canceled' then
    raise exception 'Pedidos cancelados não podem ser reabertos.' using errcode = 'P0001';
  end if;

  if v_current = p_status then
    return;
  end if;

  update public.orders
     set status       = p_status,
         paid_at      = case when p_status in ('paid', 'shipped', 'delivered') then coalesce(paid_at, now()) else paid_at end,
         shipped_at   = case when p_status in ('shipped', 'delivered') then coalesce(shipped_at, now()) else shipped_at end,
         delivered_at = case when p_status = 'delivered' then coalesce(delivered_at, now()) else delivered_at end,
         canceled_at  = case when p_status = 'canceled' then now() else canceled_at end
   where id = p_order_id;

  if p_status = 'canceled' then
    perform public.restock_order(p_order_id);
  end if;
end;
$$;

-- Admin: promove/rebaixa usuários
create or replace function public.admin_set_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito a administradores.' using errcode = '42501';
  end if;

  if p_role not in ('customer', 'admin') then
    raise exception 'Papel inválido.' using errcode = '22023';
  end if;

  if p_user_id = auth.uid() and p_role <> 'admin' then
    raise exception 'Você não pode remover o seu próprio acesso de admin.' using errcode = 'P0001';
  end if;

  update public.profiles set role = p_role where id = p_user_id;
end;
$$;

-- Admin: números do painel
create or replace function public.admin_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito a administradores.' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'revenue', coalesce((select sum(total) from public.orders where status in ('paid', 'shipped', 'delivered')), 0),
    'orders_count', (select count(*) from public.orders),
    'orders_pending', (select count(*) from public.orders where status = 'pending'),
    'orders_to_ship', (select count(*) from public.orders where status = 'paid'),
    'customers_count', (select count(*) from public.profiles where role = 'customer'),
    'products_active', (select count(*) from public.products where active),
    'average_ticket', coalesce((select round(avg(total), 2) from public.orders where status in ('paid', 'shipped', 'delivered')), 0),
    'sales_by_day', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d.day, 'total', d.total, 'orders', d.orders) order by d.day), '[]'::jsonb)
      from (
        select gs::date as day,
               coalesce(sum(o.total), 0) as total,
               count(o.id) as orders
        from generate_series(current_date - 29, current_date, interval '1 day') gs
        left join public.orders o
          on o.created_at::date = gs::date and o.status in ('paid', 'shipped', 'delivered')
        group by gs
      ) d
    ),
    'top_products', (
      select coalesce(jsonb_agg(t), '[]'::jsonb)
      from (
        select oi.product_name as name, sum(oi.quantity) as quantity, sum(oi.quantity * oi.unit_price) as revenue
        from public.order_items oi
        join public.orders o on o.id = oi.order_id
        where o.status <> 'canceled'
        group by oi.product_name
        order by quantity desc
        limit 5
      ) t
    ),
    'low_stock', (
      select coalesce(jsonb_agg(l), '[]'::jsonb)
      from (
        select id, name, slug, stock
        from public.products
        where active and stock <= 5
        order by stock, name
        limit 10
      ) l
    )
  ) into v_result;

  return v_result;
end;
$$;

-- Funções: só usuários logados podem chamar (cada uma valida o resto)
revoke execute on function
  public.create_order(jsonb, jsonb, jsonb, text),
  public.pay_order(bigint),
  public.cancel_order(bigint),
  public.restock_order(bigint),
  public.admin_update_order_status(bigint, text),
  public.admin_set_role(uuid, text),
  public.admin_dashboard()
  from public, anon;

grant execute on function
  public.create_order(jsonb, jsonb, jsonb, text),
  public.pay_order(bigint),
  public.cancel_order(bigint),
  public.admin_update_order_status(bigint, text),
  public.admin_set_role(uuid, text),
  public.admin_dashboard()
  to authenticated;

-- restock_order é interna: ninguém chama direto pela API
revoke execute on function public.restock_order(bigint) from authenticated;
