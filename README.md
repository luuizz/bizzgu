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

**Painel administrativo** (`/admin`): layout próprio de dashboard, separado da loja (menu lateral, barra superior com breadcrumb e menu do usuário, menu recolhível no celular)
- Faturamento, ticket médio, gráfico de vendas dos últimos 30 dias, mais vendidos e estoque baixo
- Pedidos: filtro por status, busca e avanço de status (pago → enviado → entregue, ou cancelado)
- Produtos: cadastro e edição com imagens (upload para o Vercel Blob ou link), além de ativar/desativar e destacar direto na tabela
- Taxonomia no estilo WordPress: **categorias** (com imagem e ordem no menu) e **tags**, cada termo com página própria de edição, contagem de produtos e atalho para filtrá-los
- Tags no cadastro do produto (escolher ou criar na hora) e páginas `/tag/:slug` na loja
- Banners da home: artes para computador (1920×480) e celular (1080×1080), com pré-visualização, link, ordem do carrossel e agendamento (início/fim)
- Clientes: lista com nº de pedidos e promoção a administrador
- Configurações da loja: texto e imagem do "Sobre" (seção na home e página `/sobre`), contatos (e-mail, WhatsApp, telefone, horário, endereço) e redes sociais do rodapé

**Segurança (no banco de dados)**
- Row Level Security em todas as tabelas: cada cliente só vê os próprios pedidos, dados e desejos
- Visitantes sem login usam um token anônimo que só lê o catálogo
- Pedidos são criados por uma função no banco que **recalcula os preços** (o navegador não decide o valor), confere o estoque e o baixa de forma atômica. Duas pessoas comprando a última unidade ao mesmo tempo não geram venda dupla.
- Cliente não consegue se promover a admin, alterar pedidos nem mexer no catálogo

## Tecnologias

