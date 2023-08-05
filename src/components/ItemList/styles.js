import styled from 'styled-components'

export const MostPopulars = styled.section`
    padding: 8rem 0;
`

export const StyleTitleSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.3rem;
    img {
        max-width: 0.6rem;
        height: 0.6rem;
    }
    h2 {
        font-weight: 500;
        font-family: var(--font-red-hat);
        font-size: 4.8rem;
        color: var(--gray-800);
    }
`

export const StyleWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

export const StyleButton = styled.button`
    background-color: transparent;
    color: var(--primary);
    border: none;
    padding: 0.8rem 1.6rem;
    font-size: 1.6rem;
    cursor: pointer;
    transition: filter .3s ease;
    &:hover {
        filter: brightness(0.1);
    }
`

export const Count = styled.span`
    margin: 0 1.6rem;
    font-size: 1.8rem;
`

export const StyleButtonChart = styled.button`
    background-color: transparent;
    border: 1px solid var(--primary);
    cursor: pointer;
    line-height: 4rem;
    padding: 0 1.6rem;
    border-radius: 1rem;
    color: var(--primary);
    transition: all .3s ease;
    &:hover {
        background-color: var(--primary);
        color: var(--white);
    }
`