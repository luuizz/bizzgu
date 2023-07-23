import styled from 'styled-components'

export const NavLinks = styled.section`
    border-top: 1px solid var(--white-500);
    height: 4rem;
    display: flex;
    align-items: center;
    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`

export const AllCategories = styled.div`
    border-right: 1px solid var(--white-500);
    button {
        display: flex;
        width: 20.8rem;
        align-items: center;
        cursor: pointer;
        img {
            max-width: 2.4rem;
            margin-right: 0.8rem;
        }
        span {
            color: var(--violet-800);
            font-size: 1.6rem;
            font-weight: 500;
            font-family: 'Red Hat Display', sans-serif;
        }
    }

`

export const Categories = styled.nav `
    margin-left: 5.5rem;
    ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4.2rem;
        li {
            a {
                color: var(--gray-400);
                font-family: 'Red Hat Display', sans-serif;
                font-size: 1.6rem;
                font-weight: 500;
                transition: color .3s ease;
                &:hover {
                    color: var(--primary);
                }
            }
        }
    }
`