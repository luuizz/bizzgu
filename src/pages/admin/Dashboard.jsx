import { Link } from 'react-router-dom'
import { ArrowRight, Article, CurrencyCircleDollar, Eye, NotePencil, Package, PencilSimple, Plus, Receipt, Tag, UsersThree } from '@phosphor-icons/react'
import styled from 'styled-components'
import { CardTitle, DashHeader, Stat, StatGrid } from '../../components/DashboardLayout'
import { SalesChart } from '../../components/SalesChart'
import { Badge, ButtonLink, Card, ErrorState, Loader, StatusBadge, Table, TableScroll } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getDashboard, listOrders, listPosts } from '../../services/admin'
import { formatBRL, formatDate, formatDateTime, formatOrderNumber, imageUrl } from '../../lib/format'
import { postStatus } from '../../lib/posts'

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
                    <ButtonLink to="/admin/blog/novo" $variant="ghost"><NotePencil size={20} /> Novo post</ButtonLink>
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

            <Columns $wide>
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
            <BlogOverview />
            </Columns>
        </>
    )
}

// Resumo do blog: números por situação e os últimos artigos publicados/agendados
function BlogOverview() {
    const posts = useAsync(() => listPosts(), [])
    const all = posts.data || []
    const counts = all.reduce((acc, post) => {
        const label = postStatus(post).label
        acc[label] = (acc[label] || 0) + 1
        return acc
    }, {})
    const latest = all
        .filter((post) => post.status === 'published')
        .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
        .slice(0, 5)

    return (
        <Card>
            <CardTitle>
                Blog
                <Link to="/admin/blog">Ver todos</Link>
            </CardTitle>
            {posts.loading ? <Loader /> : posts.error ? <ErrorState error={posts.error} onRetry={posts.reload} /> : (
                <>
                    <BlogCounts>
                        <Link to="/admin/blog?status=published"><strong>{counts.Publicado || 0}</strong> publicados</Link>
                        <Link to="/admin/blog?status=published"><strong>{counts.Agendado || 0}</strong> agendados</Link>
                        <Link to="/admin/blog?status=draft"><strong>{counts.Rascunho || 0}</strong> rascunhos</Link>
                    </BlogCounts>
                    {latest.length === 0 ? (
                        <BlogEmpty>
                            <Article size={32} />
                            <p>Nenhum artigo publicado ainda.</p>
                            <ButtonLink to="/admin/blog/novo" $size="sm">Escrever o primeiro</ButtonLink>
                        </BlogEmpty>
                    ) : (
                        <BlogList>
                            {latest.map((post) => {
                                const status = postStatus(post)
                                return (
                                    <li key={post.id}>
                                        <Link to={`/admin/blog/${post.id}`} className="post">
                                            <span className="thumb">{post.cover_image ? <img src={imageUrl(post.cover_image)} alt="" loading="lazy" /> : <Article size={20} />}</span>
                                            <span className="info">
                                                <strong>{post.title}</strong>
                                                <small>{formatDate(post.published_at)}{status.label === 'Agendado' && <Badge $tone="info">Agendado</Badge>}</small>
                                            </span>
                                        </Link>
                                        <span className="row-actions">
                                            <a href={`${import.meta.env.BASE_URL}blog/${post.slug}`} target="_blank" rel="noreferrer" title="Ver no site" aria-label={`Ver ${post.title} no site`}><Eye size={18} /></a>
                                            <Link to={`/admin/blog/${post.id}`} title="Editar" aria-label={`Editar ${post.title}`}><PencilSimple size={18} /></Link>
                                        </span>
                                    </li>
                                )
                            })}
                        </BlogList>
                    )}
                </>
            )}
        </Card>
    )
}

const Columns = styled.div`
    display: grid;
    grid-template-columns: ${({ $wide }) => ($wide ? 'minmax(0, 1.7fr) minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))')};
    gap: 2.4rem;
    align-items: start;
    @media (max-width: ${({ $wide }) => ($wide ? '1200px' : '1000px')}) { grid-template-columns: 1fr; }
`

const BlogCounts = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    margin-bottom: 1.6rem;
    a {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 1.2rem 1.4rem;
        border-radius: 1rem;
        background: var(--white-600);
        font-size: 1.3rem;
        color: var(--gray-300);
        transition: background .2s ease, color .2s ease;
        &:hover { background: var(--primary-50); color: var(--primary); }
    }
    strong { font-family: var(--font-red-hat); font-size: 2.2rem; color: var(--gray-800); line-height: 1.1; }
`

const BlogList = styled.ul`
    display: flex;
    flex-direction: column;
    li {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0;
        &:not(:last-child) { border-bottom: 0.1rem solid var(--white-500); }
    }
    .post { display: flex; align-items: center; gap: 1.2rem; flex: 1; min-width: 0; }
    .post:hover strong { color: var(--primary); }
    .thumb {
        width: 7.2rem;
        aspect-ratio: 1200 / 630;
        border-radius: 0.6rem;
        overflow: hidden;
        background: var(--primary-50);
        color: var(--primary);
        display: grid;
        place-items: center;
        flex-shrink: 0;
        img { width: 100%; height: 100%; object-fit: cover; }
    }
    .info { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
    strong { font-size: 1.45rem; font-weight: 600; color: var(--gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color .2s ease; }
    small { display: flex; align-items: center; gap: 0.8rem; font-size: 1.25rem; color: var(--gray-200); }
    small span { height: 2rem; font-size: 1.1rem; }
    .row-actions { display: flex; gap: 0.2rem; }
    .row-actions a {
        display: grid;
        place-items: center;
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 0.8rem;
        color: var(--gray-200);
        &:hover { background: var(--primary-50); color: var(--primary); }
    }
`

const BlogEmpty = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2.4rem 0 1rem;
    color: var(--primary);
    p { font-size: 1.45rem; color: var(--gray-300); }
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
