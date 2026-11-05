import { Link } from 'react-router-dom'
import { Check, CreditCard, HouseLine, Receipt, Truck, XCircle } from '@phosphor-icons/react'
import styled from 'styled-components'
import { ProductImage } from './product/ProductImage'
import { ORDER_FLOW, PAYMENT_METHODS, formatBRL, formatDateTime, maskCep, maskPhone } from '../lib/format'

const stepDates = { pending: 'created_at', paid: 'paid_at', shipped: 'shipped_at', delivered: 'delivered_at' }
const stepIcons = { pending: Receipt, paid: CreditCard, shipped: Truck, delivered: HouseLine }
const stepLabels = { pending: 'Pedido realizado', paid: 'Pagamento aprovado', shipped: 'Enviado', delivered: 'Entregue' }

export function OrderTimeline({ order }) {
    if (order.status === 'canceled') {
        return (
            <Canceled>
                <strong><XCircle size={22} /> Pedido cancelado</strong>
                <span>{formatDateTime(order.canceled_at)} · os itens voltaram para o estoque.</span>
            </Canceled>
        )
    }

    const currentIndex = ORDER_FLOW.indexOf(order.status)

    return (
        <Timeline>
            {ORDER_FLOW.map((step, index) => {
                const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo'
                const StepIcon = state === 'done' ? Check : stepIcons[step]
                return (
                    <li key={step} className={state}>
                        <span className="dot" aria-hidden="true"><StepIcon size={18} weight={state === 'todo' ? 'duotone' : 'fill'} /></span>
                        <div>
                            <strong>{stepLabels[step]}</strong>
                            <small>{order[stepDates[step]] ? formatDateTime(order[stepDates[step]]) : 'Aguardando'}</small>
                        </div>
                    </li>
                )
            })}
        </Timeline>
    )
}

export function OrderItems({ items, linkProducts = true }) {
    return (
        <Items>
            {items.map((item) => (
                <li key={item.id}>
                    <div className="thumb"><ProductImage src={item.product_image} alt={item.product_name} /></div>
                    <div className="name">
                        {linkProducts && item.product_slug && item.product_id
                            ? <Link to={`/produto/${item.product_slug}`}>{item.product_name}</Link>
                            : <span>{item.product_name}</span>}
                        <small>{item.quantity} × {formatBRL(item.unit_price)}</small>
                    </div>
                    <strong>{formatBRL(item.unit_price * item.quantity)}</strong>
                </li>
            ))}
        </Items>
    )
}

export function OrderTotals({ order }) {
    return (
        <Totals>
            <div><dt>Subtotal</dt><dd>{formatBRL(order.subtotal)}</dd></div>
            <div><dt>Frete</dt><dd>{Number(order.shipping) === 0 ? 'Grátis' : formatBRL(order.shipping)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{formatBRL(order.total)}</dd></div>
        </Totals>
    )
}

export function OrderAddress({ order }) {
    const a = order.shipping_address || {}
    return (
        <Info>
            <p><strong>{order.customer_name}</strong></p>
            <p>{order.customer_email}{order.customer_phone && ` · ${maskPhone(order.customer_phone)}`}</p>
            <p>{a.street}, {a.number}{a.complement && ` - ${a.complement}`}</p>
            <p>{a.district} · {a.city} - {a.state}</p>
            <p>CEP {maskCep(a.cep)}</p>
        </Info>
    )
}

export function OrderPayment({ order }) {
    return (
        <Info>
            <p><strong>{PAYMENT_METHODS[order.payment_method]}</strong></p>
            <p>{order.paid_at ? `Aprovado em ${formatDateTime(order.paid_at)}` : 'Pagamento pendente'}</p>
        </Info>
    )
}

const Timeline = styled.ol`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.2rem;
    li {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        &:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 1.6rem;
            left: 3.6rem;
            right: -0.8rem;
            height: 0.2rem;
            background: var(--gray-50);
        }
        &.done:not(:last-child)::after { background: var(--primary); }
    }
    .dot {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        font-weight: 700;
        background: var(--white-600);
        color: var(--gray-200);
        position: relative;
        z-index: 1;
    }
    .done .dot, .current .dot { background: var(--primary); color: var(--white); }
    .current .dot { box-shadow: 0 0 0 0.4rem var(--primary-100); }
    strong { display: block; font-size: 1.45rem; color: var(--gray-800); }
    .todo strong { color: var(--gray-200); }
    small { font-size: 1.25rem; color: var(--gray-200); }
    @media (max-width: 640px) {
        grid-template-columns: 1fr;
        li { flex-direction: row; align-items: center; }
        li:not(:last-child)::after { display: none; }
    }
`

const Canceled = styled.div`
    background: var(--danger-50);
    color: var(--danger);
    padding: 1.6rem 2rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    strong { font-size: 1.6rem; display: inline-flex; align-items: center; gap: 0.8rem; }
    span { font-size: 1.4rem; }
`

const Items = styled.ul`
    display: flex;
    flex-direction: column;
    li {
        display: grid;
        grid-template-columns: 6.4rem minmax(0, 1fr) auto;
        gap: 1.6rem;
        align-items: center;
        padding: 1.4rem 0;
        &:not(:last-child) { border-bottom: 0.1rem solid var(--white-500); }
    }
    .thumb { width: 6.4rem; height: 6.4rem; border-radius: 0.8rem; background: var(--white-600); padding: 0.4rem; overflow: hidden; }
    .name {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        a, span { font-size: 1.5rem; color: var(--gray-700); }
        a:hover { color: var(--primary); }
        small { font-size: 1.35rem; color: var(--gray-200); }
    }
    strong { font-size: 1.6rem; color: var(--gray-800); white-space: nowrap; }
`

const Totals = styled.dl`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.6rem;
    padding-top: 1.6rem;
    border-top: 0.1rem solid var(--gray-50);
    div { display: flex; justify-content: space-between; font-size: 1.5rem; color: var(--gray-400); }
    .total dt, .total dd { font-family: var(--font-red-hat); font-size: 2rem; font-weight: 700; color: var(--gray-800); }
`

const Info = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    p { font-size: 1.5rem; color: var(--gray-400); }
    strong { color: var(--gray-800); }
`
