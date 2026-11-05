import { Link, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { useAuth } from '../../hooks/useAuth'

const links = [
    { to: '/minha-conta', label: 'Resumo', end: true },
    { to: '/minha-conta/pedidos', label: 'Meus pedidos' },
    { to: '/lista-desejos', label: 'Lista de desejos' },
    { to: '/minha-conta/dados', label: 'Meus dados' },
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
                    {isAdmin && <Link to="/admin">Painel administrativo →</Link>}
                    <button type="button" onClick={async () => { await signOut(); navigate('/') }}>Sair da conta</button>
                </div>
            }
        />
    )
}
