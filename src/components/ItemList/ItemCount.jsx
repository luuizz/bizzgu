import React, { useState } from 'react';
import { StyleWrapper, StyleButton, Count, StyleButtonChart } from './styles'

export function ItemCount ({ stock, initial, onAdd }) {
    const [count, setCount] = useState(parseInt(initial));

    const handleIncrease = () => {
        if (count < parseInt(stock)) {
            setCount(count + 1);
        }
    };

    const handleDecrease = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const handleAdd = () => {
        if (count > 0 && count <= parseInt(stock)) {
            onAdd(count);
        }
    };

    return (
        <>
            <StyleWrapper>
                <div className="top">
                    <StyleButton onClick={handleDecrease} title='Remover quantidade'>-</StyleButton>
                    <Count>{count}</Count>
                    <StyleButton onClick={handleIncrease} title='Adicionar quantidade'>+</StyleButton>
                </div>
                <div className="bottom">
                    <StyleButtonChart onClick={handleAdd} disabled={stock === 0} title='Adicionar ao Carrinho'>Adicionar ao Carrinho</StyleButtonChart>
                </div>
            </StyleWrapper>
        </>
    )
}