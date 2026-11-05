import { Link, useNavigate } from 'react-router-dom'
import { Gauge, Heart, IdentificationCard, Receipt, SignOut, SquaresFour } from '@phosphor-icons/react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { useAuth } from '../../hooks/useAuth'

const links = [
    { to: '/minha-conta', label: 'Resumo', icon: SquaresFour, end: true },
    { to: '/minha-conta/pedidos', label: 'Meus pedidos', icon: Receipt },
    { to: '/lista-desejos', label: 'Lista de desejos', icon: Heart },
    { to: '/minha-conta/dados', label: 'Meus dados', icon: IdentificationCard },
]

export function AccountLayout() {
    const { user, profile, isAdmin, signOut } = useAuth()
    const navigate = useNavigate()

    return (
        <DashboardLayout
            title={profile?.full_name || 'Minha conta'}
            subtitle={user.email}
            links={links}
            footer={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' }}>
                    {isAdmin && <Link to="/admin"><Gauge size={20} /> Painel administrativo</Link>}
                    <button type="button" onClick={async () => { await signOut(); navigate('/') }}><SignOut size={20} /> Sair da conta</button>
                </div>
            }
        />
    )
}
