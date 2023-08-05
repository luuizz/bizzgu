import styled from 'styled-components'
import bgSlide01 from '/src/assets/bg-slide-desktop.svg'
import prevButton from '/src/assets/swiper-prev.svg'
import nextButton from '/src/assets/swiper-next.svg'

export const StyleSlide = styled.section`
    overflow: hidden;
    .swiper {
        .swiper-wrapper {
            height: 43.3rem;
            .slide-01 {
                padding-top: 8rem;
                background: url(${bgSlide01}) no-repeat;
                background-size: cover;
                .container {
                    display: flex;
                    flex-direction: row;
                    .left {
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    flex-direction: column;
                    width: 48.8rem;
                        h2 {
                            color: var(--white);
                            font-size: 6rem;
                            font-family: var(--font-red-hat);
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
                            position: absolute;
                            top: -3rem;
                            left: 3rem;
                            z-index: -1;
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

    .swiper-button-next {
        &:after {
            content: url(${nextButton});
        }
    }

    .swiper-button-prev {
        &:after {
            content: url(${prevButton})
        }
    }
`
