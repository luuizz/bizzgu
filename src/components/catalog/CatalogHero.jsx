import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { CreditCard, Package, Truck } from '@phosphor-icons/react'
import Skeleton from 'react-loading-skeleton'
import { Breadcrumb } from '../ui'
import { DarkSkeletonTheme } from '../skeletons'
import { formatBRL, FREE_SHIPPING_FROM, imageUrl } from '../../lib/format'

// Topo das páginas de categoria e de tag: faixa com o fundo da marca, imagem ou
// ícone, título, descrição, contagem, benefícios e atalhos para os irmãos.
// loading: mostra o esqueleto (mesma faixa escura) enquanto a categoria/tag carrega
export function CatalogHero({ crumbs, title, description, image, icon: Icon, count, links = [], linksLabel, loading = false }) {
    if (loading) {
        return (
            <Hero aria-busy="true" aria-label="Carregando">
                <DarkSkeletonTheme>
                    <div className="container">
                        <Skeleton width={160} height={14} />
                        <div className="main">
                            <Skeleton className="media" borderRadius={24} />
                            <div className="text">
                                <Skeleton width={280} height={46} />
                                <Skeleton width="min(52rem, 80vw)" height={18} />
                                <ul className="facts">
                                    {[110, 230, 150].map((width) => <li key={width} className="ghost"><Skeleton width={width - 30} height={14} /></li>)}
                                </ul>
                            </div>
                        </div>
                        {links.length > 1 && (
                            <nav className="links" aria-label={linksLabel}>
                                {links.map((link) => <NavLink key={link.to} to={link.to}>{link.label}</NavLink>)}
                            </nav>
                        )}
                    </div>
                </DarkSkeletonTheme>
            </Hero>
        )
    }

    return (
        <Hero>
            <div className="container">
                <Breadcrumb items={crumbs} $tone="light" />
                <div className="main">
                    <div className="media" aria-hidden="true">
                        {image ? <img src={imageUrl(image)} alt="" /> : <Icon size={56} />}
                    </div>
                    <div className="text">
                        <h1>{title}</h1>
                        {description && <p>{description}</p>}
                        <ul className="facts">
                            <li><Package size={18} /> {count == null ? 'Carregando...' : `${count} ${count === 1 ? 'produto' : 'produtos'}`}</li>
                            <li><Truck size={18} /> Frete grátis acima de {formatBRL(FREE_SHIPPING_FROM)}</li>
                            <li><CreditCard size={18} /> Até 10x sem juros</li>
                        </ul>
                    </div>
                </div>
                {links.length > 1 && (
                    <nav className="links" aria-label={linksLabel}>
                        {links.map((link) => (
                            <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
                        ))}
                    </nav>
                )}
            </div>
        </Hero>
    )
}

const Hero = styled.section`
    position: relative;
    overflow: hidden;
    color: var(--white);
    background:
        radial-gradient(60rem 40rem at 85% 0%, rgba(105, 60, 234, 0.55), transparent 70%),
        radial-gradient(40rem 30rem at 0% 100%, rgba(105, 60, 234, 0.25), transparent 70%),
        var(--gray-500);
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
        background-size: 2.4rem 2.4rem;
        mask-image: linear-gradient(90deg, transparent 30%, #000 100%);
        pointer-events: none;
    }
    .container { position: relative; z-index: 1; padding-top: 2.4rem; padding-bottom: 3.2rem; display: flex; flex-direction: column; gap: 2.4rem; }
    .main { display: flex; align-items: center; gap: 3.2rem; }
    .media {
        width: 12rem;
        height: 12rem;
        flex-shrink: 0;
        border-radius: 2.4rem;
        display: grid;
        place-items: center;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.08);
        border: 0.1rem solid rgba(255, 255, 255, 0.16);
        color: var(--primary-100);
        img { width: 100%; height: 100%; object-fit: cover; }
    }
    .text { display: flex; flex-direction: column; gap: 1.2rem; min-width: 0; }
    span.media { border: 0; display: block; line-height: 1; }
    .facts li.ghost { line-height: 1; }
    h1 { font-size: 4.4rem; line-height: 1.05; letter-spacing: -0.02em; color: var(--white); }
    p { font-size: 1.7rem; line-height: 1.5; color: var(--gray-100); max-width: 70rem; }
    .facts { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 0.4rem; }
    .facts li {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 1.35rem;
        padding: 0.6rem 1.2rem;
        border-radius: 2rem;
        background: rgba(255, 255, 255, 0.08);
        border: 0.1rem solid rgba(255, 255, 255, 0.14);
        svg { color: var(--primary-100); }
    }
    .links {
        display: flex;
        gap: 0.8rem;
        overflow-x: auto;
        scrollbar-width: none;
        padding-top: 2rem;
        border-top: 0.1rem solid rgba(255, 255, 255, 0.12);
        &::-webkit-scrollbar { display: none; }
        a {
            white-space: nowrap;
            font-size: 1.4rem;
            font-weight: 500;
            padding: 0.8rem 1.6rem;
            border-radius: 2rem;
            color: var(--gray-100);
            background: rgba(255, 255, 255, 0.06);
            transition: background .2s ease, color .2s ease;
            &:hover { background: rgba(255, 255, 255, 0.14); color: var(--white); }
            &.active { background: var(--white); color: var(--gray-500); font-weight: 700; }
        }
    }
    @media (max-width: 700px) {
        .container { padding-top: 1.6rem; padding-bottom: 2.4rem; gap: 2rem; }
        .main { flex-direction: column; align-items: flex-start; gap: 1.6rem; }
        .media { width: 7.2rem; height: 7.2rem; border-radius: 1.6rem; svg { width: 3.6rem; height: 3.6rem; } }
        h1 { font-size: 3rem; }
        p { font-size: 1.5rem; }
    }
`
