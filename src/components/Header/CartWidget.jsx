import { StyleCard } from './styles'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext';
import iconCarrinho from '/src/assets/icon-chart.svg'

export function CartWidget() {
    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
        <StyleCard className="cart">
            <Link to="/carrinho-compras">
                    <img src={iconCarrinho} alt="Ícone de uma sacola" title={`Carrinho (${totalItems} itens)`} />
                    {totalItems > 0 && <span className="item-count">{totalItems}</span>}
            </Link>
        </StyleCard>
        </>
    );
}