import { useState } from 'react'
import styled from 'styled-components'
import { DashHeader } from '../../components/DashboardLayout'
import { OrderList } from '../../components/OrderList'
import { ButtonLink, Card, EmptyState, ErrorState, Loader } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getMyOrders } from '../../services/orders'

const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'open', label: 'Em andamento', match: ['pending', 'paid', 'shipped'] },
    { key: 'delivered', label: 'Entregues', match: ['delivered'] },
    { key: 'canceled', label: 'Cancelados', match: ['canceled'] },
]

export function Orders() {
    useDocumentTitle('Meus pedidos')
    const orders = useAsync(() => getMyOrders(), [])
    const [filter, setFilter] = useState('all')

    const current = filters.find((item) => item.key === filter)
    const list = (orders.data || []).filter((order) => !current.match || current.match.includes(order.status))

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Meus pedidos</h1>
                    <p>Clique em um pedido para ver os detalhes e acompanhar a entrega.</p>
                </div>
            </DashHeader>

            <Card>
                <Tabs role="tablist">
                    {filters.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            role="tab"
                            aria-selected={filter === item.key}
                            className={filter === item.key ? 'active' : ''}
                            onClick={() => setFilter(item.key)}
                        >
                            {item.label}
                        </button>
                    ))}
                </Tabs>

                {orders.loading ? <Loader /> : orders.error ? <ErrorState error={orders.error} onRetry={orders.reload} /> : list.length === 0 ? (
                    <EmptyState
                        title="Nenhum pedido por aqui"
                        action={filter === 'all' && <ButtonLink to="/">Ir às compras</ButtonLink>}
                    />
                ) : (
                    <OrderList orders={list} />
                )}
            </Card>
        </>
    )
}

export const Tabs = styled.div`
    display: flex;
    gap: 0.8rem;
    margin-bottom: 1.6rem;
    overflow-x: auto;
    button {
        padding: 0.8rem 1.6rem;
        border-radius: 5rem;
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--gray-300);
        background: var(--white-600);
        white-space: nowrap;
        &.active { background: var(--primary); color: var(--white); }
    }
`
