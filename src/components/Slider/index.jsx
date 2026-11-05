import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Navigation, Autoplay } from 'swiper/modules'
import { StyleSlide } from './style'
import { useAsync } from '../../hooks/useAsync'
import { getHomeBanners } from '../../services/catalog'
import { imageUrl } from '../../lib/format'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

// Usados se o banco não responder ou não houver banner publicado
const FALLBACK_BANNERS = [
    {
        id: 'fallback-1',
        layout: 'text',
        title: 'Seu smartphone vive travando?',
        subtitle: 'Você merece um upgrade!',
        cta_label: 'Faça o upgrade já!',
        link: '/categoria/celulares',
        image: 'banners/iphones.png',
    },
    {
        id: 'fallback-2',
        layout: 'text',
        title: 'A nova geração dos games chegou',
        subtitle: 'PlayStation 5 com frete grátis e até 10x sem juros.',
        cta_label: 'Ver consoles',
        link: '/categoria/games',
    },
]

// Link interno (/categoria/x) usa o roteador; externo (https://) abre normalmente
function BannerLink({ to, className, children, ...rest }) {
    if (!to) return <div className={className}>{children}</div>
    if (to.startsWith('/')) return <Link to={to} className={className} {...rest}>{children}</Link>
    return <a href={to} className={className} rel="noreferrer" {...rest}>{children}</a>
}

// Conteúdo de um banner. Também usado na pré-visualização do painel.
export function BannerContent({ banner, eager = false }) {
    if (banner.layout === 'image') {
        return (
            <BannerLink to={banner.link} className="banner-image" aria-label={banner.title}>
                <picture>
                    {banner.image_mobile && <source media="(max-width: 700px)" srcSet={imageUrl(banner.image_mobile)} />}
                    <img src={imageUrl(banner.image)} alt={banner.title} loading={eager ? 'eager' : 'lazy'} />
                </picture>
            </BannerLink>
        )
    }

    return (
        <div className="banner-text">
            <div className="container">
                <div className="left animeLeft">
                    <h2>{banner.title}</h2>
                    {banner.subtitle && <span>{banner.subtitle}</span>}
                    {banner.cta_label && banner.link && (
                        <BannerLink to={banner.link} className="btn-primary">{banner.cta_label}</BannerLink>
                    )}
                </div>
                {banner.image && (
                    <div className="right">
                        <img src={imageUrl(banner.image)} alt="" loading={eager ? 'eager' : 'lazy'} />
                    </div>
                )}
            </div>
        </div>
    )
}

export function Slide() {
    const prevRef = useRef(null)
    const nextRef = useRef(null)
    const banners = useAsync(() => getHomeBanners(), [])

    if (banners.loading) return <StyleSlide aria-busy="true"><div className="skeleton" /></StyleSlide>

    const list = banners.data?.length ? banners.data : FALLBACK_BANNERS
    const several = list.length > 1

    return (
        <StyleSlide aria-roledescription="carrossel" aria-label="Destaques da loja">
            <Swiper
                key={list.map((banner) => banner.id).join('-')}
                // Setas próprias (Phosphor) no lugar das padrão do Swiper
                navigation={several && { prevEl: prevRef.current, nextEl: nextRef.current }}
                onBeforeInit={(swiper) => {
                    if (!several) return
                    swiper.params.navigation.prevEl = prevRef.current
                    swiper.params.navigation.nextEl = nextRef.current
                }}
                slidesPerView={1}
                rewind={several}
                allowTouchMove={several}
                autoplay={several && { delay: 6000, disableOnInteraction: true }}
                modules={[EffectFade, Navigation, Autoplay]}
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
                    <button ref={prevRef} type="button" className="slider-nav prev" aria-label="Banner anterior">
                        <CaretLeft size={28} weight="bold" />
                    </button>
                    <button ref={nextRef} type="button" className="slider-nav next" aria-label="Próximo banner">
                        <CaretRight size={28} weight="bold" />
                    </button>
                </>
            )}
        </StyleSlide>
    )
}
