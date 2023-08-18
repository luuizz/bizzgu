import styled from 'styled-components'

export const StyleItemDetail = styled.section`
    padding-top: 4rem;
    .container {
        display: flex;
        justify-content: space-between;
        .images {
            display: flex;
            width: 100%;
            max-width: 48.8rem;
            flex-direction: column;
            .destaque {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                background-color: var(--white);
                border-radius: 1rem;
                height: 48.8rem;
                img {
                    max-width: 37.6rem;
                }
            }
        }
        .infos {
            display: block;
            width: 100%;
            max-width: 58.8rem;
            h1 {
                font-family: var(--font-red-hat);
                font-size: 4rem;
                letter-spacing: -0.1rem;
                font-weight: 700;
                color: var(--gray-800);
                margin-bottom: 2rem;
            }
            p {
                color: var(--gray-400);
                font-size: 1.6rem;
                margin-bottom: 3.2rem;
            }
            img {
                max-width: 11.2rem;
                margin-bottom: 3.5rem;
            }
            h3 {
                color: var(--gray-800);
                font-family: var(--font-red-hat);
                font-size: 4rem;
                font-weight: 700;
                letter-spacing: -0.1rem;
                margin-bottom: 3.2rem;
            }
        }
        .share {
            margin-top: 2.4rem;
            ul {
                display: flex;
                align-items: center;
                justify-content: space-between;
                li {
                    display: flex;
                    button {
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        transition: all .3s ease;
                        .icon {
                            background-color: var(--white);
                            width: 100%;
                            max-width: 2.8rem;
                            padding: 0.7rem;
                            border-radius: 0.4rem;
                            img {
                                width: 100%;
                                max-width: 1.4rem;
                                margin-bottom: 0 !important;
                            }
                        }
                        span {
                            margin-left: 0.8rem;
                            color: var(--gray-300);
                            font-size: 1.5rem;
                        }
                    }
                }
            }
        }
    }
`

export const StyleThumbsItem = styled.div`
    padding: 1.6rem 0 4rem;
    display: flex;
    justify-content: space-between;
    button {
        background-color: var(--white);
        width: 100%;
        height: 14.3rem;
        max-width: 15.2rem;
        border-radius: 0.4rem;
        img {
            width: 100%;
            max-width: 11.8rem;
            margin: 0 auto;
        }
    }
`