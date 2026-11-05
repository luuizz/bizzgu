-- Banners passam a ser só imagem: uma arte para computador (1920x480)
-- e outra para celular (1080x1080), com descrição (texto alternativo) e link.

-- Os dois banners iniciais ganham artes próprias
update public.banners
set layout = 'image',
    title = 'Seu smartphone vive travando? Faça o upgrade em até 10x sem juros.',
    image = 'banners/banner-celulares-desktop.webp',
    image_mobile = 'banners/banner-celulares-mobile.webp'
where layout = 'text' and title = 'Seu smartphone vive travando?';

update public.banners
set layout = 'image',
    title = 'PlayStation 5: a nova geração dos games chegou. Até 10x sem juros e frete grátis.',
    image = 'banners/banner-games-desktop.webp',
    image_mobile = 'banners/banner-games-mobile.webp'
where layout = 'text' and title = 'A nova geração dos games chegou';

-- Outros banners de texto não têm arte: os sem imagem saem, os com imagem ficam inativos
delete from public.banners where layout = 'text' and image is null;
update public.banners set active = false where layout = 'text';

-- Sem arte de celular: usa a de computador e fica inativo até ganhar uma
update public.banners set image_mobile = image, active = false where image_mobile is null;

-- Novo banner de frete grátis, no fim do carrossel
insert into public.banners (layout, title, link, image, image_mobile, position)
select 'image',
       'Frete grátis para todo o Brasil em compras acima de R$ 299.',
       '/busca?ofertas=1',
       'banners/banner-frete-gratis-desktop.webp',
       'banners/banner-frete-gratis-mobile.webp',
       coalesce(max(position), 0) + 1
from public.banners;

alter table public.banners drop constraint banners_image_layout;
alter table public.banners drop column layout, drop column subtitle, drop column cta_label;
alter table public.banners alter column image set not null, alter column image_mobile set not null;
