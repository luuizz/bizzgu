import styled from 'styled-components'

export const StyleCardProduct = styled.div`
    margin-top: 5rem;
    background-color: var(--white);
    padding: 1.6rem 3.1rem 2.4rem;
    width: 100%;
    max-width: 28rem;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    cursor: pointer;
    &:hover {
        .image {
            img {
                transform: scale(1.05);
            }
        }
    }
    .image {
        margin-bottom: 2.4rem;
        overflow: hidden;
        width: 21.8rem;
        height: 18.4rem;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .3s ease, -webkit-transform .3s ease;
        }
    }
    .middle {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 2.1rem;
        .review {
            display: flex;
            align-items: center;
            img {
                max-width: 11.2rem;
                margin-right: 0.8rem;
            }
            span {
                font-family: var(--font-red-hat);
                font-size: 1.6rem;
                line-height: 120%;
                font-weight: 600;
                color: var(--violet-800);
            }
        }
        .share {
            display: flex;
            img {
                &:not(:last-child) {
                    margin-right: 1.6rem;
                }
            }
        }
    }
    .info {
        margin-bottom: 1.6rem;
        span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            font-size: 1.6rem;
            color: var(--gray-700);
            line-height: 120%;
            margin-bottom: 2.4rem;
        }
        h3 {
            color: var(--gray-700);
            font-size: 3rem;
            font-family: var(--font-red-hat);
        }
    }
`