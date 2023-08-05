import styled from 'styled-components'

export const StyleBtnPrimary = styled.a`
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
`