import styled from 'styled-components'

// Banner proporcional à arte (sem cortes): 4:1 no computador, 1:1 no celular
export const StyleSlide = styled.section`
    --banner-ratio: 4 / 1;
    position: relative;
    overflow: hidden;
    z-index: 0;
    background: var(--white-600);

    .skeleton { display: block; aspect-ratio: var(--banner-ratio); line-height: 1; }

    .banner {
        display: block;
        aspect-ratio: var(--banner-ratio);
        picture, img { display: block; width: 100%; height: 100%; }
        img { object-fit: cover; }
    }

    .slider-nav {
        position: absolute;
        top: 50%;
        z-index: 2;
        transform: translateY(-50%);
        width: 4.4rem;
        height: 4.4rem;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: var(--gray-500);
        background: rgba(255, 255, 255, 0.85);
        box-shadow: 0 0.4rem 1.6rem rgba(16, 7, 23, 0.16);
        backdrop-filter: blur(0.4rem);
        transition: background .2s ease, color .2s ease, transform .2s ease;
        &:hover { background: var(--primary); color: var(--white); }
        &:active { transform: translateY(-50%) scale(0.94); }
        &.prev { left: 2.4rem; }
        &.next { right: 2.4rem; }
    }

    .swiper-pagination { bottom: 1.4rem; }
    .swiper-pagination-bullet {
        width: 0.8rem;
        height: 0.8rem;
        background: var(--white);
        opacity: 0.6;
        box-shadow: 0 0 0.4rem rgba(16, 7, 23, 0.3);
        transition: width .2s ease, opacity .2s ease;
    }
    .swiper-pagination-bullet-active { width: 2.4rem; border-radius: 0.4rem; opacity: 1; background: var(--white); }

    @media (max-width: 700px) {
        --banner-ratio: 1 / 1;
        .slider-nav { display: none; }
    }
`
