import styled from 'styled-components'
import { FREE_SHIPPING_FROM, formatBRL } from '../lib/format'

export function OrderSummary({ subtotal, shipping, total, count, children, showFreeShippingHint = true }) {
    const missing = FREE_SHIPPING_FROM - subtotal

    return (
        <Summary>
            <h2>Resumo do pedido</h2>
            <dl>
                <div>
                    <dt>Subtotal{count !== undefined && ` (${count} ${count === 1 ? 'item' : 'itens'})`}</dt>
                    <dd>{formatBRL(subtotal)}</dd>
                </div>
                <div>
                    <dt>Frete</dt>
                    <dd className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'Grátis' : formatBRL(shipping)}</dd>
                </div>
                <div className="total">
                    <dt>Total</dt>
                    <dd>{formatBRL(total)}</dd>
                </div>
            </dl>
            {showFreeShippingHint && missing > 0 && (
                <p className="hint">Faltam <strong>{formatBRL(missing)}</strong> para ganhar frete grátis.</p>
            )}
            {children}
        </Summary>
    )
}

const Summary = styled.aside`
    background: var(--white);
    border-radius: 1.6rem;
    padding: 2.4rem;
    position: sticky;
    top: 2.4rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    h2 { font-size: 2rem; }
    dl { display: flex; flex-direction: column; gap: 1.2rem; }
    dl div { display: flex; justify-content: space-between; font-size: 1.5rem; color: var(--gray-400); }
    dd.free { color: var(--success); font-weight: 600; }
    .total {
        border-top: 0.1rem solid var(--gray-50);
        padding-top: 1.6rem;
        margin-top: 0.4rem;
        dt, dd { font-family: var(--font-red-hat); font-size: 2rem; font-weight: 700; color: var(--gray-800); }
    }
    .hint {
        font-size: 1.35rem;
        color: var(--primary);
        background: var(--primary-50);
        padding: 1rem 1.2rem;
        border-radius: 0.8rem;
    }
`
