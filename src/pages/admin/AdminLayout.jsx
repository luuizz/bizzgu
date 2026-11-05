import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { useAuth } from '../../hooks/useAuth'

const links = [
    { to: '/admin', label: 'Painel', end: true },
    { to: '/admin/pedidos', label: 'Pedidos' },
    { to: '/admin/produtos', label: 'Produtos' },
    { to: '/admin/categorias', label: 'Categorias' },
    { to: '/admin/clientes', label: 'Clientes' },
]

export function AdminLayout() {
    const { profile } = useAuth()
    return (
        <DashboardLayout
            variant="dark"
            title="Administração"
            subtitle={profile?.full_name || profile?.email}
            links={links}
            footer={<Link to="/minha-conta">← Voltar para minha conta</Link>}
        />
    )
}
