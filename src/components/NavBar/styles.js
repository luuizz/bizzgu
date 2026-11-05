import styled from 'styled-components'

export const NavLinks = styled.section`
    border-top: 1px solid var(--white-500);
    min-height: 4.4rem;
    display: flex;
    align-items: center;
    background-color: var(--white);
    position: relative;
    z-index: 20;
    .container {
        display: flex;
        align-items: center;
    }
`

export const AllCategories = styled.div`
    border-right: 1px solid var(--white-500);
    flex-shrink: 0;
    button {
        display: flex;
        width: 20.8rem;
        align-items: center;
        img {
            max-width: 2.4rem;
            margin-right: 0.8rem;
        }
        span {
            color: var(--violet-800);
            font-size: 1.6rem;
            font-weight: 500;
            font-family: var(--font-red-hat);
        }
    }
    @media (max-width: 700px) {
        border-right: 0;
        button { width: auto; padding-right: 1.6rem; span { display: none; } }
    }
`

export const Categories = styled.nav`
    margin-left: 3.2rem;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 3.2rem;
        li a {
            display: block;
            padding: 1.2rem 0;
            color: var(--gray-400);
            font-family: var(--font-red-hat);
            font-size: 1.5rem;
            font-weight: 500;
            white-space: nowrap;
            transition: color .3s ease;
            &:hover, &.active { color: var(--primary); }
        }
    }
    @media (max-width: 700px) {
        margin-left: 0;
        ul { gap: 2.4rem; }
    }
`

export const NavWrapper = styled.div`
    position: relative;
    z-index: 20;
`

export const StyleMegaMenu = styled.div`
    .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 10;
    }
    .panel {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 21;
        background: var(--white);
        border-top: 1px solid var(--white-500);
        padding: 3.2rem 0;
        box-shadow: var(--shadow);
        animation: drop .2s ease;
    }
    .content {
        display: grid;
        grid-template-columns: 1fr 26rem;
        gap: 3.2rem;
    }
    ul {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.8rem 2.4rem;
        a {
            display: block;
            padding: 1.2rem 1.4rem;
            border-radius: 0.8rem;
            transition: background .2s ease;
            &:hover { background: var(--white-600); strong { color: var(--primary); } }
        }
        strong { font-family: var(--font-red-hat); font-size: 1.7rem; color: var(--gray-800); }
        p { font-size: 1.35rem; color: var(--gray-300); margin-top: 0.4rem; }
    }
    .banner img { border-radius: 1.2rem; height: 100%; object-fit: cover; }
    @media (max-width: 900px) {
        .panel { max-height: 70vh; overflow-y: auto; }
        .content { grid-template-columns: 1fr; }
        ul { grid-template-columns: 1fr; }
        .banner { display: none; }
    }
    @keyframes drop {
        from { opacity: 0; transform: translateY(-0.8rem); }
        to { opacity: 1; transform: none; }
    }
`
