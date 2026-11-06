import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutGroup, LazyMotion, MotionConfig, domMax, m } from 'motion/react'
import styled from 'styled-components'
import {
    Article,
    ArrowSquareOut,
    CaretDown,
    CaretRight,
    GearSix,
    ChartPieSlice,
    List,
    SidebarSimple,
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
import { AnimatedOutlet } from '../../components/AnimatedOutlet'
import { useAuth } from '../../hooks/useAuth'
import logo from '/src/assets/logo-theme-dark.svg'
import logoMark from '/src/assets/favicon.svg'

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
        title: 'Conteúdo',
        links: [{ to: '/admin/blog', label: 'Blog', icon: Article }],
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
    blog: 'Blog',
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
            blog: isNew ? 'Novo post' : 'Editar post',
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

const COLLAPSE_KEY = 'bizzgu:admin-sidebar'
const readCollapsed = () => {
    try { return localStorage.getItem(COLLAPSE_KEY) === 'collapsed' } catch { return false }
}

export function AdminLayout() {
    const { pathname } = useLocation()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(readCollapsed)
    const [tip, setTip] = useState(null) // dica com o nome do item quando o menu está recolhido
    const crumbs = useCrumbs(pathname)

    const toggleCollapsed = () => setCollapsed((current) => {
        try { localStorage.setItem(COLLAPSE_KEY, current ? 'expanded' : 'collapsed') } catch { /* sem armazenamento */ }
        return !current
    })

    // Botão do topo: no celular abre o menu; no computador recolhe/expande
    const onMenuButton = () => (window.matchMedia('(max-width: 1024px)').matches ? setDrawerOpen(true) : toggleCollapsed())

    // Fecha o menu lateral (mobile) ao navegar ou apertar Esc
    useEffect(() => { setDrawerOpen(false); setTip(null) }, [pathname])
    useEffect(() => {
        if (!drawerOpen) return
        const onKey = (event) => event.key === 'Escape' && setDrawerOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [drawerOpen])

    const showTip = (label) => (event) => {
        if (!collapsed || window.matchMedia('(max-width: 1024px)').matches) return
        const rect = event.currentTarget.getBoundingClientRect()
        setTip({ label, top: rect.top + rect.height / 2 })
    }
    const hideTip = () => setTip(null)

    return (
        // Animações com Motion só no painel (fora do pacote da loja).
        // reducedMotion="user": respeita quem pede menos movimento no sistema.
        <LazyMotion features={domMax}>
        <MotionConfig reducedMotion="user">
        <Shell className={collapsed ? 'collapsed' : ''}>
            <Sidebar className={drawerOpen ? 'open' : ''} aria-label="Menu do painel">
                <div className="brand">
                    <Link to="/admin" title="Início do painel" className="logo">
                        <img src={logo} alt="Bizzgu" className="full" />
                        <img src={logoMark} alt="" className="mark" />
                    </Link>
                    <span className="tag">Admin</span>
                    <button type="button" className="close" onClick={() => setDrawerOpen(false)} aria-label="Fechar menu">
                        <X size={22} />
                    </button>
                </div>

                <LayoutGroup id="admin-nav">
                    <nav>
                        {groups.map((group) => (
                            <div className="group" key={group.title} role="group" aria-label={group.title}>
                                <span className="group-title" aria-hidden="true">{group.title}</span>
                                {group.links.map(({ to, label, icon: Icon, end }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        end={end}
                                        aria-label={collapsed ? label : undefined}
                                        onMouseEnter={showTip(label)}
                                        onMouseLeave={hideTip}
                                        onFocus={showTip(label)}
                                        onBlur={hideTip}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && <m.span layoutId="admin-nav-active" className="pill" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />}
                                                <Icon size={22} weight={isActive ? 'fill' : 'duotone'} />
                                                <span className="label">{label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        ))}
                    </nav>
                </LayoutGroup>

                <div className="foot">
                    <a className="store-link" href={STORE_URL} target="_blank" rel="noreferrer" onMouseEnter={showTip('Ver loja')} onMouseLeave={hideTip} aria-label={collapsed ? 'Ver loja' : undefined}>
                        <Storefront size={22} />
                        <span className="label">Ver loja</span>
                        <ArrowSquareOut size={16} className="ext" />
                    </a>
                    <button type="button" className="collapse" onClick={toggleCollapsed} onMouseEnter={showTip('Expandir menu')} onMouseLeave={hideTip} aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'} aria-pressed={collapsed}>
                        <SidebarSimple size={22} />
                        <span className="label">Recolher menu</span>
                    </button>
                </div>

                {tip && <span className="tip" style={{ top: tip.top }} role="tooltip">{tip.label}</span>}
            </Sidebar>

            {drawerOpen && <Backdrop onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

            <Main>
                <Topbar>
                    <button type="button" className="menu-toggle" onClick={onMenuButton} aria-label="Abrir menu" title="Recolher/expandir menu">
                        <SidebarSimple size={22} className="desk" />
                        <List size={24} className="mob" />
                    </button>
                    <span className="divider" aria-hidden="true" />
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
                    <AnimatedOutlet className="page" />
                </Content>
            </Main>
        </Shell>
        </MotionConfig>
        </LazyMotion>
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
const SIDEBAR_MINI = '7.6rem'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const Shell = styled.div`
    --sidebar: ${SIDEBAR};
    min-height: 100vh;
    background: var(--white-600);
    &.collapsed { --sidebar: ${SIDEBAR_MINI}; }
`

const Sidebar = styled.aside`
    position: fixed;
    inset: 0 auto 0 0;
    width: var(--sidebar);
    background: var(--gray-500);
    color: var(--gray-100);
    display: flex;
    flex-direction: column;
    padding: 2rem 1.2rem 1.6rem;
    gap: 2rem;
    z-index: 40;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    transition: width .3s ${EASE};

    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 4rem;
        padding: 0 0.8rem;
        .logo { display: block; flex-shrink: 0; }
        img { display: block; }
        .full { height: 3rem; width: auto; }
        .mark { display: none; width: 3.6rem; height: 3.6rem; }
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

    nav { display: flex; flex-direction: column; flex: 1; }
    .group {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 1.4rem 0;
        & + .group { border-top: 0.1rem solid rgba(255, 255, 255, 0.07); }
        &:first-child { padding-top: 0; }
    }
    .group-title {
        font-size: 1.1rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
        color: var(--gray-300);
        padding: 0 1.2rem 0.6rem;
        white-space: nowrap;
        transition: opacity .2s ease;
    }
    nav a, .foot a, .foot button {
        position: relative;
        display: flex;
        align-items: center;
        gap: 1.2rem;
        height: 4.2rem;
        padding: 0 1.4rem;
        border-radius: 0.8rem;
        font-size: 1.45rem;
        font-weight: 500;
        color: var(--gray-100);
        white-space: nowrap;
        transition: background .2s ease, color .2s ease;
        svg { flex-shrink: 0; position: relative; }
        .label { position: relative; transition: opacity .2s ease; overflow: hidden; text-overflow: ellipsis; }
        &:hover { background: rgba(255, 255, 255, 0.06); color: var(--white); }
        &:focus-visible { outline: 0.2rem solid var(--primary-100); outline-offset: -0.2rem; }
    }
    nav a.active {
        color: var(--white);
        font-weight: 600;
        background: transparent;
        svg { color: var(--primary-100); }
    }
    .pill {
        position: absolute;
        inset: 0;
        border-radius: 0.8rem;
        background: linear-gradient(90deg, rgba(105, 60, 234, 0.5), rgba(105, 60, 234, 0.22));
        box-shadow: inset 0 0 0 0.1rem rgba(144, 109, 242, 0.35);
    }

    .foot {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding-top: 1.4rem;
        border-top: 0.1rem solid rgba(255, 255, 255, 0.07);
        .store-link .ext { margin-left: auto; opacity: 0.7; }
        .collapse { width: 100%; text-align: left; color: var(--gray-200); }
        .collapse svg { transition: transform .3s ${EASE}; }
    }

    .tip {
        position: fixed;
        left: calc(${SIDEBAR_MINI} + 0.8rem);
        transform: translateY(-50%);
        z-index: 60;
        padding: 0.6rem 1rem;
        border-radius: 0.6rem;
        background: var(--gray-800);
        color: var(--white);
        font-size: 1.3rem;
        font-weight: 600;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 0.8rem 2.4rem rgba(16, 7, 23, 0.3);
        &::before {
            content: '';
            position: absolute;
            left: -0.4rem;
            top: 50%;
            width: 0.8rem;
            height: 0.8rem;
            background: inherit;
            transform: translateY(-50%) rotate(45deg);
            border-radius: 0.1rem;
        }
    }

    /* ---------- recolhido (só no computador) */
    @media (min-width: 1025px) {
        .collapsed & {
            .brand { padding: 0; justify-content: center; }
            .full, .tag { display: none; }
            .mark { display: block; }
            .group-title { height: 0; padding: 0; opacity: 0; overflow: hidden; }
            .group { padding: 1rem 0; }
            nav a, .foot a, .foot button { justify-content: center; padding: 0; gap: 0; }
            .label, .ext { opacity: 0; width: 0; }
            .ext { display: none; }
            .collapse svg { transform: scaleX(-1); }
        }
    }

    @media (max-width: 1024px) {
        width: ${SIDEBAR};
        transform: translateX(-100%);
        transition: transform .3s ${EASE};
        box-shadow: none;
        &.open { transform: none; box-shadow: 0 0 6rem rgba(0, 0, 0, 0.4); }
        .brand .close { display: inline-flex; }
        .collapse, .tip { display: none !important; }
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
    margin-left: var(--sidebar);
    min-width: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: margin-left .3s ${EASE};
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

    .menu-toggle {
        display: grid;
        place-items: center;
        width: 3.8rem;
        height: 3.8rem;
        margin-left: -0.8rem;
        border-radius: 0.8rem;
        color: var(--gray-300);
        flex-shrink: 0;
        transition: background .2s ease, color .2s ease;
        &:hover { background: var(--white-600); color: var(--gray-800); }
        .mob { display: none; }
    }
    .divider { width: 0.1rem; height: 2rem; background: var(--gray-50); flex-shrink: 0; }
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
        .menu-toggle { margin-left: -0.6rem; .desk { display: none; } .mob { display: block; } }
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

// Conteúdo ocupa toda a largura disponível (de ponta a ponta)
const Content = styled.div`
    flex: 1;
    width: 100%;
    padding: 3.2rem 4rem 4.8rem;
    .page { display: flex; flex-direction: column; gap: 2.4rem; min-width: 0; }
    @media (max-width: 1280px) { padding: 3.2rem; }
    @media (max-width: 600px) { padding: 2rem 1.6rem 4rem; }
`
