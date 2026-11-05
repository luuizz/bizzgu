import { NavLink, Outlet } from 'react-router-dom'
import styled from 'styled-components'

export function DashboardLayout({ title, subtitle, links, footer, variant = 'light' }) {
    return (
        <Wrapper className="container">
            <aside className={variant}>
                <div className="head">
                    <strong>{title}</strong>
                    {subtitle && <span>{subtitle}</span>}
                </div>
                <nav>
                    {links.map(({ to, end, label, icon: Icon }) => (
                        <NavLink key={to} to={to} end={end}>
                            {Icon && <Icon size={22} />}
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
                {footer && <div className="foot">{footer}</div>}
            </aside>
            <div className="content">
                <Outlet />
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 26rem minmax(0, 1fr);
    gap: 3.2rem;
    padding-top: 3.2rem;
    padding-bottom: 8rem;
    align-items: start;
    aside {
        position: sticky;
        top: 2.4rem;
        border-radius: 1.6rem;
        padding: 2.4rem 1.6rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background: var(--white);
        &.dark { background: var(--gray-500); }
    }
    .head {
        padding: 0 0.8rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        strong { font-family: var(--font-red-hat); font-size: 1.9rem; color: var(--gray-800); }
        span { font-size: 1.35rem; color: var(--gray-200); overflow: hidden; text-overflow: ellipsis; }
    }
    .dark .head strong { color: var(--white); }
    nav {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        a {
            display: flex;
            align-items: center;
            gap: 1.2rem;
            padding: 1.1rem 1.2rem;
            border-radius: 0.8rem;
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--gray-400);
            transition: background .2s ease, color .2s ease;
            &:hover { background: var(--white-600); color: var(--gray-800); }
            &.active { background: var(--primary-50); color: var(--primary); font-weight: 600; }
        }
    }
    .dark nav a {
        color: var(--gray-100);
        &:hover { background: var(--gray-400); color: var(--white); }
        &.active { background: var(--primary); color: var(--white); }
    }
    .foot {
        border-top: 0.1rem solid var(--white-500);
        padding: 1.6rem 0.8rem 0;
        font-size: 1.4rem;
        a, button {
            display: inline-flex;
            align-items: center;
            gap: 0.8rem;
            color: var(--gray-300);
            font-size: 1.4rem;
            &:hover { color: var(--primary); }
        }
    }
    .dark .foot { border-color: var(--gray-400); a, button { color: var(--gray-100); } }
    .content { min-width: 0; display: flex; flex-direction: column; gap: 2.4rem; }

    @media (max-width: 900px) {
        grid-template-columns: minmax(0, 1fr);
        padding-top: 2rem;
        aside {
            position: static;
            padding: 1.2rem;
            gap: 1.2rem;
        }
        .head { display: none; }
        nav {
            flex-direction: row;
            overflow-x: auto;
            scrollbar-width: none;
            &::-webkit-scrollbar { display: none; }
            a { white-space: nowrap; }
        }
        .foot { display: none; }
    }
`

export const DashHeader = styled.header`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.6rem;
    flex-wrap: wrap;
    h1 { font-size: 2.8rem; letter-spacing: -0.05rem; }
    p { font-size: 1.5rem; color: var(--gray-300); margin-top: 0.6rem; }
    .back { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 1.4rem; font-weight: 600; color: var(--primary); margin-bottom: 0.8rem; }
    .actions { display: flex; gap: 1.2rem; flex-wrap: wrap; }
`

export const StatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(${({ $cols = 4 }) => $cols}, minmax(0, 1fr));
    gap: 1.6rem;
    @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    @media (max-width: 480px) { grid-template-columns: 1fr; }
`

export const Stat = ({ label, value, hint, tone, icon: Icon }) => (
    <StatCard $tone={tone}>
        <div className="top">
            <span>{label}</span>
            {Icon && <i aria-hidden="true"><Icon size={22} /></i>}
        </div>
        <strong>{value}</strong>
        {hint && <small>{hint}</small>}
    </StatCard>
)

const StatCard = styled.div`
    background: var(--white);
    border-radius: 1.2rem;
    padding: 2rem 2.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    border-top: 0.3rem solid ${({ $tone }) => ($tone ? `var(--${$tone})` : 'var(--primary)')};
    .top { display: flex; align-items: center; justify-content: space-between; gap: 1.2rem; }
    i {
        display: grid;
        place-items: center;
        width: 4rem;
        height: 4rem;
        border-radius: 1rem;
        flex-shrink: 0;
        color: ${({ $tone }) => ($tone ? `var(--${$tone})` : 'var(--primary)')};
        background: ${({ $tone }) => ($tone ? `var(--${$tone}-50)` : 'var(--primary-50)')};
    }
    span { font-size: 1.35rem; color: var(--gray-300); font-weight: 500; }
    strong { font-family: var(--font-red-hat); font-size: 2.8rem; color: var(--gray-800); letter-spacing: -0.05rem; }
    small { font-size: 1.3rem; color: var(--gray-200); }
`

export const CardTitle = styled.h2`
    font-size: 1.9rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    a { font-family: 'Inter', sans-serif; font-size: 1.4rem; font-weight: 600; color: var(--primary); }
`
