import React from 'react'
import {StyleModalLocalization} from './styles'

export function ModalLocalization({className, modalRef, closeModal}) {
    
    return (
        <StyleModalLocalization className="overlay">
            <div ref={modalRef} className={`${className} modal`}>
                <button onClick={closeModal}>Fechar Modal</button>
            </div>
        </StyleModalLocalization>
    )
}