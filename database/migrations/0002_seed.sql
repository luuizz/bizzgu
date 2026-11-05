-- =============================================================================
-- Bizzgu — dados de exemplo (categorias e produtos)
-- Aplicado logo depois do schema (0001). Caminhos de imagem sem "http" apontam para a
-- pasta public/ do site; imagens enviadas pelo painel usam a URL do Storage.
-- =============================================================================
insert into public.categories (name, slug, description, sort_order) values
  ('Celulares',        'celulares',        'Smartphones das principais marcas, com os melhores preços.', 1),
  ('Games',            'games',            'Consoles, controles e acessórios para quem vive o jogo.', 2),
  ('Eletrodomésticos', 'eletrodomesticos', 'Praticidade para a cozinha e a lavanderia.', 3),
  ('Esporte & Lazer',  'esporte-lazer',    'Equipamentos para treinar e se divertir.', 4),
  ('Móveis',           'moveis',           'Conforto e estilo para todos os cômodos.', 5),
  ('SmartTV',          'smarttv',          'Imagem de cinema na sua sala.', 6),
  ('Supermercado',     'supermercado',     'Itens do dia a dia sem sair de casa.', 7),
  ('Bebês & Infantil', 'bebes-infantil',   'Tudo para os pequenos, do berço à escola.', 8)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, description, price, compare_at_price, stock, images, featured)
select c.id, p.name, p.slug, p.description, p.price, p.compare_at_price, p.stock, p.images, p.featured
from (values
  ('celulares',
   'Smartphone Samsung Galaxy S21 FE 256GB Violeta 5G',
   'samsung-galaxy-s21-fe-256gb-violeta',
   'Galaxy S21 FE violeta com 5G, 256GB de armazenamento, processador Octa-Core e 8GB de RAM. Tela Dynamic AMOLED 2X de 6,4", câmera traseira tripla 12MP + 12MP + 8MP com zoom digital de 10x e selfie de 32MP.',
   2299.00, 2799.00, 8,
   array['products/galaxy-s21-fe-1.webp', 'products/galaxy-s21-fe-2.webp', 'products/galaxy-s21-fe-3.webp'], true),

  ('games',
   'PlayStation 5 825GB com 1 Controle DualSense Branco',
   'playstation-5-825gb-branco',
   'O PlayStation 5 traz SSD ultrarrápido de 825GB, controle DualSense com resposta tátil e gatilhos adaptáveis e áudio 3D. Reproduz jogos de PS5 e PS4 em Blu-ray.',
   3894.05, 4499.00, 5,
   array['products/playstation-5-1.webp', 'products/playstation-5-2.webp', 'products/playstation-5-3.webp'], true),

  ('celulares',  'iPhone 13 128GB Meia-noite', 'iphone-13-128gb-meia-noite',
   'Tela Super Retina XDR de 6,1", chip A15 Bionic, câmera dupla de 12MP com modo Cinema e bateria para o dia todo.',
   3999.00, 4599.00, 12, array[]::text[], true),
  ('celulares',  'Motorola Moto G84 5G 256GB Grafite', 'motorola-moto-g84-5g-256gb',
   'Tela pOLED de 6,5" com 120Hz, 12GB de RAM, câmera de 50MP com OIS e som Dolby Atmos.',
   1499.00, null, 20, array[]::text[], true),

  ('games',      'Controle DualSense Midnight Black', 'controle-dualsense-midnight-black',
   'Controle sem fio para PS5 com resposta tátil, gatilhos adaptáveis e microfone embutido.',
   449.90, 499.90, 3, array[]::text[], false),
  ('games',      'Headset Gamer HyperX Cloud Stinger 2', 'headset-hyperx-cloud-stinger-2',
   'Som surround DTS, drivers de 50mm, microfone com cancelamento de ruído e almofadas de espuma com memória.',
   299.90, null, 15, array[]::text[], false),

  ('eletrodomesticos', 'Geladeira Electrolux Frost Free Inverse 454L Inox', 'geladeira-electrolux-frost-free-454l',
   'Freezer embaixo, tecnologia Inverter que economiza energia e gaveta Hortifruti que conserva os alimentos por mais tempo.',
   2799.90, 3299.00, 4, array[]::text[], true),
  ('eletrodomesticos', 'Air Fryer Mondial 4L Preta', 'air-fryer-mondial-4l',
   'Frite, asse e doure sem óleo. Cesto antiaderente de 4 litros e timer de 60 minutos.',
   349.90, 429.90, 25, array[]::text[], true),

  ('esporte-lazer', 'Bicicleta Aro 29 Caloi Explorer Sport 21 Marchas', 'bicicleta-caloi-explorer-aro-29',
   'Quadro em alumínio, suspensão dianteira, freios a disco mecânicos e câmbio Shimano de 21 velocidades.',
   1899.00, null, 6, array[]::text[], false),
  ('esporte-lazer', 'Kit Halteres Emborrachados 2 a 10kg', 'kit-halteres-emborrachados',
   'Kit com 5 pares de halteres revestidos em borracha, ideal para treinos em casa.',
   599.90, 699.90, 10, array[]::text[], false),

  ('moveis',     'Sofá Retrátil e Reclinável 3 Lugares Cinza', 'sofa-retratil-reclinavel-3-lugares',
   'Assento retrátil, encosto reclinável em 3 posições e tecido suede de fácil limpeza.',
   1699.00, 2199.00, 5, array[]::text[], false),
  ('moveis',     'Cadeira de Escritório Ergonômica Mesh', 'cadeira-escritorio-ergonomica-mesh',
   'Encosto em tela respirável, apoio lombar ajustável, braços 3D e regulagem de altura a gás.',
   899.00, null, 9, array[]::text[], false),

  ('smarttv',    'Smart TV LG 55" 4K UHD ThinQ AI', 'smart-tv-lg-55-4k-thinq',
   'Processador α5 com IA, HDR10 Pro, webOS com os principais apps de streaming e controle por voz.',
   2599.00, 2999.00, 7, array[]::text[], true),
  ('smarttv',    'Smart TV Samsung 43" Crystal UHD 4K', 'smart-tv-samsung-43-crystal-4k',
   'Processador Crystal 4K, HDR e Tizen com acesso rápido a streaming e games na nuvem.',
   1799.00, null, 11, array[]::text[], true),

  ('supermercado', 'Café em Grãos Especial 1kg', 'cafe-em-graos-especial-1kg',
   'Torra média, notas de chocolate e caramelo. 100% arábica do Sul de Minas.',
   79.90, 89.90, 40, array[]::text[], false),
  ('supermercado', 'Kit Limpeza Multiuso 6 Itens', 'kit-limpeza-multiuso-6-itens',
   'Detergente, desinfetante, multiuso, esponjas e panos para deixar a casa brilhando.',
   49.90, null, 30, array[]::text[], false),

  ('bebes-infantil', 'Carrinho de Bebê Travel System Galzerano', 'carrinho-bebe-travel-system',
   'Carrinho com bebê conforto, reclinável em 4 posições e fechamento tipo guarda-chuva.',
   1299.00, 1499.00, 4, array[]::text[], false),
  ('bebes-infantil', 'Kit Body Bebê Algodão 5 Peças', 'kit-body-bebe-algodao',
   'Bodies de manga curta em algodão macio, do RN ao 6 meses.',
   89.90, null, 2, array[]::text[], false)
) as p(category_slug, name, slug, description, price, compare_at_price, stock, images, featured)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;
