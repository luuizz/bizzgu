import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../hooks/useAuth'
import iconAccount from '/src/assets/icon-account.svg'

export function AccountMenu() {
    const { user, profile, isAdmin, signOut } = useAuth()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

    // Fecha ao trocar de página, clicar fora ou apertar Esc
    useEffect(() => setOpen(false), [location.pathname])
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

    if (!user) {
        return (
            <Link to="/login" state={{ from: location }} title="Entrar">
                <img src={iconAccount} alt="Entrar na conta" />
            </Link>
        )
    }

    const firstName = (profile?.full_name || user.email).split(' ')[0]

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <Wrapper ref={ref}>
            <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" title="Minha conta">
                <img src={iconAccount} alt="" />
                <span className="greeting">Olá, {firstName}</span>
            </button>
            {open && (
                <div className="menu" role="menu">
                    <div className="who">
                        <strong>{profile?.full_name || 'Minha conta'}</strong>
                        <span>{user.email}</span>
                    </div>
                    <Link role="menuitem" to="/minha-conta">Minha conta</Link>
                    <Link role="menuitem" to="/minha-conta/pedidos">Meus pedidos</Link>
                    <Link role="menuitem" to="/lista-desejos">Lista de desejos</Link>
                    {isAdmin && <Link role="menuitem" to="/admin" className="admin">Painel administrativo</Link>}
                    <button role="menuitem" type="button" onClick={handleSignOut}>Sair</button>
                </div>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
    > button {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        img { width: 2.4rem; }
        .greeting {
            font-family: var(--font-red-hat);
            font-weight: 600;
            font-size: 1.4rem;
            color: var(--gray-400);
            max-width: 12rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            @media (max-width: 900px) { display: none; }
        }
    }
    .menu {
        position: absolute;
        right: 0;
        top: calc(100% + 1.2rem);
        min-width: 24rem;
        background: var(--white);
        border-radius: 1.2rem;
        box-shadow: 0 1.2rem 4rem rgba(16, 7, 23, 0.16);
        padding: 0.8rem;
        z-index: 30;
        display: flex;
        flex-direction: column;
        a, button {
            text-align: left;
            padding: 1rem 1.2rem;
            border-radius: 0.8rem;
            font-size: 1.45rem;
            color: var(--gray-400);
            &:hover { background: var(--white-600); color: var(--primary); }
        }
        .admin { color: var(--primary); font-weight: 600; }
        button { border-top: 0.1rem solid var(--white-500); border-radius: 0 0 0.8rem 0.8rem; margin-top: 0.4rem; }
    }
    .who {
        padding: 1rem 1.2rem 1.2rem;
        border-bottom: 0.1rem solid var(--white-500);
        margin-bottom: 0.4rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        strong { font-size: 1.5rem; color: var(--gray-800); }
        span { font-size: 1.3rem; color: var(--gray-200); overflow: hidden; text-overflow: ellipsis; }
    }
`
