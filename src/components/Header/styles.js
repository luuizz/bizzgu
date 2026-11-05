import styled from 'styled-components'

export const StylesHeader = styled.header`
    min-height: 8.5rem;
    display: flex;
    align-items: center;
    background-color: var(--white-100);
    position: relative;
    z-index: 25;
    > .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        .contentHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2.4rem;
            width: 100%;
            flex: 1;
        }
    }

    @media (max-width: 900px) {
        padding: 1.2rem 0;
        > .container {
            flex-wrap: wrap;
            row-gap: 1.2rem;
            .contentHeader { display: contents; }
        }
    }
`

export const StylesLogo = styled.div`
    margin-right: 6rem;
    flex-shrink: 0;
    a img { max-width: 10.1rem; }
    @media (max-width: 1100px) { margin-right: 3.2rem; }
    @media (max-width: 900px) { margin-right: auto; order: 1; }
`

export const StylesGroupProfile = styled.ul`
    display: flex;
    align-items: center;
    gap: 2.4rem;
    flex-shrink: 0;
    a { display: flex; align-items: center; }
    img { width: 2.4rem; }
    .badge-holder a { position: relative; }
    .item-count {
        font-family: var(--font-red-hat);
        background-color: var(--primary);
        color: var(--white);
        font-size: 1.1rem;
        font-weight: 700;
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: -0.8rem;
        right: -1.1rem;
    }
    @media (max-width: 900px) { order: 2; gap: 2rem; }
`

export const StylesSearchHeader = styled.form`
    display: block;
    position: relative;
    flex: 1;
    max-width: 52rem;
    input {
        font-family: var(--font-red-hat);
        width: 100%;
        height: 4.9rem;
        padding: 1.2rem 5.6rem 1.2rem 1.6rem;
        border-radius: 0.8rem;
        border: 0.1rem solid var(--gray-50);
        background: var(--white);
        color: var(--gray-600);
        font-weight: 500;
        transition: border .3s ease, box-shadow .3s ease;
        font-size: 1.6rem;
        &::placeholder {
            font-weight: 500;
            color: var(--gray-100);
        }
        &:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 0.3rem var(--primary-100);
        }
        &::-webkit-search-cancel-button { display: none; }
    }
    button {
        width: 5.6rem;
        height: 4.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        transition: opacity .3s ease;
        &:hover { opacity: 0.5; }
        img { width: 2.4rem; height: 2.4rem; }
    }
`

export const StylesLocalization = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 3.2rem;
    align-items: center;
    flex-shrink: 0;
    button {
        display: flex;
        align-items: center;
        img {
            width: 2.4rem;
            &:not(:last-child) { margin-right: 0.8rem; }
        }
        p {
            display: flex;
            flex-direction: column;
            text-align: left;
            font-family: var(--font-red-hat);
            font-size: 1.5rem;
            font-weight: 500;
            line-height: 130%;
            color: var(--gray-400);
            max-width: 16rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            small { font-size: 1.2rem; color: var(--gray-200); }
        }
        .dropdown {
            width: 1.2rem;
            margin-left: 1.2rem;
            margin-top: 0.3rem;
        }
    }
    @media (max-width: 1100px) { display: none; }
`

export const StyleGroupLeftSide = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    @media (max-width: 900px) {
        order: 3;
        flex-basis: 100%;
        form { max-width: none; }
    }
`

export const StyleModalLocalization = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 50;
    padding: 1.6rem;
    .modal {
        background-color: var(--white);
        position: relative;
        width: 100%;
        max-width: 44.8rem;
        border-radius: 1.5rem;
        opacity: 0;
        transform: translateY(20px);
        animation: animeUp 0.3s forwards;
        padding-bottom: 3.2rem;
        .top {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            border-bottom: 1px solid var(--white-500);
            padding: 1.5rem 1.6rem;
            button img { max-width: 3.2rem; }
        }
        .content {
            padding: 3.2rem 3rem 0;
            display: flex;
            align-items: center;
            flex-direction: column;
            > img { max-width: 3.2rem; }
            h3 {
                font-size: 2.3rem;
                color: var(--gray-800);
                margin-bottom: 0.8rem;
                margin-top: 1.6rem;
            }
            p {
                color: var(--gray-400);
                font-size: 1.6rem;
                text-align: center;
                margin-bottom: 2rem;
            }
            form {
                display: flex;
                gap: 1rem;
                width: 100%;
            }
            .error {
                align-self: flex-start;
                margin-top: 0.8rem;
                color: var(--danger);
                font-size: 1.3rem;
            }
        }
        .bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2.4rem 3rem 0;
            span {
                color: var(--gray-400);
                font-size: 1.6rem;
                margin-bottom: 1.6rem;
            }
            a {
                background-color: var(--primary);
                color: var(--white);
                line-height: 5.1rem;
                border-radius: 1rem;
                font-size: 1.8rem;
                text-align: center;
                font-weight: 500;
                font-family: var(--font-red-hat);
                width: 100%;
                transition: background .3s ease;
                &:hover { background-color: var(--gray-800); }
            }
        }
    }

    @keyframes animeUp {
        100% {
            opacity: 1;
            transform: initial;
        }
    }
`

export const StyleCard = styled.div`
    position: relative;
    a { position: relative; }
    .item-count {
        font-family: var(--font-red-hat);
        background-color: var(--primary);
        color: var(--white);
        font-size: 1.1rem;
        font-weight: 700;
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: -0.8rem;
        right: -1.1rem;
    }
`