React 18 · Vite 4 · React Router 6 · styled-components · Swiper · [Phosphor Icons](https://phosphoricons.com) (variante duotone) · Neon (`@neon/neon-js`: Neon Auth + Data API) · GitHub Actions + Vercel (Analytics e Speed Insights)

---

## Como rodar

### 1. Crie o projeto no Neon

1. Acesse [neon.com](https://neon.com), crie uma conta e um projeto. O plano gratuito é suficiente e permite vários projetos.
2. No Console do projeto, **ative o Auth (Neon Auth)** e depois a **Data API**. A Data API usa o Neon Auth para validar quem está logado.
3. Nas configurações do Auth, adicione os endereços que podem usar o login (domínios confiáveis):
   - `http://localhost:5173` (desenvolvimento)
   - `https://bizzgu.vercel.app` (site publicado, ou o seu domínio)

> A ordem importa: ative Auth e Data API **antes** de criar as tabelas. Eles criam a tabela de usuários, os papéis `authenticated`/`anonymous` e a função `auth.user_id()`, que o schema usa. Se faltar algo, a migration para com uma mensagem explicando o que ativar.

### 2. Conecte o projeto ao Neon

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com:

| Variável | Onde achar no Console do Neon |
|---|---|
| `VITE_NEON_AUTH_URL` | página do **Auth** |
| `VITE_NEON_DATA_API_URL` | página da **Data API** |
| `DATABASE_URL` | botão **Connect** (connection string). Usada só pelo `yarn db:migrate`, nunca vai para o navegador |

### 3. Crie as tabelas e os dados de exemplo

```bash
yarn install
yarn db:migrate
```

O comando aplica, em ordem, os arquivos de `database/migrations/` que ainda não rodaram nesse banco:

| Arquivo | O que faz |
|---|---|
| `0001_schema.sql` | Tabelas, regras de segurança e funções |
| `0002_seed.sql` | 8 categorias e 18 produtos de exemplo |
| `0003_banners.sql` | Banners da home |
| `0004_banners_so_imagem.sql` | Banners passam a ser só imagem; 3 banners iniciais com artes prontas |
| `0005_taxonomia.sql` | Tags (e ligação com produtos) e imagem nas categorias, com 5 tags de exemplo |
| `0006_configuracoes.sql` | Configurações da loja: Sobre, contatos e redes sociais |

> Já rodou esses arquivos antes pelo SQL Editor? Use `yarn db:migrate --baseline` uma vez para marcá-los como aplicados sem rodar de novo.

### 4. Rode o site

```bash
yarn dev
```

Acesse `http://localhost:5173`.

### 5. Vire administrador

Crie sua conta pelo site (`/cadastro`). O perfil é criado no primeiro acesso, então entre pelo menos uma vez antes do próximo passo. Depois, no **SQL Editor**, rode trocando pelo seu e-mail:

```sql
update public.profiles set role = 'admin' where email = 'seu-email@exemplo.com';
```

Recarregue a página: o menu da conta passa a mostrar **Painel administrativo** (`/admin`). Depois disso, novos admins podem ser promovidos pelo próprio painel, em **Clientes**.

### 6. Upload de imagens pelo painel (Vercel Blob)

No site publicado, o admin pode enviar imagens (produtos e banners) direto do computador (JPG, PNG, WebP, AVIF ou GIF, até 4 MB). Quem recebe é a função `api/images.js`, que roda na Vercel: ela pergunta ao próprio banco (`is_admin()` pela Data API, com o token de quem está logado) se a pessoa é admin e grava o arquivo no **Vercel Blob**. A função não guarda senha do banco.

Configuração única, no projeto da Vercel:

1. **Storage → Create → Blob**, dê um nome (ex.: `bizzgu-imagens`) e conecte ao projeto `bizzgu` no ambiente **Production**. A Vercel cria sozinha a variável `BLOB_READ_WRITE_TOKEN`.
2. **Settings → Environment Variables → Add**: `NEON_DATA_API_URL` com o mesmo valor do `VITE_NEON_DATA_API_URL` (ambiente **Production**).
3. Rode o deploy de novo (**Actions → Deploy → Run workflow**) para a função receber as variáveis.

No `yarn dev` a função não existe, então o painel mostra só a opção de colar o link de uma imagem. Para testar o upload localmente, use `npx vercel@65 dev` em vez de `yarn dev`.

---

## Fluxo de trabalho e deploy

O site é publicado automaticamente. Ninguém roda deploy na mão: o código passa por uma esteira de branches e o que chega na `main` vai para o ar.

```
feature/minha-mudanca ──PR──▶ dev ──PR──▶ main ──▶ GitHub Actions ──▶ Vercel
      (local)            (integração)   (produção)    migrations → build → publicação
```

| Branch | Para quê | O que roda |
|---|---|---|
| `feature/*` | Cada mudança nova, saindo da `dev` | — |
| `dev` | Integração: junta as features testadas localmente | **CI** em todo PR e push: lint, build e teste das migrations num Postgres limpo |
| `main` | Produção. Só recebe PR vindo da `dev` | **CI** no PR (inclui checagem de origem) e **Deploy** após o merge |

**No dia a dia:**

```bash
git switch dev && git pull
git switch -c feature/nova-coisa
# ... código, yarn dev, yarn lint ...
git push -u origin feature/nova-coisa      # abra o PR para a dev
```

Depois de juntar uma ou mais features na `dev`, abra um PR **dev → main**. Ao fazer o merge, o workflow `Deploy` aplica as migrations pendentes no banco de produção, gera o build e publica na Vercel. O site só é publicado se as migrations passarem, então banco e código nunca ficam fora de sincronia.

**Mudou o banco?** Crie um arquivo **novo** em `database/migrations/` (ex.: `0003_cupom_desconto.sql`) e rode `yarn db:migrate` localmente. Nunca edite uma migration que já foi aplicada: o controle é pelo nome do arquivo, então a alteração não seria aplicada de novo. Cada arquivo roda numa transação; se der erro, nada dele fica no banco e o deploy para antes de publicar o site.

### Configuração única

**Na Vercel** (plano Hobby, gratuito):

1. Na pasta do projeto, rode `npx vercel@65 link` e responda: criar um projeto novo, nome `bizzgu`. Isso cria a pasta `.vercel/` (fica fora do Git) com o arquivo `project.json`, que tem o `orgId` e o `projectId`.
2. Em [vercel.com/account/tokens](https://vercel.com/account/tokens), crie um token para o GitHub Actions.
3. No projeto da Vercel, aba **Analytics** e aba **Speed Insights**: clique em **Enable** nas duas.

O `vercel.json` já define build, rotas, cache e headers de segurança, e desliga o deploy automático da própria Vercel: quem publica é o GitHub Actions, depois das migrations.

**No GitHub** (Settings → Secrets and variables → Actions):

| Aba | Nome | Valor |
|---|---|---|
| Variables | `VITE_NEON_AUTH_URL` | Auth URL do Neon |
| Variables | `VITE_NEON_DATA_API_URL` | API URL da Data API do Neon |
| Variables | `VITE_SITE_URL` | opcional: endereço final do site, se não for `https://bizzgu.vercel.app` |
| Secrets | `NEON_DATABASE_URL` | connection string do banco de produção (sem `-pooler`) |
| Secrets | `VERCEL_TOKEN` | o token do passo 2 |
| Secrets | `VERCEL_ORG_ID` | `orgId` do `.vercel/project.json` |
| Secrets | `VERCEL_PROJECT_ID` | `projectId` do `.vercel/project.json` |

**Proteção da `main`** (Settings → Rules → Rulesets): exija pull request e os checks **Lint e build**, **Migrations (Postgres de teste)** e **Origem do PR**, sem "require branches to be up to date".

**No Neon Auth:** adicione o endereço da Vercel (`https://bizzgu.vercel.app` ou o seu domínio) nos domínios confiáveis.

Para publicar de novo sem mudança de código (ex.: depois de trocar uma variável), use **Actions → Deploy → Run workflow**. Se algo der errado em produção, o painel da Vercel permite voltar para a versão anterior com um clique (**Deployments → ⋯ → Promote**).

### Domínio próprio (opcional)

No projeto da Vercel, **Settings → Domains → Add** (ex.: `bizzgu.seudominio.com.br`) e siga as instruções de DNS. Depois, cadastre o domínio nos domínios confiáveis do Neon Auth e defina a variável `VITE_SITE_URL` no GitHub com o endereço novo, para a imagem de compartilhamento apontar para ele.

### Banco separado para desenvolvimento (opcional)

Para não misturar testes locais com os dados de produção, crie uma **branch `dev` no Neon** (Console → Branches), ative Auth e Data API nela e use os endereços e a connection string dessa branch no seu `.env.local`. O `NEON_DATABASE_URL` do GitHub continua apontando para a branch principal (produção).

### Imagem de compartilhamento

`public/og-image.png` (1200×630) aparece quando o link é compartilhado no WhatsApp, LinkedIn etc. As tags ficam no `index.html` e usam o `VITE_SITE_URL`.

---

## Estrutura

```
.github/workflows/
  ci.yml             lint, build e teste das migrations em todo PR
  deploy.yml         migrations + build + Vercel ao entrar na main
database/
  migrations/        0001_schema.sql (tabelas, RLS, funções), 0002_seed.sql...
  ci/neon-stub.sql   simula o Neon Auth/Data API no Postgres do CI
scripts/
  migrate.mjs        aplica as migrations pendentes (yarn db:migrate)
api/
  images.js          Vercel Function: upload de imagens (Vercel Blob), só para admins
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
    admin/           painel administrativo (layout próprio, fora da loja)
```

## Scripts

| Comando | Descrição |
|---|---|
| `yarn dev` | Servidor de desenvolvimento |
| `yarn build` | Build de produção em `dist/` |
| `yarn preview` | Testa o build localmente |
| `yarn lint` | ESLint |
| `yarn db:migrate` | Aplica as migrations pendentes (`--status` só lista, `--baseline` marca como aplicadas) |
