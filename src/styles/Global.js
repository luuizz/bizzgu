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
    }

    h1, h2, h3, h4 {
        font-family: 'Red Hat Display', sans-serif;
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

`

export default GlobalStyle;