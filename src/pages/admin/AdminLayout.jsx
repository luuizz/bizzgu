import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
    ArrowSquareOut,
    CaretDown,
    CaretRight,
    GearSix,
    ChartPieSlice,
    List,
    Package,
    PresentationChart,
    Receipt,
    SignOut,
    SquaresFour,
    Tag,
    Storefront,
    UserCircle,
    UsersThree,
    X,
} from '@phosphor-icons/react'
import { Loader } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import logo from '/src/assets/logo-theme-dark.svg'

const STORE_URL = import.meta.env.BASE_URL

const groups = [
    {
        title: 'Visão geral',
        links: [{ to: '/admin', label: 'Painel', icon: ChartPieSlice, end: true }],
    },
    {
        title: 'Vendas',
        links: [{ to: '/admin/pedidos', label: 'Pedidos', icon: Receipt }],
    },
    {
        title: 'Catálogo',
        links: [
            { to: '/admin/produtos', label: 'Produtos', icon: Package },
            { to: '/admin/categorias', label: 'Categorias', icon: SquaresFour },
            { to: '/admin/tags', label: 'Tags', icon: Tag },
        ],
    },
    {
        title: 'Loja',
        links: [
            { to: '/admin/banners', label: 'Banners', icon: PresentationChart },
            { to: '/admin/configuracoes', label: 'Configurações', icon: GearSix },
        ],
    },
    {
        title: 'Pessoas',
        links: [{ to: '/admin/clientes', label: 'Clientes', icon: UsersThree }],
    },
]

// Nome de cada trecho da URL no breadcrumb do topo
const crumbLabels = {
    pedidos: 'Pedidos',
    produtos: 'Produtos',
    categorias: 'Categorias',
    clientes: 'Clientes',
    banners: 'Banners',
    tags: 'Tags',
    configuracoes: 'Configurações',
}

function useCrumbs(pathname) {
    const parts = pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean)
    const crumbs = [{ label: 'Painel', to: '/admin' }]
    parts.forEach((part, index) => {
        const to = `/admin/${parts.slice(0, index + 1).join('/')}`
        const parent = parts[index - 1]
        const isNew = part === 'novo' || part === 'nova'
        const label = crumbLabels[part] || {
            pedidos: 'Detalhes do pedido',
            produtos: isNew ? 'Novo produto' : 'Editar produto',
            banners: isNew ? 'Novo banner' : 'Editar banner',
            categorias: isNew ? 'Nova categoria' : 'Editar categoria',
            tags: isNew ? 'Nova tag' : 'Editar tag',
        }[parent] || part
        crumbs.push({ label, to })
    })
    return crumbs
}

