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

    :root {
        /* Brand Colors */
        --primary: #693CEA;
        --primary-50: #f3effe;
        --primary-100: #e4dbfc;
        --secondary: #0011ff;

        /* Violet */
        --violet-700: #4b2ba6;
        --violet-800: #3a2181;

        /* White */
        --white: #fff;
        --white-100: #fefdff;
        --white-500: #f2f2f2;
        --white-600: #f1f1f7;

        /* Grayscale */
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

        /* Feedback */
        --success: #1a8754;
        --success-50: #e6f5ed;
        --warning: #b26b00;
        --warning-50: #fff4e0;
        --danger: #d1293d;
        --danger-50: #fdecee;
        --info: #2563eb;
        --info-50: #e8f0fe;
        --neutral: #5f5964;
        --neutral-50: #efeef1;

        /* Fonts */
        --font-red-hat: 'Red Hat Display', sans-serif;

        --radius: 1rem;
        --shadow-sm: 0 0.1rem 0.3rem rgba(16, 7, 23, 0.06);
        --shadow: 0 0.8rem 2.4rem rgba(16, 7, 23, 0.08);
    }

    html, body {
        font-size: 62.5%;
    }

    body {
        background-color: var(--white-600);
        color: var(--gray-700);
        -webkit-font-smoothing: antialiased;
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

    #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    main {
        flex: 1;
    }

    .container {
        margin: 0 auto;
        width: 100%;
        max-width: 124.6rem;
        padding: 0 1.5rem;
    }

    h1, h2, h3, h4, h5 {
        font-family: var(--font-red-hat);
        line-height: 120%;
        color: var(--gray-800);
    }

    p {
        line-height: 150%;
    }

    a {
        color: inherit;
    }

    button {
        background-color: transparent;
        border: 0;
        font: inherit;
        color: inherit;
    }

    button:not(:disabled) {
        cursor: pointer;
    }

    img {
        width: 100%;
        display: block;
    }

    input, select, textarea {
        font: inherit;
    }

    /* Foco visível só para navegação por teclado */
    :focus-visible {
        outline: 0.2rem solid var(--primary);
        outline-offset: 0.2rem;
        border-radius: 0.4rem;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
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
        display: inline-block;
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

    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }
`

export default GlobalStyle
