import styled from 'styled-components'
import bgSlide01 from '/src/assets/bg-slide-desktop.svg'

// Estilos do banner ficam no nível do StyleSlide para que a pré-visualização
// do painel use exatamente o mesmo visual da home.
export const StyleSlide = styled.section`
    --banner-height: 43.3rem;
    overflow: hidden;
    position: relative;
    z-index: 0;

    .skeleton {
        height: var(--banner-height);
        background: var(--gray-500) url(${bgSlide01}) no-repeat;
        background-size: cover;
    }

    .swiper-slide { height: var(--banner-height); }

    /* Arte pronta: a imagem ocupa todo o banner */
    .banner-image {
        display: block;
        width: 100%;
        height: var(--banner-height);
        background: var(--gray-500);
        picture, img { display: block; width: 100%; height: 100%; }
        img { object-fit: cover; }
    }

    /* Texto + imagem sobre o fundo da marca */
    .banner-text {
        height: var(--banner-height);
        display: flex;
        align-items: center;
        background: var(--gray-500) url(${bgSlide01}) no-repeat;
        background-size: cover;
        .container {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .left {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;
            width: 56rem;
            flex-shrink: 0;
            padding-left: 4rem;
            h2 { color: var(--white); font-size: 5.2rem; }
            span {
                font-size: 2.4rem;
                color: var(--gray-100);
                line-height: 120%;
                font-family: var(--font-red-hat);
                margin-top: 1.6rem;
            }
            .btn-primary { margin-top: 4rem; }
        }
        .right {
            display: flex;
            position: relative;
            width: 100%;
            max-width: 69.9rem;
            img { max-width: 60rem; max-height: calc(var(--banner-height) - 4rem); margin-left: 3rem; object-fit: contain; }
        }
    }

    .animeLeft {
        opacity: 0;
        transform: translateX(-20px);
        animation: animeLeft 0.9s forwards;
    }

    @keyframes animeLeft {
        100% { opacity: 1; transform: initial; }
    }

    .slider-nav {
        position: absolute;
        top: 50%;
        z-index: 2;
        transform: translateY(-50%);
        width: 5.2rem;
        height: 5.2rem;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: var(--white);
        background: rgba(255, 255, 255, 0.12);
        border: 0.1rem solid rgba(255, 255, 255, 0.24);
        backdrop-filter: blur(0.4rem);
        transition: background .2s ease;
        &:hover { background: var(--primary); border-color: var(--primary); }
        &.prev { left: 2.4rem; }
        &.next { right: 2.4rem; }
    }

    @media (max-width: 900px) {
        --banner-height: 34rem;
        .banner-text {
            .left {
                width: 100%;
                padding: 0 3.2rem;
                h2 { font-size: 3.6rem; }
                span { font-size: 1.8rem; }
                .btn-primary { margin-top: 2.4rem; }
            }
            .right { display: none; }
        }
        .slider-nav { width: 4rem; height: 4rem; &.prev { left: 1.2rem; } &.next { right: 1.2rem; } }
    }
`
