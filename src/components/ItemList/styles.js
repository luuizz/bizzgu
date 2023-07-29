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