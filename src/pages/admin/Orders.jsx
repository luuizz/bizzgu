import { useEffect, useState } from 'react'
import { Receipt } from '@phosphor-icons/react'
import { Link, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { DashHeader } from '../../components/DashboardLayout'
import { Button, Card, EmptyState, ErrorState, Input, Loader, StatusBadge, Table, TableScroll } from '../../components/ui'
import { Tabs } from '../account/Orders'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { listOrders } from '../../services/admin'
import { ORDER_STATUS, PAYMENT_METHODS, formatBRL, formatDateTime, formatOrderNumber } from '../../lib/format'

const PAGE_SIZE = 15

export function Orders() {
    useDocumentTitle('Pedidos · Admin')
    const [params, setParams] = useSearchParams()
    const status = params.get('status') || ''
    const page = Number(params.get('pagina') || 1)
    const search = params.get('q') || ''
    const [term, setTerm] = useState(search)

    useEffect(() => setTerm(search), [search])

    const orders = useAsync(() => listOrders({ status, search, page, pageSize: PAGE_SIZE }), [status, search, page])
    const rows = orders.data?.data || []
    const total = orders.data?.count || 0
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const update = (changes) => {
        const next = new URLSearchParams(params)
        Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
        if (!('pagina' in changes)) next.delete('pagina')
        setParams(next)
    }

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Pedidos</h1>
                    <p>{orders.loading ? ' ' : `${total} ${total === 1 ? 'pedido' : 'pedidos'}`}</p>
                </div>
            </DashHeader>

            <Card>
                <Toolbar onSubmit={(event) => { event.preventDefault(); update({ q: term.trim() }) }}>
                    <Tabs role="tablist" style={{ marginBottom: 0 }}>
                        <button type="button" className={!status ? 'active' : ''} onClick={() => update({ status: '' })}>Todos</button>
                        {Object.entries(ORDER_STATUS).map(([key, info]) => (
                            <button type="button" key={key} className={status === key ? 'active' : ''} onClick={() => update({ status: key })}>
                                {info.label}
                            </button>
                        ))}
                    </Tabs>
                    <Input
                        type="search"
                        placeholder="Buscar por nº, nome ou e-mail"
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        aria-label="Buscar pedidos"
                    />
                </Toolbar>

                {orders.loading ? <Loader /> : orders.error ? <ErrorState error={orders.error} onRetry={orders.reload} /> : rows.length === 0 ? (
                    <EmptyState icon={Receipt} title="Nenhum pedido encontrado" />
                ) : (
                    <>
                        <TableScroll>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Pedido</th><th>Cliente</th><th>Data</th><th>Pagamento</th><th>Status</th><th className="num">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((order) => (
                                        <tr key={order.id}>
                                            <td><Link to={`/admin/pedidos/${order.id}`} className="link">{formatOrderNumber(order.id)}</Link></td>
                                            <td>
                                                <div className="stack">
                                                    <span>{order.customer_name}</span>
                                                    <small>{order.customer_email}</small>
                                                </div>
                                            </td>
                                            <td>{formatDateTime(order.created_at)}</td>
                                            <td>{PAYMENT_METHODS[order.payment_method]}</td>
                                            <td><StatusBadge status={order.status} /></td>
                                            <td className="num"><strong>{formatBRL(order.total)}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </TableScroll>
                        {pages > 1 && (
                            <Pager>
                                <Button $variant="ghost" $size="sm" disabled={page <= 1} onClick={() => update({ pagina: String(page - 1) })}>Anterior</Button>
                                <span>Página {page} de {pages}</span>
                                <Button $variant="ghost" $size="sm" disabled={page >= pages} onClick={() => update({ pagina: String(page + 1) })}>Próxima</Button>
                            </Pager>
                        )}
                    </>
                )}
            </Card>
        </>
    )
}

export const Toolbar = styled.form`
    display: flex;
    gap: 1.6rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    > input { max-width: 30rem; height: 4.2rem; }
    @media (max-width: 700px) { > input { max-width: none; } }
`

export const Pager = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.6rem;
    margin-top: 2rem;
    span { font-size: 1.4rem; color: var(--gray-300); }
`
