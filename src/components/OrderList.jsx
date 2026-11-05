import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProductImage } from './product/ProductImage'
import { StatusBadge } from './ui'
import { formatBRL, formatDate, formatOrderNumber } from '../lib/format'

// Lista de pedidos do cliente (usada no resumo e em "Meus pedidos")
export function OrderList({ orders }) {
    return (
        <List>
            {orders.map((order) => {
                const items = order.order_items || []
                const units = items.reduce((total, item) => total + item.quantity, 0)
                return (
                    <li key={order.id}>
                        <Link to={`/minha-conta/pedidos/${order.id}`}>
                            <div className="thumbs">
                                {items.slice(0, 3).map((item) => (
                                    <div key={item.id} className="thumb">
                                        <ProductImage src={item.product_image} alt={item.product_name} />
                                    </div>
                                ))}
                                {items.length > 3 && <div className="thumb more">+{items.length - 3}</div>}
                            </div>
                            <div className="meta">
                                <strong>Pedido {formatOrderNumber(order.id)}</strong>
                                <span>{formatDate(order.created_at)} · {units} {units === 1 ? 'item' : 'itens'}</span>
                            </div>
                            <StatusBadge status={order.status} />
                            <strong className="total">{formatBRL(order.total)}</strong>
                        </Link>
                    </li>
                )
            })}
        </List>
    )
}

const List = styled.ul`
    display: flex;
    flex-direction: column;
    li + li { border-top: 0.1rem solid var(--white-500); }
    a {
        display: grid;
        grid-template-columns: 15rem minmax(0, 1fr) auto 12rem;
        align-items: center;
        gap: 2rem;
        padding: 1.6rem 0.8rem;
        border-radius: 0.8rem;
        transition: background .2s ease;
        &:hover { background: var(--white-100); }
    }
    .thumbs { display: flex; gap: 0.6rem; }
    .thumb {
        width: 4.4rem;
        height: 4.4rem;
        border-radius: 0.6rem;
        background: var(--white-600);
        padding: 0.3rem;
        overflow: hidden;
        &.more { display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: var(--gray-300); font-weight: 600; }
    }
    .meta {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        strong { font-size: 1.55rem; color: var(--gray-800); }
        span { font-size: 1.35rem; color: var(--gray-200); }
    }
    .total { font-family: var(--font-red-hat); font-size: 1.8rem; color: var(--gray-800); text-align: right; }
    @media (max-width: 700px) {
        a { grid-template-columns: minmax(0, 1fr) auto; gap: 1rem; }
        .thumbs { display: none; }
        .total { grid-column: 2; grid-row: 1; }
    }
`
