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
        width: 50rem;
        height: 50rem;
        color: var(--primary);
        border-radius: 1rem;
    }
`