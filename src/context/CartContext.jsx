import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addItem = (item, quantity) => {
        const verifyItem = cartItems.find(cartItem => cartItem.id === item.id);

    if(verifyItem) {
        setCartItems(prevItems =>
            prevItems.map(cartItem =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem)
            );
        } else {
            setCartItems(prevItems => [...prevItems, { ...item, quantity}]);
        }
    };

    const removeItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(cartItem => cartItem.id !== itemId));
    };

    const clear = () => {
        setCartItems([]);
    };

    const isInCart = (id) => {
        return cartItems.some(cartItem => cartItem.id === id);
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItem,
                removeItem,
                clear,
                isInCart,
            }}
        >
        {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}