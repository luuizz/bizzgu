import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: 0;
        text-decoration: none;
        list-style: none;
        font-family: 'Inter', sans-serif;
    }
    
    .container {
        margin: 0 auto;
        width: 100%;
        max-width: 124.6rem;
        padding: 0 1.5rem;
    }

    html, body {
        font-size: 62.5%;
    }

    :root {
        //Brand Colors
        --primary: #693CEA;
        --secondary: #0011ff;

        //Violet
        --violet-700: #4b2ba6;
        --violet-800: #3a2181;

        //White
        --white: #fff;
        --white-100: #fefdff;
        --white-500: #f2f2f2;
        --white-600: #f1f1f7;

        //Grayscale
        --gray-50: #e7e6e8;
        --gray-100: #b5b2b7;
        --gray-200: #918d94;
        --gray-300: #5f5964;
        --gray-400: #403945;
        --gray-500: #100717;
        --gray-600: #0f0615;
        --gray-700: #0b0510;
        --gray-800: #09040d;
        --gray-900: #07030a;


        //Fonts
        --font-red-hat: 'Red Hat Display', sans-serif;
    }

    h1, h2, h3, h4 {
        font-family: var(--font-red-hat);
        line-height: 120%;
    }

    p {
        line-height: 150%;
    }

    button {
        background-color: transparent;
        border: 0;
    }

    img {
        width: 100%;
        display: block;
    }

    body {
        background-color: var(--white-600);
        &::-webkit-scrollbar {
            background-color: var(--gray-600);
            height: 0.5rem;
            width: 0.5rem;
        }

        &::-webkit-scrollbar-thumb {
            background-color: var(--primary);
            border-radius: 0.4rem;
        }

        &::-webkit-scrollbar-track {
            border-radius: .4rem;
        }
    }

    .btn-primary {
        display: inline-block;
        line-height: 4rem;
        padding: 0 3.6rem;
        font-family: var(--font-red-hat);
        background-color: var(--primary);
        color: var(--white);
        font-size: 1.5rem;
        cursor: pointer;
        transition: filter .3s ease;
        font-weight: 500;
        border-radius: 1rem;
        &:hover {
            filter: brightness(0.5);
        }
    }

    .btn-secondary {
        cursor: pointer;
        background-color: transparent;
        color: var(--primary);
        border: 1px solid var(--primary);
        line-height: 2rem;
        padding: 1rem 4rem;
        font-size: 1.5rem;
        font-family: var(--font-red-hat);
        text-align: center;
        border-radius: 1rem;
        transition: all .3s ease;
        &:hover {
            background-color: var(--primary);
            color: var(--white);
        }
    }

    .item-list {
        background-color: var(--white);
    padding: 1.6rem 3.1rem 2.4rem;
    width: 100%;
    max-width: 28rem;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    cursor: pointer;
    &:hover {
        .image {
            img {
                transform: scale(1.05);
            }
        }
    }
    .image {
        margin-bottom: 2.4rem;
        overflow: hidden;
        width: 21.8rem;
        height: 18.4rem;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .3s ease, -webkit-transform .3s ease;
        }
    }
    .middle {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 2.1rem;
        .review {
            display: flex;
            align-items: center;
            img {
                max-width: 11.2rem;
                margin-right: 0.8rem;
            }
            span {
                font-family: var(--font-red-hat);
                font-size: 1.6rem;
                line-height: 120%;
                font-weight: 600;
                color: var(--violet-800);
            }
        }
        .share {
            display: flex;
            img {
                &:not(:last-child) {
                    margin-right: 1.6rem;
                }
            }
        }
    }
    .info {
        margin-bottom: 1.6rem;
        span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            font-size: 1.6rem;
            color: var(--gray-700);
            line-height: 120%;
            margin-bottom: 2.4rem;
            height: 5.7rem;
        }
        h3 {
            color: var(--gray-700);
            font-size: 3rem;
            font-family: var(--font-red-hat);
        }
    }
    }

`

export default GlobalStyle;