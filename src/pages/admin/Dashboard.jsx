import { Link } from 'react-router-dom'
import { ArrowRight, CurrencyCircleDollar, Package, Plus, Receipt, Tag, UsersThree } from '@phosphor-icons/react'
import styled from 'styled-components'
import { CardTitle, DashHeader, Stat, StatGrid } from '../../components/DashboardLayout'
import { SalesChart } from '../../components/SalesChart'
import { ButtonLink, Card, ErrorState, Loader, StatusBadge, Table, TableScroll } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getDashboard, listOrders } from '../../services/admin'
import { formatBRL, formatDateTime, formatOrderNumber } from '../../lib/format'

export function Dashboard() {
    useDocumentTitle('Painel administrativo')
    const stats = useAsync(() => getDashboard(), [])
    const recent = useAsync(() => listOrders({ pageSize: 6 }), [])

    if (stats.loading) return <Loader />
    if (stats.error) return <ErrorState error={stats.error} onRetry={stats.reload} />

    const s = stats.data

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Painel</h1>
                    <p>Visão geral da loja.</p>
                </div>
                <div className="actions">
                    <ButtonLink to="/admin/produtos/novo"><Plus size={20} weight="bold" /> Novo produto</ButtonLink>
                </div>
            </DashHeader>

            <StatGrid>
                <Stat icon={CurrencyCircleDollar} label="Faturamento" value={formatBRL(s.revenue)} hint="Pedidos pagos, enviados e entregues" tone="success" />
                <Stat icon={Tag} label="Ticket médio" value={formatBRL(s.average_ticket)} />
                <Stat icon={Receipt} label="Pedidos" value={s.orders_count} hint={`${s.orders_pending} aguardando pagamento`} tone="info" />
                <Stat icon={UsersThree} label="Clientes" value={s.customers_count} hint={`${s.products_active} produtos ativos`} />
            </StatGrid>

            {s.orders_to_ship > 0 && (
                <ShipBanner to="/admin/pedidos?status=paid">
                    <Package size={28} className="ico" />
                    <strong>{s.orders_to_ship} {s.orders_to_ship === 1 ? 'pedido pago aguarda' : 'pedidos pagos aguardam'} envio</strong>
                    <span>Ver pedidos <ArrowRight size={18} weight="bold" /></span>
                </ShipBanner>
            )}

            <Card>
                <CardTitle>Vendas dos últimos 30 dias</CardTitle>
                <SalesChart data={s.sales_by_day} />
            </Card>

            <Columns>
                <Card>
                    <CardTitle>Mais vendidos</CardTitle>
                    {s.top_products.length === 0 ? <Muted>Nenhuma venda ainda.</Muted> : (
                        <Ranking>
                            {s.top_products.map((product, index) => (
                                <li key={product.name}>
                                    <span className="pos">{index + 1}</span>
                                    <span className="name">{product.name}</span>
                                    <span className="qty">{product.quantity} un.</span>
                                    <strong>{formatBRL(product.revenue)}</strong>
                                </li>
                            ))}
                        </Ranking>
                    )}
                </Card>
                <Card>
                    <CardTitle>
                        Estoque baixo
                        <Link to="/admin/produtos">Gerenciar</Link>
                    </CardTitle>
                    {s.low_stock.length === 0 ? <Muted>Todos os produtos com estoque saudável.</Muted> : (
                        <Ranking>
                            {s.low_stock.map((product) => (
                                <li key={product.id}>
                                    <Link className="name" to={`/admin/produtos/${product.id}`}>{product.name}</Link>
                                    <strong className={product.stock === 0 ? 'out' : 'low'}>
                                        {product.stock === 0 ? 'Esgotado' : `${product.stock} un.`}
                                    </strong>
                                </li>
                            ))}
                        </Ranking>
                    )}
                </Card>
            </Columns>

            <Card>
                <CardTitle>
                    Pedidos recentes
                    <Link to="/admin/pedidos">Ver todos</Link>
                </CardTitle>
                {recent.loading ? <Loader /> : recent.data?.data.length === 0 ? <Muted>Nenhum pedido ainda.</Muted> : (
                    <TableScroll>
                        <Table>
                            <thead>
                                <tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Status</th><th className="num">Total</th></tr>
                            </thead>
                            <tbody>
                                {(recent.data?.data || []).map((order) => (
                                    <tr key={order.id}>
                                        <td><Link to={`/admin/pedidos/${order.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatOrderNumber(order.id)}</Link></td>
                                        <td>{order.customer_name}</td>
                                        <td>{formatDateTime(order.created_at)}</td>
                                        <td><StatusBadge status={order.status} /></td>
                                        <td className="num">{formatBRL(order.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableScroll>
                )}
            </Card>
        </>
    )
}

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.4rem;
    @media (max-width: 1000px) { grid-template-columns: 1fr; }
`

const Ranking = styled.ol`
    display: flex;
    flex-direction: column;
    li {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        padding: 1.2rem 0;
        font-size: 1.45rem;
        &:not(:last-child) { border-bottom: 0.1rem solid var(--white-500); }
    }
    .pos {
        width: 2.6rem;
        height: 2.6rem;
        border-radius: 50%;
        background: var(--primary-50);
        color: var(--primary);
        font-weight: 700;
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .name { flex: 1; color: var(--gray-400); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    a.name:hover { color: var(--primary); }
    .qty { color: var(--gray-200); white-space: nowrap; }
    strong { color: var(--gray-800); white-space: nowrap; }
    .low { color: var(--warning); }
    .out { color: var(--danger); }
`

const Muted = styled.p`
    font-size: 1.5rem;
    color: var(--gray-200);
`

const ShipBanner = styled(Link)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.6rem;
    background: var(--info-50);
    color: var(--info);
    border-radius: 1.2rem;
    padding: 1.6rem 2rem;
    font-size: 1.5rem;
    .ico { flex-shrink: 0; }
    strong { flex: 1; }
    span { font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 0.4rem; }
`