function initials(name) {
    return name
        .split(/[\s@.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('')
}

export function AdminLayout() {
    const { pathname } = useLocation()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const crumbs = useCrumbs(pathname)

    // Fecha o menu lateral (mobile) ao navegar ou apertar Esc
    useEffect(() => setDrawerOpen(false), [pathname])
    useEffect(() => {
        if (!drawerOpen) return
        const onKey = (event) => event.key === 'Escape' && setDrawerOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [drawerOpen])

    return (
        <Shell>
            <Sidebar className={drawerOpen ? 'open' : ''} aria-label="Menu do painel">
                <div className="brand">
                    <Link to="/admin" title="Início do painel">
                        <img src={logo} alt="Bizzgu" />
                    </Link>
                    <span className="tag">Admin</span>
                    <button type="button" className="close" onClick={() => setDrawerOpen(false)} aria-label="Fechar menu">
                        <X size={22} />
                    </button>
                </div>

                <nav>
                    {groups.map((group) => (
                        <div className="group" key={group.title}>
                            <span className="group-title">{group.title}</span>
                            {group.links.map(({ to, label, icon: Icon, end }) => (
                                <NavLink key={to} to={to} end={end}>
                                    <Icon size={22} />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <a className="store-link" href={STORE_URL} target="_blank" rel="noreferrer">
                    <Storefront size={22} />
                    <span>Ver loja</span>
                    <ArrowSquareOut size={16} className="ext" />
                </a>
            </Sidebar>

            {drawerOpen && <Backdrop onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

            <Main>
                <Topbar>
                    <button type="button" className="menu-toggle" onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
                        <List size={24} />
                    </button>
                    <nav aria-label="Você está em" className="crumbs">
                        <ol>
                            {crumbs.map((crumb, index) => (
                                <li key={crumb.to}>
                                    {index > 0 && <CaretRight size={14} weight="bold" className="sep" />}
                                    {index === crumbs.length - 1
                                        ? <span aria-current="page">{crumb.label}</span>
                                        : <Link to={crumb.to}>{crumb.label}</Link>}
                                </li>
                            ))}
                        </ol>
                    </nav>
                    <UserMenu />
                </Topbar>

                <Content className="admin-content">
                    <Suspense fallback={<Loader />}>
                        <Outlet />
                    </Suspense>
                </Content>
            </Main>
        </Shell>
    )
}

function UserMenu() {
    const { user, profile, signOut } = useAuth()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const name = profile?.full_name || user.email

    useEffect(() => setOpen(false), [pathname])
    useEffect(() => {
        if (!open) return
        const onClick = (event) => ref.current && !ref.current.contains(event.target) && setOpen(false)
        const onKey = (event) => event.key === 'Escape' && setOpen(false)
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <UserWrapper ref={ref}>
            <button type="button" className="trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu">
                <span className="avatar" aria-hidden="true">{initials(name)}</span>
                <span className="who">
                    <strong>{profile?.full_name || 'Administrador'}</strong>
                    <small>{user.email}</small>
                </span>
                <CaretDown size={16} weight="bold" className="caret" />
            </button>
            {open && (
                <div className="menu" role="menu">
                    <Link role="menuitem" to="/minha-conta"><UserCircle size={20} /> Minha conta</Link>
                    <a role="menuitem" href={STORE_URL} target="_blank" rel="noreferrer"><Storefront size={20} /> Ver loja</a>
                    <button role="menuitem" type="button" onClick={handleSignOut}><SignOut size={20} /> Sair</button>
                </div>
            )}
        </UserWrapper>
    )
}

const SIDEBAR = '26rem'

const Shell = styled.div`
    min-height: 100vh;
    background: var(--white-600);
`

const Sidebar = styled.aside`
    position: fixed;
    inset: 0 auto 0 0;
    width: ${SIDEBAR};
    background: var(--gray-500);
    color: var(--gray-100);
    display: flex;
    flex-direction: column;
    padding: 2.4rem 1.6rem;
    gap: 2.4rem;
    z-index: 40;
    overflow-y: auto;

    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0 0.8rem;
        img { height: 3rem; display: block; }
        .tag {
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: 0.08rem;
            text-transform: uppercase;
            color: var(--primary-100);
            background: rgba(105, 60, 234, 0.28);
            padding: 0.3rem 0.8rem;
            border-radius: 0.6rem;
        }
        .close { display: none; margin-left: auto; color: var(--gray-100); }
    }

    nav { display: flex; flex-direction: column; gap: 2rem; flex: 1; }
    .group { display: flex; flex-direction: column; gap: 0.4rem; }
    .group-title {
        font-size: 1.1rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08rem;
        color: var(--gray-300);
        padding: 0 1.2rem 0.4rem;
    }
    nav a, .store-link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 1.2rem;
        padding: 1rem 1.2rem;
        border-radius: 0.8rem;
        font-size: 1.5rem;
        font-weight: 500;
        color: var(--gray-100);
        transition: background .2s ease, color .2s ease;
        &:hover { background: rgba(255, 255, 255, 0.06); color: var(--white); }
    }
    nav a.active {
        background: rgba(105, 60, 234, 0.22);
        color: var(--white);
        font-weight: 600;
        svg { color: var(--primary-100); }
        &::before {
            content: '';
            position: absolute;
            left: -1.6rem;
            top: 0.8rem;
            bottom: 0.8rem;
            width: 0.3rem;
            border-radius: 0 0.3rem 0.3rem 0;
            background: var(--primary);
        }
    }
    .store-link {
        border: 0.1rem solid var(--gray-400);
        .ext { margin-left: auto; opacity: 0.7; }
    }

    @media (max-width: 1024px) {
        transform: translateX(-100%);
        transition: transform .25s ease;
        box-shadow: none;
        &.open { transform: none; box-shadow: 0 0 6rem rgba(0, 0, 0, 0.4); }
        .brand .close { display: inline-flex; }
    }
`

const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(16, 7, 23, 0.5);
    z-index: 35;
    @media (min-width: 1025px) { display: none; }
`

const Main = styled.div`
    margin-left: ${SIDEBAR};
    min-width: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    @media (max-width: 1024px) { margin-left: 0; }
`

const Topbar = styled.header`
    position: sticky;
    top: 0;
    z-index: 30;
    height: 6.4rem;
    display: flex;
    align-items: center;
    gap: 1.6rem;
    padding: 0 3.2rem;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(0.8rem);
    border-bottom: 0.1rem solid var(--gray-50);

    .menu-toggle { display: none; color: var(--gray-400); }
    .crumbs { min-width: 0; flex: 1; }
    ol { display: flex; align-items: center; gap: 0.4rem; min-width: 0; }
    li {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 1.4rem;
        white-space: nowrap;
        min-width: 0;
        a { color: var(--gray-200); &:hover { color: var(--primary); } }
        span { color: var(--gray-800); font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
        .sep { color: var(--gray-100); flex-shrink: 0; }
    }

    @media (max-width: 1024px) {
        padding: 0 1.6rem;
        .menu-toggle { display: inline-flex; }
    }
    @media (max-width: 600px) {
        li:not(:last-child) { display: none; }
        li:last-child .sep { display: none; }
    }
`

const UserWrapper = styled.div`
    position: relative;
    .trigger {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.4rem 0.8rem 0.4rem 0.4rem;
        border-radius: 5rem;
        transition: background .2s ease;
        &:hover { background: var(--white-600); }
    }
    .avatar {
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--primary);
        color: var(--white);
        font-family: var(--font-red-hat);
        font-weight: 700;
        font-size: 1.4rem;
    }
    .who {
        display: flex;
        flex-direction: column;
        text-align: left;
        line-height: 1.25;
        strong { font-size: 1.4rem; color: var(--gray-800); max-width: 18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        small { font-size: 1.2rem; color: var(--gray-200); max-width: 18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
    .caret { color: var(--gray-200); }
    .menu {
        position: absolute;
        right: 0;
        top: calc(100% + 0.8rem);
        min-width: 22rem;
        background: var(--white);
        border-radius: 1.2rem;
        box-shadow: 0 1.2rem 4rem rgba(16, 7, 23, 0.16);
        padding: 0.8rem;
        display: flex;
        flex-direction: column;
        a, button {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.2rem;
            border-radius: 0.8rem;
            font-size: 1.45rem;
            color: var(--gray-400);
            text-align: left;
            &:hover { background: var(--white-600); color: var(--primary); }
        }
        button { border-top: 0.1rem solid var(--white-500); border-radius: 0 0 0.8rem 0.8rem; margin-top: 0.4rem; }
    }
    @media (max-width: 700px) {
        .who, .caret { display: none; }
        .trigger { padding: 0; }
    }
`

const Content = styled.div`
    flex: 1;
    width: 100%;
    max-width: 144rem;
    padding: 3.2rem;
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    @media (max-width: 600px) { padding: 2rem 1.6rem 4rem; }
`
