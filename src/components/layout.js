import styled from 'styled-components'

// Espaçamento padrão das páginas internas
export const Page = styled.section`
    padding: 3.2rem 0 8rem;
    .page-head {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        margin-bottom: 3.2rem;
    }
    .page-head p { font-size: 1.6rem; color: var(--gray-300); }
    @media (max-width: 600px) { padding: 2.4rem 0 5.6rem; }
`

export const Section = styled.section`
    padding: 5.6rem 0 0;
    .section-head {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1.6rem;
        margin-bottom: 3.2rem;
        a { font-size: 1.5rem; font-weight: 600; color: var(--primary); white-space: nowrap; }
        a:hover { text-decoration: underline; }
    }
`
