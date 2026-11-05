import { useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { OrderAddress, OrderItems, OrderPayment, OrderTimeline, OrderTotals } from '../../components/OrderParts'
import { Alert, Button, Card, ErrorState, Loader, Spinner, StatusBadge } from '../../components/ui'
import { Columns } from '../account/OrderDetail'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getOrder } from '../../services/orders'
import { updateOrderStatus } from '../../services/admin'
import { ORDER_STATUS, formatDateTime, formatOrderNumber } from '../../lib/format'
import { NotFound } from '../NotFound'

// Próximos passos possíveis a partir de cada status
const nextActions = {
    pending: [{ status: 'paid', label: 'Marcar como pago' }],
    paid: [{ status: 'shipped', label: 'Marcar como enviado' }],
    shipped: [{ status: 'delivered', label: 'Marcar como entregue' }],
    delivered: [],
    canceled: [],
}

export function OrderDetail() {
    const { id } = useParams()
    const toast = useToast()
    const order = useAsync(() => getOrder(Number(id)), [id])
    const [busy, setBusy] = useState('')

    useDocumentTitle(`Pedido ${formatOrderNumber(id)} · Admin`)

    if (order.loading && !order.data) return <Loader />
    if (order.error) return <ErrorState error={order.error} onRetry={order.reload} />
    if (!order.data) return <NotFound />

    const data = order.data

    const changeStatus = async (status) => {
        if (status === 'canceled' && !window.confirm('Cancelar este pedido? Os itens voltam para o estoque.')) return
        setBusy(status)
        try {
            await updateOrderStatus(data.id, status)
            toast.show(`Status alterado para "${ORDER_STATUS[status].label}".`, 'success')
            await order.reload()
        } catch (error) {
            toast.show(error.message, 'danger')
        } finally {
            setBusy('')
        }
    }

    const actions = nextActions[data.status]

    return (
        <>
            <DashHeader>
                <div>
                    <Link to="/admin/pedidos" className="back"><ArrowLeft size={18} /> Pedidos</Link>
                    <h1>Pedido {formatOrderNumber(data.id)}</h1>
                    <p>Realizado em {formatDateTime(data.created_at)}</p>
                </div>
                <StatusBadge status={data.status} />
            </DashHeader>

            <Card>
                <CardTitle>Andamento</CardTitle>
                <OrderTimeline order={data} />
                {data.status !== 'canceled' && (
                    <Actions>
                        {actions.map((action) => (
                            <Button key={action.status} onClick={() => changeStatus(action.status)} disabled={!!busy}>
                                {busy === action.status ? <><Spinner /> Salvando...</> : action.label}
                            </Button>
                        ))}
                        {data.status !== 'delivered' && (
                            <Button $variant="danger" onClick={() => changeStatus('canceled')} disabled={!!busy}>
                                {busy === 'canceled' ? 'Cancelando...' : 'Cancelar pedido'}
                            </Button>
                        )}
                        {data.status === 'delivered' && <Alert $tone="success">Pedido concluído.</Alert>}
                    </Actions>
                )}
            </Card>

            <Columns>
                <Card>
                    <CardTitle>Itens</CardTitle>
                    <OrderItems items={data.order_items} />
                    <OrderTotals order={data} />
                </Card>
                <div className="side">
                    <Card>
                        <CardTitle>Cliente e entrega</CardTitle>
                        <OrderAddress order={data} />
                    </Card>
                    <Card>
                        <CardTitle>Pagamento</CardTitle>
                        <OrderPayment order={data} />
                    </Card>
                </div>
            </Columns>
        </>
    )
}

const Actions = styled.div`
    display: flex;
    gap: 1.2rem;
    flex-wrap: wrap;
    margin-top: 2.4rem;
    padding-top: 2.4rem;
    border-top: 0.1rem solid var(--white-500);
`
