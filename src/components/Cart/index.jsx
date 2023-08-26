import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { BtnSecondary } from '../../components/Global/ButtonSecondary'

export function Cart() {

    const { cartItems, removeItem, clear } = useCart();

    if(cartItems.length === 0) {
        return (
            <div>
                <p>Não há produtos no carrinho.</p>
                <Link className='btn-secondary' to="/">Voltar para a página inicial</Link>
            </div>
        );
    }

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <section>
            <h1>Carrinho de compras</h1>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        <p>{item.name} - {item.quantity}x - R$ {item.price * item.quantity}</p>
                        <button onClick={() => removeItem(item.id)}>Remover</button>
                    </li>
                ))}
            </ul>
            <p>Total: R$ {totalPrice}</p>
            <button onClick={() => clear()}>Limpar Carrinho</button>
            <Link to="/">Continuar Comprando</Link>
        </section>
    );
}