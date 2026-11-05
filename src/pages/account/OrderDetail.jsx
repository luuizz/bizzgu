import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { OrderAddress, OrderItems, OrderPayment, OrderTimeline, OrderTotals } from '../../components/OrderParts'
import { Alert, Button, Card, ErrorState, Loader, Spinner, StatusBadge } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { cancelOrder, getOrder, payOrder } from '../../services/orders'
import { PAYMENT_METHODS, formatBRL, formatDateTime, formatOrderNumber } from '../../lib/format'
import { NotFound } from '../NotFound'

export function OrderDetail() {
    const { id } = useParams()
    const [params] = useSearchParams()
    const isNew = params.get('novo') === '1'
    const toast = useToast()
    const order = useAsync(() => getOrder(Number(id)), [id])
    const [busy, setBusy] = useState('')

    useDocumentTitle(`Pedido ${formatOrderNumber(id)}`)

    if (order.loading && !order.data) return <Loader />
    if (order.error) return <ErrorState error={order.error} onRetry={order.reload} />
    if (!order.data) return <NotFound />

    const data = order.data

    const run = async (action, fn, successMessage) => {
        setBusy(action)
        try {
            await fn(data.id)
            toast.show(successMessage, 'success')
            await order.reload()
        } catch (error) {
            toast.show(error.message, 'danger')
        } finally {
            setBusy('')
        }
    }

    const handleCancel = () => {
        if (window.confirm('Cancelar este pedido? Os itens voltam para o estoque.')) {
            run('cancel', cancelOrder, 'Pedido cancelado.')
        }
    }

    return (
        <>
            <DashHeader>
                <div>
                    <Link to="/minha-conta/pedidos" className="back">← Meus pedidos</Link>
                    <h1>Pedido {formatOrderNumber(data.id)}</h1>
                    <p>Realizado em {formatDateTime(data.created_at)}</p>
                </div>
                <StatusBadge status={data.status} />
            </DashHeader>

            {isNew && data.status === 'pending' && (
                <Alert $tone="success">
                    <strong>Pedido recebido!</strong> Simule o pagamento abaixo para seguir com o pedido.
                </Alert>
            )}

            {data.status === 'pending' && (
                <PayCard>
                    <div>
                        <h2>Pagamento pendente</h2>
                        <p>
                            {PAYMENT_METHODS[data.payment_method]} · {formatBRL(data.total)}.{' '}
                            Como esta é uma loja de demonstração, nenhum valor é cobrado.
                        </p>
                    </div>
                    <div className="actions">
                        <Button onClick={() => run('pay', payOrder, 'Pagamento aprovado!')} disabled={!!busy}>
                            {busy === 'pay' ? <><Spinner /> Processando...</> : 'Simular pagamento'}
                        </Button>
                        <Button $variant="ghost" onClick={handleCancel} disabled={!!busy}>
                            {busy === 'cancel' ? 'Cancelando...' : 'Cancelar pedido'}
                        </Button>
                    </div>
                </PayCard>
            )}

            <Card>
                <CardTitle>Acompanhamento</CardTitle>
                <OrderTimeline order={data} />
            </Card>

            <Columns>
                <Card>
                    <CardTitle>Itens</CardTitle>
                    <OrderItems items={data.order_items} />
                    <OrderTotals order={data} />
                </Card>
                <div className="side">
                    <Card>
                        <CardTitle>Entrega</CardTitle>
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

export const Columns = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 32rem;
    gap: 2.4rem;
    align-items: start;
    .side { display: flex; flex-direction: column; gap: 2.4rem; }
    @media (max-width: 1100px) { grid-template-columns: 1fr; }
`

const PayCard = styled.div`
    background: linear-gradient(135deg, var(--primary), var(--violet-800));
    color: var(--white);
    border-radius: 1.6rem;
    padding: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2.4rem;
    flex-wrap: wrap;
    h2 { color: var(--white); font-size: 2rem; margin-bottom: 0.6rem; }
    p { font-size: 1.45rem; opacity: 0.9; max-width: 52rem; }
    .actions { display: flex; gap: 1.2rem; flex-wrap: wrap; }
    button:first-child { background: var(--white); color: var(--primary); border-color: var(--white); }
    button:first-child:hover:not(:disabled) { background: var(--primary-50); }
    button:last-child { color: var(--white); border-color: rgba(255, 255, 255, 0.5); }
    button:last-child:hover:not(:disabled) { border-color: var(--white); color: var(--white); }
`
