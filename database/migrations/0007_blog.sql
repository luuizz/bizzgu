-- Blog da loja (Admin → Conteúdo → Blog). O conteúdo é HTML gerado pelo editor
-- visual do painel; a loja o sanitiza (DOMPurify) antes de exibir.

create table public.posts (
  id            bigint generated always as identity primary key,
  title         text not null check (char_length(title) between 1 and 160),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt       text check (char_length(excerpt) <= 300),
  cover_image   text,
  content       text not null default '' check (char_length(content) <= 200000),
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  author_name   text check (char_length(author_name) <= 80),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint posts_published_at check (status = 'draft' or published_at is not null)
);

create index posts_published_idx on public.posts (status, published_at desc);

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

revoke all on public.posts from anonymous, authenticated;
grant select on public.posts to anonymous, authenticated;
grant insert, update, delete on public.posts to authenticated;

-- Visitantes veem só posts publicados (inclusive os agendados, depois da data); admins veem todos
create policy "posts: leitura dos publicados" on public.posts
  for select to anonymous, authenticated
  using (public.is_admin() or (status = 'published' and published_at <= now()));
create policy "posts: admin insere" on public.posts
  for insert to authenticated with check (public.is_admin());
create policy "posts: admin edita" on public.posts
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "posts: admin exclui" on public.posts
  for delete to authenticated using (public.is_admin());

-- Posts iniciais
insert into public.posts (title, slug, excerpt, cover_image, status, published_at, author_name, content) values
(
  'Como escolher o smartphone ideal em 2026',
  'como-escolher-o-smartphone-ideal',
  'Tela, câmera, bateria ou desempenho? Um guia direto para acertar na compra sem pagar por recursos que você não vai usar.',
  'blog/blog-smartphone.webp', 'published', now() - interval '6 days', 'Equipe Bizzgu',
  $html$<p>Trocar de celular é uma das compras de tecnologia mais importantes do ano, e também uma das mais confusas. São dezenas de modelos com fichas técnicas parecidas. O segredo é começar pelo seu uso, e não pela lista de especificações.</p>
<h2>1. Comece pela bateria</h2>
<p>Se o celular morre antes do fim do dia, nada mais importa. Para quem usa redes sociais, mapas e vídeos, procure aparelhos com <strong>4.500 mAh ou mais</strong> e carregamento rápido. Processadores mais novos também gastam menos energia, então um modelo recente com bateria média pode durar mais que um antigo com bateria grande.</p>
<h2>2. Armazenamento: 128 GB é o mínimo</h2>
<p>Fotos, vídeos e aplicativos crescem a cada atualização. Em 2026, <strong>128 GB</strong> é o ponto de partida; se você grava muitos vídeos ou guarda tudo no aparelho, vá de <strong>256 GB</strong>.</p>
<h2>3. Câmera: olhe além dos megapixels</h2>
<p>O número de megapixels diz pouco. O que faz diferença é o tamanho do sensor, a estabilização óptica (OIS) e o processamento de imagem. Se você fotografa à noite ou filma muito, priorize aparelhos com OIS.</p>
<h2>4. Atualizações de sistema</h2>
<p>Um bom celular deve receber atualizações por vários anos. Verifique por quanto tempo a fabricante promete atualizações de sistema e de segurança: isso aumenta a vida útil e protege seus dados.</p>
<blockquote><p>Dica rápida: liste as três coisas que mais incomodam no seu celular atual. O próximo aparelho precisa resolver essas três.</p></blockquote>
<h2>Resumo</h2>
<ul><li><p>Bateria de 4.500 mAh ou mais</p></li><li><p>Pelo menos 128 GB de armazenamento</p></li><li><p>Câmera com estabilização óptica, se você fotografa muito</p></li><li><p>Vários anos de atualizações garantidas</p></li></ul>
<p>Confira os modelos na nossa <a href="/categoria/celulares">categoria de celulares</a>, todos em até 10x sem juros.</p>$html$
),
(
  'PlayStation 5: vale a pena comprar agora?',
  'playstation-5-vale-a-pena',
  'Catálogo, desempenho e custo total: tudo o que você precisa saber antes de levar o console para casa.',
  'blog/blog-games.webp', 'published', now() - interval '3 days', 'Equipe Bizzgu',
  $html$<p>O PlayStation 5 já tem uma biblioteca madura, com exclusivos consagrados e boa parte dos lançamentos multiplataforma rodando melhor nele do que na geração anterior. Mas será que é a hora certa de comprar?</p>
<h2>O que você ganha</h2>
<ul><li><p><strong>Carregamentos quase instantâneos</strong> graças ao SSD ultrarrápido.</p></li><li><p><strong>Controle DualSense</strong>, com gatilhos adaptáveis e resposta tátil que mudam a sensação dos jogos.</p></li><li><p><strong>Retrocompatibilidade</strong> com a grande maioria dos jogos de PS4.</p></li></ul>
<h2>Quanto custa de verdade</h2>
<p>Além do console, considere um segundo controle, a assinatura do serviço online (necessária para jogar on-line) e alguns jogos. Planejar esse custo total evita surpresas e ajuda a decidir entre parcelar ou comprar em etapas.</p>
<h2>Para quem vale a pena</h2>
<p>Se você ainda joga no PS4 ou quer entrar no mundo dos consoles agora, o PS5 é uma ótima escolha: a geração está no auge, com muitos jogos e preços de mídia mais acessíveis que no lançamento.</p>
<blockquote><p>Já tem PS4? Seus jogos e saves, em sua maioria, vêm junto. A transição é bem mais tranquila do que parece.</p></blockquote>
<p>Veja o console, controles e headsets na nossa <a href="/categoria/games">categoria de games</a>, com frete grátis acima de R$ 299.</p>$html$
),
(
  '5 dicas para um home office mais produtivo',
  'dicas-home-office-produtivo',
  'Pequenos ajustes de postura, luz e rotina que fazem diferença no fim do dia, sem reformar a casa.',
  'blog/blog-home-office.webp', 'published', now() - interval '1 day', 'Equipe Bizzgu',
  $html$<p>Trabalhar de casa tem vantagens claras, mas também cobra um preço quando o espaço não ajuda. A boa notícia é que poucos ajustes já mudam bastante o seu dia.</p>
<h2>1. Cadeira primeiro</h2>
<p>Você passa horas sentado: uma <strong>cadeira ergonômica</strong> com apoio lombar e altura regulável é o melhor investimento do home office. Os pés devem ficar apoiados e os joelhos em ângulo de 90°.</p>
<h2>2. Tela na altura dos olhos</h2>
<p>O topo do monitor deve ficar na altura dos olhos, a cerca de um braço de distância. Se usa notebook, um suporte e um teclado externo resolvem.</p>
<h2>3. Luz natural de lado</h2>
<p>Posicione a mesa de forma que a janela fique ao lado, e não atrás ou à frente da tela. Isso reduz reflexos e cansaço visual.</p>
<h2>4. Som sob controle</h2>
<p>Um <strong>headset com microfone</strong> melhora as reuniões para você e para quem está do outro lado, e ajuda a manter o foco em casas movimentadas.</p>
<h2>5. Pausas com hora marcada</h2>
<p>Levante a cada 50 minutos: alongue, beba água, prepare um café. Pausas curtas e frequentes rendem mais que uma pausa longa no fim da tarde.</p>
<p>Monte o seu cantinho com a seleção da tag <a href="/tag/home-office">Home office</a>.</p>$html$
);
