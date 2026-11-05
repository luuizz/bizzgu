import { StyleSlide } from './style'
import ImageIphone from '/src/assets/iphones.png'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Navigation, Autoplay } from 'swiper/modules'
import { BtnPrimary } from '../Global/ButtonPrimary'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const slides = [
    {
        title: 'Seu smartphone vive travando?',
        subtitle: 'Você merece um upgrade!',
        cta: 'Faça o upgrade já!',
        url: '/categoria/celulares',
        image: ImageIphone,
        alt: 'iPhones coloridos',
    },
    {
        title: 'A nova geração dos games chegou',
        subtitle: 'PlayStation 5 com frete grátis e até 10x sem juros.',
        cta: 'Ver consoles',
        url: '/categoria/games',
    },
]

export function Slide() {
    return (
        <StyleSlide>
            <Swiper
                navigation
                slidesPerView={1}
                rewind
                autoplay={{ delay: 6000, disableOnInteraction: true }}
                modules={[EffectFade, Navigation, Autoplay]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                className="mySwiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide className="slide-01" key={slide.title}>
                        <div className="container">
                            <div className="left animeLeft">
                                <h2>{slide.title}</h2>
                                <span>{slide.subtitle}</span>
                                <BtnPrimary url={slide.url} txt={slide.cta} />
                            </div>
                            {slide.image && (
                                <div className="right">
                                    <img src={slide.image} alt={slide.alt} />
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </StyleSlide>
    )
}
