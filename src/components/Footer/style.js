import styled from 'styled-components'

export const StyleButtonContact = styled.button`
    background-color: var(--secondary);
    color: var(--white);
    display: flex;
    flex-direction: column;
    padding: 1.6rem 3.2rem;
    border-radius: 0.6rem;
    cursor: pointer;
    transition: all .3s ease;
    &:hover {
        box-shadow:  0 0 15px 1px var(--secondary);
        animation: 3.4s cubic-bezier(0.2, 0.5, 0.9, 0.6) 2s infinite normal none running bgs;
        background-image: linear-gradient(45deg, #3341FF, #0a18d7, #3341FF, #0a18d7);
        background-size: 400% 200%;
    }
    span, strong {
        font-size: 1.4rem;
    }
`

export const StyleFooter = styled.footer`
    padding: 4rem 0;
    background-color: var(--gray-500);
    .container {
        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 0.2rem solid var(--gray-400);
            margin-bottom: 4.8rem;
            padding-bottom: 3.2rem;
            .left-area {

            }
            .right-area {
                display: flex;
                span {
                    color: var(--gray-100);
                    font-size: 1.5rem;
                    margin-right: 3rem;
                }
                ul {
                    display: flex;
                    li {
                        &:not(:last-child) {
                            margin-right: 3rem;
                        }
                    }
                }
            }
        }
        .center {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            border-bottom: 0.2rem solid var(--gray-400);
            margin-bottom: 2.6rem;
            padding-bottom: 3.8rem;
            .links {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-gap: 7.2rem;
                .list-item {
                    h5 {
                        font-size: 1.5rem;
                        color: var(--white);
                        margin-bottom: 3.2rem;
                    }
                    ul {
                        li {
                            &:not(:last-child) {
                                margin-bottom: 2.4rem;
                            }
                            a {
                                font-size: 1.4rem;
                                color: var(--gray-100);
                                transition: color .3s ease;
                                &:hover {
                                    color: var(--white);
                                }
                            }
                        }
                    }
                }
            }
            .contact {
                display: flex;
                flex-direction: column;
                gap: 2.4rem;
            }
        }
        .bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left-area {
                .ft-txt {
                    font-size: 1.4rem;
                    color: var(--gray-100);
                }
            }
            .right-area {
                display: flex;
                align-items: center;
                flex-direction: row;
                span {
                    font-size: 1.4rem;
                    color: var(--gray-100);
                    margin-right: 1.6rem;
                }
            }
        }
    }

    @keyframes bgs {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 100% 0;
        }
    }
`