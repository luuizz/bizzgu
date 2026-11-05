import styled from 'styled-components'
import bgSlide01 from '/src/assets/bg-slide-desktop.svg'
import prevButton from '/src/assets/swiper-prev.svg'
import nextButton from '/src/assets/swiper-next.svg'

export const StyleSlide = styled.section`
    overflow: hidden;
    position: relative;
    z-index: 0;
    .swiper {
        .swiper-wrapper {
            height: 43.3rem;
            .slide-01 {
                display: flex;
                align-items: center;
                background: var(--gray-500) url(${bgSlide01}) no-repeat;
                background-size: cover;
                .container {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .left {
                        display: flex;
                        align-items: flex-start;
                        justify-content: center;
                        flex-direction: column;
                        width: 56rem;
                        flex-shrink: 0;
                        padding-left: 4rem;
                        h2 {
                            color: var(--white);
                            font-size: 5.2rem;
                        }
                        span {
                            font-size: 2.4rem;
                            color: var(--gray-100);
                            line-height: 120%;
                            font-family: var(--font-red-hat);
                            margin-top: 1.6rem;
                        }
                        .btn-primary {
                            margin-top: 4rem;
                        }
                    }
                    .right {
                        display: flex;
                        position: relative;
                        width: 100%;
                        max-width: 69.9rem;
                        img {
                            max-width: 60rem;
                            margin-left: 3rem;
                        }
                    }
                }
            }
        }
    }
    .animeLeft {
        opacity: 0;
        transform: translateX(-20px);
        animation: animeLeft 0.9s forwards;
    }

    @keyframes animeLeft {
        100% {
            opacity: 1;
            transform: initial;
        }
    }

    .swiper-button-next:after { content: url(${nextButton}); }
    .swiper-button-prev:after { content: url(${prevButton}); }

    @media (max-width: 900px) {
        .swiper .swiper-wrapper {
            height: 34rem;
            .slide-01 {
                .container .left {
                    width: 100%;
                    padding: 0 3.2rem;
                    h2 { font-size: 3.6rem; }
                    span { font-size: 1.8rem; }
                    .btn-primary { margin-top: 2.4rem; }
                }
                .container .right { display: none; }
            }
        }
        .swiper-button-next, .swiper-button-prev { transform: scale(0.7); }
    }
`
