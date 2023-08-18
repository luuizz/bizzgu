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
    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.6rem 2.4rem;
        background-color: var(--white);
        border-radius: 1.5rem;
        .btn-count {
            img {
                margin-bottom: 0 !important;
            }
        }
        span {
            color: var(--gray-800);
            font-size: 3rem;
            width: 27.7rem;
            text-align: center;
        }
    }
`

export const StyleButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: filter .3s ease;
    &:hover {
        filter: brightness(0.1);
    }
    img {
        margin: 0;
    }
`

export const Count = styled.span`
    margin: 0 1.6rem;
    font-size: 1.8rem;
`

export const StyleButtonChart = styled.button`
    width: 100%;
    margin-top: 2.4rem;
    background-color: var(--primary);
    cursor: pointer;
    line-height: 6.3rem;
    padding: 0 4rem;
    border-radius: 1.5rem;
    color: var(--white);
    font-size: 2.1rem;
    font-family: var(--font-red-hat);
    transition: all .3s ease;
    &:hover {
        background-color: var(--gray-900);
        color: var(--white);
    }
`