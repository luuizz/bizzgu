import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Autoplay, Pagination } from 'swiper/modules'
import { StyleSlide } from './style'
import { useAsync } from '../../hooks/useAsync'
import { getHomeBanners } from '../../services/catalog'
import { imageUrl } from '../../lib/format'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

// Usados se o banco não responder ou não houver banner publicado
const FALLBACK_BANNERS = [
    { id: 'f1', title: 'Seu smartphone vive travando? Faça o upgrade em até 10x sem juros.', link: '/categoria/celulares', image: 'banners/banner-celulares-desktop.webp', image_mobile: 'banners/banner-celulares-mobile.webp' },
    { id: 'f2', title: 'PlayStation 5: a nova geração dos games chegou.', link: '/categoria/games', image: 'banners/banner-games-desktop.webp', image_mobile: 'banners/banner-games-mobile.webp' },
    { id: 'f3', title: 'Frete grátis para todo o Brasil em compras acima de R$ 299.', link: '/busca?ofertas=1', image: 'banners/banner-frete-gratis-desktop.webp', image_mobile: 'banners/banner-frete-gratis-mobile.webp' },
]

// Link interno (/categoria/x) usa o roteador; externo (https://) abre normalmente
function BannerLink({ to, children, ...rest }) {
    if (!to) return <div className="banner" {...rest}>{children}</div>
    if (to.startsWith('/')) return <Link to={to} className="banner" {...rest}>{children}</Link>
    return <a href={to} className="banner" rel="noreferrer" {...rest}>{children}</a>
}

// Um banner: arte de celular até 700px de largura, de computador acima disso.
// Também usado na pré-visualização do painel.
export function BannerContent({ banner, eager = false, device }) {
    const desktop = imageUrl(banner.image)
    const mobile = imageUrl(banner.image_mobile || banner.image)
    return (
        <BannerLink to={banner.link} aria-label={banner.title}>
            {device ? (
                <img src={device === 'mobile' ? mobile : desktop} alt={banner.title} className={device} />
            ) : (
                <picture>
                    <source media="(max-width: 700px)" srcSet={mobile} width="1080" height="1080" />
                    <img src={desktop} alt={banner.title} width="1920" height="480" loading={eager ? 'eager' : 'lazy'} />
                </picture>
            )}
        </BannerLink>
    )
}

export function Slide() {
    // As setas comandam a instância do Swiper diretamente (sem o módulo Navigation,
    // que dependia dos botões já existirem quando o carrossel era montado)
    const [swiper, setSwiper] = useState(null)
    const banners = useAsync(() => getHomeBanners(), [])

    if (banners.loading) return <StyleSlide aria-busy="true"><div className="skeleton" /></StyleSlide>

    const list = banners.data?.length ? banners.data : FALLBACK_BANNERS
    const several = list.length > 1

    return (
        <StyleSlide aria-roledescription="carrossel" aria-label="Destaques da loja">
            <Swiper
                key={list.map((banner) => banner.id).join('-')}
                onSwiper={setSwiper}
                pagination={several && { clickable: true }}
                slidesPerView={1}
                rewind={several}
                allowTouchMove={several}
                autoplay={several && { delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true }}
                modules={[EffectFade, Autoplay, Pagination]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
            >
                {list.map((banner, index) => (
                    <SwiperSlide key={banner.id}>
                        <BannerContent banner={banner} eager={index === 0} />
                    </SwiperSlide>
                ))}
            </Swiper>
            {several && (
                <>
                    <button type="button" className="slider-nav prev" aria-label="Banner anterior" onClick={() => swiper?.slidePrev()}>
                        <CaretLeft size={24} weight="bold" />
                    </button>
                    <button type="button" className="slider-nav next" aria-label="Próximo banner" onClick={() => swiper?.slideNext()}>
                        <CaretRight size={24} weight="bold" />
                    </button>
                </>
            )}
        </StyleSlide>
    )
}
