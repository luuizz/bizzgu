import styled from 'styled-components'

export function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <Wrapper>
            <div className="card">
                <h1>{title}</h1>
                {subtitle && <p className="subtitle">{subtitle}</p>}
                {children}
                {footer && <div className="footer">{footer}</div>}
            </div>
            <aside>
                <h2>Compre com tranquilidade</h2>
                <ul>
                    <li>Acompanhe seus pedidos em tempo real</li>
                    <li>Salve produtos na lista de desejos</li>
                    <li>Checkout rápido com seus dados salvos</li>
                </ul>
            </aside>
        </Wrapper>
    )
}

const Wrapper = styled.section`
    width: 100%;
    max-width: 96rem;
    margin: 4.8rem auto 8rem;
    padding: 0 1.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .card {
        background: var(--white);
        padding: 4rem;
        border-radius: 1.6rem 0 0 1.6rem;
        display: flex;
        flex-direction: column;
    }
    h1 { font-size: 3rem; margin-bottom: 0.8rem; }
    .subtitle { font-size: 1.5rem; color: var(--gray-300); margin-bottom: 3.2rem; }
    form { display: flex; flex-direction: column; gap: 1.6rem; }
    .row-end { display: flex; justify-content: flex-end; font-size: 1.4rem; a { color: var(--primary); } }
    .footer {
        margin-top: 2.4rem;
        padding-top: 2.4rem;
        border-top: 0.1rem solid var(--white-500);
        font-size: 1.5rem;
        color: var(--gray-300);
        text-align: center;
        a { color: var(--primary); font-weight: 600; }
    }
    aside {
        background: linear-gradient(160deg, var(--primary), var(--violet-800));
        color: var(--white);
        border-radius: 0 1.6rem 1.6rem 0;
        padding: 4rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        h2 { color: var(--white); font-size: 3rem; margin-bottom: 2.4rem; }
        ul { display: flex; flex-direction: column; gap: 1.6rem; }
        li {
            font-size: 1.6rem;
            display: flex;
            gap: 1.2rem;
            &::before { content: '✓'; font-weight: 700; }
        }
    }
    @media (max-width: 800px) {
        grid-template-columns: 1fr;
        margin-top: 2.4rem;
        .card { border-radius: 1.6rem; padding: 3.2rem 2.4rem; }
        aside { display: none; }
    }
`
