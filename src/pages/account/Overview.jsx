import { Link } from 'react-router-dom'
import { Clock, Receipt, ShoppingBagOpen, Truck, Wallet } from '@phosphor-icons/react'
import { CardTitle, DashHeader, Stat, StatGrid } from '../../components/DashboardLayout'
import { OrderList } from '../../components/OrderList'
import { ButtonLink, Card, EmptyState, ErrorState } from '../../components/ui'
import { OrderListSkeleton, StatsSkeleton } from '../../components/skeletons'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { useWishlist } from '../../hooks/useWishlist'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getMyOrders } from '../../services/orders'
import { formatBRL } from '../../lib/format'

export function Overview() {
    useDocumentTitle('Minha conta')
    const { profile } = useAuth()
    const wishlist = useWishlist()
    const orders = useAsync(() => getMyOrders(), [])

    const list = orders.data || []
    const active = list.filter((order) => ['pending', 'paid', 'shipped'].includes(order.status))
    const awaitingPayment = list.filter((order) => order.status === 'pending').length
    const spent = list
        .filter((order) => ['paid', 'shipped', 'delivered'].includes(order.status))
        .reduce((total, order) => total + Number(order.total), 0)

    const firstName = profile?.full_name?.split(' ')[0]

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Olá{firstName ? `, ${firstName}` : ''}!</h1>
                    <p>Acompanhe seus pedidos e gerencie sua conta.</p>
                </div>
            </DashHeader>

            {orders.loading ? <><StatsSkeleton /><Card><OrderListSkeleton /></Card></> : orders.error ? <ErrorState error={orders.error} onRetry={orders.reload} /> : (
                <>
                    <StatGrid>
                        <Stat icon={Receipt} label="Pedidos realizados" value={list.length} />
                        <Stat icon={Truck} label="Em andamento" value={active.length} tone="info" />
                        <Stat
                            icon={Clock}
                            label="Aguardando pagamento"
                            value={awaitingPayment}
                            tone={awaitingPayment ? 'warning' : 'success'}
                        />
                        <Stat icon={Wallet} label="Total em compras" value={formatBRL(spent)} hint={`${wishlist.count} na lista de desejos`} tone="success" />
                    </StatGrid>

                    <Card>
                        <CardTitle>
                            Pedidos recentes
                            {list.length > 0 && <Link to="/minha-conta/pedidos">Ver todos</Link>}
                        </CardTitle>
                        {list.length === 0 ? (
                            <EmptyState
                                icon={ShoppingBagOpen}
                                title="Você ainda não fez pedidos"
                                description="Quando fizer sua primeira compra, ela aparece aqui."
                                action={<ButtonLink to="/">Ir às compras</ButtonLink>}
                            />
                        ) : (
                            <OrderList orders={list.slice(0, 4)} />
                        )}
                    </Card>
                </>
            )}
        </>
    )
}
