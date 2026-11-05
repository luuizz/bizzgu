import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Page } from '../components/layout'
import { OrderSummary } from '../components/OrderSummary'
import { ProductImage } from '../components/product/ProductImage'
import { QuantityStepper } from '../components/product/QuantityStepper'
import { Alert, Button, ButtonLink, EmptyState, PageTitle } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getProducts } from '../services/catalog'
import { formatBRL } from '../lib/format'
import NoItems from '/src/assets/cart-noitems.png'

export function Chart() {
    useDocumentTitle('Carrinho')
    const cart = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [notices, setNotices] = useState([])
    const synced = useRef(false)

    // Confere preço e estoque com o banco uma vez ao abrir o carrinho
    useEffect(() => {
        if (synced.current || cart.items.length === 0) return
        synced.current = true
        getProducts({ ids: cart.items.map((item) => item.id) })
            .then((products) => setNotices(cart.syncWithCatalog(products)))
            .catch(() => {})
    }, [cart])

    if (cart.items.length === 0) {
        return (
            <Page>
                <div className="container">
                    <EmptyState
                        image={NoItems}
                        title="Seu carrinho está vazio"
                        description="Explore nossos departamentos e encontre algo especial para você."
                        action={<ButtonLink to="/" $size="lg">Começar a comprar</ButtonLink>}
                    />
                </div>
            </Page>
        )
    }

    const goToCheckout = () => navigate(user ? '/checkout' : '/login', { state: { from: { pathname: '/checkout' } } })

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <PageTitle>Carrinho de compras</PageTitle>
                </div>

                {notices.length > 0 && (
                    <Alert $tone="warning" style={{ marginBottom: '2.4rem' }}>
                        {notices.map((notice) => <div key={notice}>{notice}</div>)}
                    </Alert>
                )}

                <Layout>
                    <div className="items">
                        <ul>
                            {cart.items.map((item) => (
                                <li key={item.id}>
                                    <Link to={`/produto/${item.slug}`} className="thumb">
                                        <ProductImage src={item.image} alt={item.name} />
                                    </Link>
                                    <div className="details">
                                        <Link to={`/produto/${item.slug}`} className="name">{item.name}</Link>
                                        <span className="unit">{formatBRL(item.price)} cada</span>
                                        <div className="actions">
                                            <QuantityStepper
                                                size="sm"
                                                value={item.quantity}
                                                max={item.stock}
                                                onChange={(value) => cart.updateQuantity(item.id, value)}
                                            />
                                            <button type="button" className="remove" onClick={() => cart.removeItem(item.id)}>
                                                Remover
                                            </button>
                                        </div>
                                        {item.quantity >= item.stock && <small>Quantidade máxima em estoque</small>}
                                    </div>
                                    <strong className="line-total">{formatBRL(item.price * item.quantity)}</strong>
                                </li>
                            ))}
                        </ul>
                        <div className="footer">
                            <Link to="/">← Continuar comprando</Link>
                            <button type="button" onClick={cart.clear}>Esvaziar carrinho</button>
                        </div>
                    </div>

                    <OrderSummary subtotal={cart.subtotal} shipping={cart.shipping} total={cart.total} count={cart.count}>
                        <Button $size="lg" $block onClick={goToCheckout}>
                            {user ? 'Finalizar compra' : 'Entrar e finalizar compra'}
                        </Button>
                    </OrderSummary>
                </Layout>
            </div>
        </Page>
    )
}

export const Layout = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 36rem;
    gap: 3.2rem;
    align-items: start;
    .items {
        background: var(--white);
        border-radius: 1.6rem;
        padding: 0.8rem 2.4rem;
    }
    li {
        display: grid;
        grid-template-columns: 9.6rem minmax(0, 1fr) auto;
        gap: 2rem;
        align-items: center;
        padding: 2rem 0;
        &:not(:last-child) { border-bottom: 0.1rem solid var(--white-500); }
    }
    .thumb {
        width: 9.6rem;
        height: 9.6rem;
        border-radius: 1rem;
        background: var(--white-600);
        padding: 0.8rem;
        overflow: hidden;
    }
    .details {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        .name { font-size: 1.55rem; font-weight: 500; color: var(--gray-700); line-height: 1.35; }
        .name:hover { color: var(--primary); }
        .unit { font-size: 1.35rem; color: var(--gray-200); }
        small { font-size: 1.25rem; color: var(--warning); }
    }
    .actions { display: flex; align-items: center; gap: 1.6rem; margin-top: 0.4rem; }
    .remove { font-size: 1.4rem; color: var(--gray-200); text-decoration: underline; &:hover { color: var(--danger); } }
    .line-total { font-family: var(--font-red-hat); font-size: 1.9rem; color: var(--gray-800); white-space: nowrap; }
    .footer {
        display: flex;
        justify-content: space-between;
        padding: 2rem 0 1.6rem;
        border-top: 0.1rem solid var(--gray-50);
        font-size: 1.45rem;
        a { color: var(--primary); font-weight: 600; }
        button { color: var(--gray-200); &:hover { color: var(--danger); } }
    }
    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
    @media (max-width: 560px) {
        .items { padding: 0.8rem 1.6rem; }
        li { grid-template-columns: 7.2rem minmax(0, 1fr); gap: 1.2rem; }
        .thumb { width: 7.2rem; height: 7.2rem; }
        .line-total { grid-column: 2; font-size: 1.7rem; }
    }
`
