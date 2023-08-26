import styled from 'styled-components'

export const StylesHeader = styled.header`
    height: 8.5rem;
    display: flex;
    align-items: center;
    background-color: var(--white-100);
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        .contentHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: 100.8rem;
        }
    }
`

export const StylesLogo = styled.div`
    margin-right: 10.7rem;
    a {
        img {
            max-width: 10.1rem;
        }
    }
`

export const StylesGroupProfile = styled.ul`
    display: flex;
    align-items: center;
    gap: 2.4rem;
`

export const StylesSearchHeader = styled.form`
    display: block;
    position: relative;
    input {
        font-family: 'Red Hat Display', sans-serif;
        width: 44.8rem;
        height: 4.9rem;
        padding: 1.2rem 1.6rem;
        border-radius: 0.4rem;
        border: 0.1rem solid var(--white-500);
        background: var(--white);
        color: var(--gray-600);
        font-weight: 500;
        transition: border .3s ease;
        font-size: 1.6rem;
        &::placeholder {
            font-weight: 500;
            font-family: 'Red Hat Display', sans-serif;
            color: var(--gray-100);
        }
        &:focus {
            border: 1px solid var(--primary);
        }
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
        cursor: pointer;
        transition: opacity .3s ease;
        &:hover {
            opacity: 0.5;
        }
        img {
            width: 2.4rem;
            height: 2.4rem;
        }
    }
`

export const StylesLocalization = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 5rem;
    align-items: center;
    button {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
            &:not(:last-child) {
                margin-right: 0.8rem;
            }
        }
        p {
            font-family: 'Red Hat Display', sans-serif;
            font-size: 1.6rem;
            font-weight: 500;
            line-height: 150%;
            color: var(--gray-400);
        }
        .dropdown {
            margin-left: 1.6rem;
            margin-top: 0.3rem;
        }
    }
`

export const StyleGroupLeftSide = styled.div`
    display: flex;
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
    background-color: rgba(0,0,0,0.3);
    transition: all .3s ease;
    z-index: 20;
    .modal {
        background-color: var(--white);
        position:  absolute;
        width: 44.8rem;
        height: 47rem;
        color: var(--primary);
        border-radius: 1.5rem;
        opacity: 0;
        transform: translateY(20px);
        animation: animeUp 0.3s forwards;
        .top {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            border-bottom: 1px solid var(--white-500);
            padding: 1.5rem 1.6rem 1.5rem 0;
            button {
                cursor: pointer;
                img {
                    max-width: 3.2rem;
                }
            }
        }
        .content {
            padding: 3.2rem 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            img {
                max-width: 3.2rem;
            }
            h3 {
                font-size: 2.3rem;
                font-family: var(--font-red-hat);
                color: var(--gray-800);
                margin-bottom: 0.8rem;
                margin-top: 1.6rem;
            }
            p {
                color: var(--gray-400);
                font-size: 1.6rem;
                text-align: center;
                margin-bottom: 1.6rem;
            }
            form {
                input {
                    width: 38.6rem;
                }
            }
        }
        .bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            span {
                color: var(--gray-400);
                font-size: 1.6rem;
                margin-bottom: 2.4rem;
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
                width: 38.7rem;
                cursor: pointer;
                transition: background .3s ease;
                &:hover {
                    background-color: var(--gray-800);
                }
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