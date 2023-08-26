import React, { useState } from 'react';
import { StyleWrapper, StyleButton, Count, StyleButtonChart } from './styles'
import IconRemove from '/src/assets/icon-subtract-circle.svg'
import IconAdd from '/src/assets/icon-plus-circle.svg'

export function ItemCount ({ stock, onAdd }) {
    const [count, setCount] = useState(1); // Inicializa a contagem com 1

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
                    <StyleButton className='btn-count' onClick={handleDecrease} title='Remover quantidade'>
                        <img src={IconRemove} alt="Ícone de um círculo com um traço interno" />
                    </StyleButton>
                    <Count>{count}</Count>
                    <StyleButton className='btn-count' onClick={handleIncrease} title='Adicionar quantidade'>
                        <img src={IconAdd} alt="Ícone de um círculo com um sinal de somar" />
                    </StyleButton>
                </div>
                <div className="bottom">
                    <StyleButtonChart onClick={handleAdd} disabled={stock === 0} title='Adicionar ao Carrinho'>Adicionar ao Carrinho</StyleButtonChart>
                </div>
            </StyleWrapper>
        </>
    )
}