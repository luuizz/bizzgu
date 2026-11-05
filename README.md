# Bizzgu — E-commerce com React + Neon

E-commerce completo feito com **React + Vite** no front-end e **Neon** no back-end: PostgreSQL, Neon Auth para login e Data API para o React consultar o banco direto. É um projeto de portfólio: o pagamento é simulado e nenhum valor é cobrado.

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
- Produtos: cadastro e edição com imagens (por link ou, com a função opcional, por upload), além de ativar/desativar e destacar direto na tabela
- Categorias: criar, editar, ordenar e excluir
- Clientes: lista com nº de pedidos e promoção a administrador

**Segurança (no banco de dados)**
- Row Level Security em todas as tabelas: cada cliente só vê os próprios pedidos, dados e desejos
- Visitantes sem login usam um token anônimo que só lê o catálogo
- Pedidos são criados por uma função no banco que **recalcula os preços** (o navegador não decide o valor), confere o estoque e o baixa de forma atômica. Duas pessoas comprando a última unidade ao mesmo tempo não geram venda dupla.
- Cliente não consegue se promover a admin, alterar pedidos nem mexer no catálogo

## Tecnologias

React 18 · Vite 4 · React Router 6 · styled-components · Swiper · Neon (`@neon/neon-js`: Neon Auth + Data API)

---

## Como rodar

### 1. Crie o projeto no Neon

1. Acesse [neon.com](https://neon.com), crie uma conta e um projeto. O plano gratuito é suficiente e permite vários projetos.
2. No Console do projeto, **ative o Auth (Neon Auth)** e depois a **Data API**. A Data API usa o Neon Auth para validar quem está logado.
3. Nas configurações do Auth, adicione os endereços que podem usar o login (domínios confiáveis):
   - `http://localhost:5173` (desenvolvimento)
   - `https://luuizz.github.io` (site publicado)

> A ordem importa: ative Auth e Data API **antes** de rodar o SQL. Eles criam a tabela de usuários, os papéis `authenticated`/`anonymous` e a função `auth.user_id()`, que o schema usa. Se faltar algo, o SQL para com uma mensagem explicando o que ativar.

### 2. Crie as tabelas e os dados de exemplo

No Console, abra o **SQL Editor** e rode, **nesta ordem**, o conteúdo de cada arquivo:

| Ordem | Arquivo | O que faz |
|---|---|---|
| 1 | `database/schema.sql` | Tabelas, regras de segurança e funções |
| 2 | `database/seed.sql` | 8 categorias e 18 produtos de exemplo |

### 3. Conecte o site ao Neon

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com a **Auth URL** (página do Auth no Console) e a **API URL** (página da Data API).

### 4. Instale e rode

```bash
yarn install
yarn dev
```

Acesse `http://localhost:5173`.

### 5. Vire administrador

Crie sua conta pelo site (`/cadastro`). O perfil é criado no primeiro acesso, então entre pelo menos uma vez antes do próximo passo. Depois, no **SQL Editor**, rode trocando pelo seu e-mail:

```sql
update public.profiles set role = 'admin' where email = 'seu-email@exemplo.com';
```

Recarregue a página: o menu da conta passa a mostrar **Painel administrativo**. Depois disso, novos admins podem ser promovidos pelo próprio painel, em **Clientes**.

### 6. (Opcional) Upload de imagens pelo painel

Sem este passo, o admin adiciona imagens **colando o link** de uma imagem já publicada. Para enviar arquivos direto do computador, publique a Neon Function `functions/product-images.ts`. Ela confere se quem envia é admin e grava a imagem num bucket público do Object Storage do Neon.

1. Instale a [Neon CLI](https://neon.com/docs/reference/neon-cli) e rode `neon link` na pasta do projeto.
2. Crie um arquivo `.env.neon` com os endereços do site:
   ```
   ALLOWED_ORIGINS=http://localhost:5173,https://luuizz.github.io
   ```
3. Rode `neon deploy --env .env.neon`. Isso cria o bucket `product-images` e a função, conforme o `neon.ts`.
4. Rode `neon functions get product-images`, copie o `invocation_url` e coloque no `.env.local`:
   ```
   VITE_UPLOAD_FUNCTION_URL=https://...
   ```

> O Object Storage e as Functions do Neon são recursos recentes. Se algum comando da CLI tiver mudado de nome, a [documentação do Neon](https://neon.com/docs/compute/functions/get-started) tem a versão atual.

---

## Deploy

### GitHub Pages (padrão do projeto)

O build já sai configurado para `https://luuizz.github.io/bizzgu/` e gera um `404.html`, para que links diretos como `/produto/...` funcionem.

```bash
yarn deploy
```

O comando usa os endereços do seu `.env.local` no build e publica a pasta `dist` na branch `gh-pages`. Lembre de adicionar `https://luuizz.github.io` nos domínios confiáveis do Neon Auth.

### Vercel / Netlify

Defina as variáveis `VITE_NEON_AUTH_URL`, `VITE_NEON_DATA_API_URL` (e `VITE_UPLOAD_FUNCTION_URL`, se usar) e `VITE_BASE_PATH=/` no painel da hospedagem. O `vercel.json` já redireciona todas as rotas para o `index.html`. Adicione o domínio da hospedagem nos domínios confiáveis do Neon Auth e no `ALLOWED_ORIGINS` da função.

---

## Estrutura

```
database/
  schema.sql         tabelas, RLS e funções (pedidos, estoque, painel admin)
  seed.sql           dados de exemplo
functions/
  product-images.ts  Neon Function opcional para upload de imagens
neon.ts              configuração da Neon CLI (bucket + função)
public/products/     fotos dos produtos de exemplo
src/
  lib/               cliente Neon e formatação (moeda, CEP, telefone...)
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
