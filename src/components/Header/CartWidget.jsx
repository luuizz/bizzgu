import { Link } from 'react-router-dom'
import { ShoppingCartSimple } from '@phosphor-icons/react'
import { StyleCard } from './styles'
import { useCart } from '../../hooks/useCart'

export function CartWidget() {
    const { count } = useCart()

    return (
        <StyleCard className="cart">
            <Link to="/carrinho-compras" title={`Carrinho (${count} ${count === 1 ? 'item' : 'itens'})`}>
                <ShoppingCartSimple size={28} aria-label="Carrinho de compras" />
                {count > 0 && <span className="item-count">{count > 99 ? '99+' : count}</span>}
            </Link>
        </StyleCard>
    )
}
