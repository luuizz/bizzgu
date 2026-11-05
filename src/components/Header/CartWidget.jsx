import { Link } from 'react-router-dom'
import { StyleCard } from './styles'
import { useCart } from '../../hooks/useCart'
import iconCarrinho from '/src/assets/icon-chart.svg'

export function CartWidget() {
    const { count } = useCart()

    return (
        <StyleCard className="cart">
            <Link to="/carrinho-compras" title={`Carrinho (${count} ${count === 1 ? 'item' : 'itens'})`}>
                <img src={iconCarrinho} alt="Carrinho de compras" />
                {count > 0 && <span className="item-count">{count > 99 ? '99+' : count}</span>}
            </Link>
        </StyleCard>
    )
}
