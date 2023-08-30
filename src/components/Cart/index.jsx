import React from 'react';
import { StyleNoItems } from './style'
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { TitleSection } from '../ItemListContainer/TitleSection';
import NoItems from '/src/assets/cart-noitems.png'

export function Cart() {

    const { cartItems, removeItem, clear } = useCart();

    if(cartItems.length === 0) {
        return (
            <StyleNoItems className='cart-disable'>
                <div className="container">
                    <div className="area-bottom">
                        <img src={NoItems} alt="Não há items no carrinho" />
                    </div>
                    <div className="area-top">
                        <h3>Não há produtos no carrinho.</h3>
                        <Link className='btn-secondary' to="/">Voltar para a página inicial</Link>
                    </div>

                </div>
            </StyleNoItems>
        );
    }

    const totalPrice = cartItems.reduce((total, item) => {
        const product = products.find(product => product.id === item.id);
        return total + product.preço * item.quantity;
    }, 0);

    return (
        <section>
            <div className="container">
                <div className="top">
                    <TitleSection
                    title="Carrinho de compras"
                    />
                </div>
                <ul>
                    {cartItems.map(item => {
                        const product = products.find(product => product.id === item.id)
                        return (
                        <li key={item.id}>
                            <img src={product.imgUrl} alt={product.nome} />
                            <p>{product.nome} - {item.quantity}x - R$ {product.preço * item.quantity}</p>
                            <button onClick={() => removeItem(product.id)}>Remover</button>
                        </li>
                    )})}
                </ul>
                <p>Total: R$ {totalPrice}</p>
                <button onClick={() => clear()}>Limpar Carrinho</button>
                <Link to="/">Continuar Comprando</Link>
            </div>
        </section>
    );
}