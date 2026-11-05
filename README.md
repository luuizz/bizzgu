# Bizzgu — E-commerce com React + Supabase

E-commerce completo feito com **React + Vite** no front-end e **Supabase** (PostgreSQL, autenticação e armazenamento de imagens) no back-end. É um projeto de portfólio: o pagamento é simulado e nenhum valor é cobrado.

## Funcionalidades

**Loja**
- Catálogo, categorias, página de produto com galeria e produtos relacionados
- Busca pelo cabeçalho, página de ofertas e ordenação (preço, nome, lançamentos)
- Carrinho salvo no navegador, que confere preço e estoque com o banco ao abrir
- Lista de desejos por usuário
- Checkout com preenchimento automático de endereço pelo CEP (ViaCEP)
- Frete grátis a partir de R$ 299 (abaixo disso, R$ 19,90)

**Conta do cliente** (`/minha-conta`)
- Cadastro, login, recuperação e troca de senha
- Resumo com números da conta e pedidos recentes
- Histórico de pedidos com filtros e acompanhamento por etapas
- Pagamento simulado e cancelamento de pedidos pendentes
- Edição de nome e telefone

**Painel administrativo** (`/admin`)
- Faturamento, ticket médio, gráfico de vendas dos últimos 30 dias, mais vendidos e estoque baixo
- Pedidos: filtro por status, busca e avanço de status (pago → enviado → entregue, ou cancelado)
- Produtos: cadastro e edição com upload de imagens, além de ativar/desativar e destacar direto na tabela
- Categorias: criar, editar, ordenar e excluir
- Clientes: lista com nº de pedidos e promoção a administrador

**Segurança (no banco de dados)**
- Row Level Security em todas as tabelas: cada cliente só vê os próprios pedidos, dados e desejos
- Pedidos são criados por uma função no banco que **recalcula os preços** (o navegador não decide o valor), confere o estoque e o baixa de forma atômica. Duas pessoas comprando a última unidade ao mesmo tempo não geram venda dupla.
- Cliente não consegue se promover a admin, alterar pedidos nem mexer no catálogo

## Tecnologias

React 18 · Vite 4 · React Router 6 · styled-components · Swiper · Supabase (`@supabase/supabase-js` v2)

---

## Como rodar

### 1. Crie o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com), crie uma conta e clique em **New project** (o plano gratuito é suficiente).
2. Escolha um nome e uma senha para o banco e aguarde a criação, que leva cerca de 2 minutos.

### 2. Crie as tabelas e os dados de exemplo

No painel do projeto, abra **SQL Editor → New query** e rode, **nesta ordem**, o conteúdo de cada arquivo:

| Ordem | Arquivo | O que faz |
|---|---|---|
| 1 | `supabase/migrations/20261105000001_schema.sql` | Tabelas, regras de segurança e funções |
| 2 | `supabase/migrations/20261105000002_storage.sql` | Bucket público para as imagens dos produtos |
| 3 | `supabase/seed.sql` | 8 categorias e 18 produtos de exemplo |

> Se você usa a [Supabase CLI](https://supabase.com/docs/guides/cli), pode trocar esse passo por `supabase link` + `supabase db push` (e rodar o `seed.sql` no SQL Editor).

### 3. Configure a autenticação

Em **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:5173` (troque pela URL publicada depois do deploy)
- **Redirect URLs**: adicione `http://localhost:5173/**` e, depois, `https://luuizz.github.io/bizzgu/**`

Em **Authentication → Providers → Email** (ou **Sign In / Providers**), você decide se o cadastro exige confirmação por e-mail. Para testar mais rápido, desative **Confirm email**: assim a pessoa entra logo após se cadastrar. O site funciona dos dois jeitos.

### 4. Conecte o site ao Supabase

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com a **Project URL** e a **chave pública** (publishable/anon), que ficam em **Project Settings → API Keys** (ou **API**).

### 5. Instale e rode

```bash
yarn install
yarn dev
```

Acesse `http://localhost:5173`.

### 6. Vire administrador

Crie sua conta pelo site (`/cadastro`) e, no **SQL Editor**, rode trocando pelo seu e-mail:

```sql
update public.profiles set role = 'admin' where email = 'seu-email@exemplo.com';
```

Recarregue a página: o menu da conta passa a mostrar **Painel administrativo**. Depois disso, novos admins podem ser promovidos pelo próprio painel, em **Clientes**.

---

## Deploy

### GitHub Pages (padrão do projeto)

O build já sai configurado para `https://luuizz.github.io/bizzgu/` e gera um `404.html`, para que links diretos como `/produto/...` funcionem.

```bash
yarn deploy
```

O comando usa as chaves do seu `.env.local` no build e publica a pasta `dist` na branch `gh-pages`. Lembre de adicionar a URL publicada nas **Redirect URLs** do Supabase.

### Vercel / Netlify

Defina as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` e `VITE_BASE_PATH=/` no painel da hospedagem. O `vercel.json` já redireciona todas as rotas para o `index.html`.

---

## Estrutura

```
supabase/
  migrations/        schema, RLS, funções e storage
  seed.sql           dados de exemplo
public/products/     fotos dos produtos de exemplo
src/
  lib/               cliente Supabase e formatação (moeda, CEP, telefone...)
  services/          acesso a dados (catálogo, pedidos, conta, admin, CEP)
  context/           providers: autenticação, carrinho, desejos, toasts
  hooks/             useAuth, useCart, useAsync, useCategories...
  components/
    ui/              botões, campos, badges, tabela, estados vazios
    product/         card, grade, galeria, quantidade, desejos
    Header/ NavBar/ Footer/ Slider/
  pages/
    auth/            login, cadastro, recuperar e redefinir senha
    account/         área do cliente
    admin/           painel administrativo
```

## Scripts

| Comando | Descrição |
|---|---|
| `yarn dev` | Servidor de desenvolvimento |
| `yarn build` | Build de produção em `dist/` |
| `yarn preview` | Testa o build localmente |
| `yarn lint` | ESLint |
| `yarn deploy` | Build + publicação no GitHub Pages |
