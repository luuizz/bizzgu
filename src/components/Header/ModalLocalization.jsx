import React from 'react'
import {StyleModalLocalization} from './styles'
import { SearchHeader } from './SearchHeader'
import IconMap from '/src/assets/icon-local-modal.svg'
import IconClose from '/src/assets/icon-close.svg'

export function ModalLocalization({className, modalRef, closeModal}) {
    
    return (
        <StyleModalLocalization className="overlay">
            <div ref={modalRef} className={`${className} modal`}>
                <div className="top">
                    <button onClick={closeModal}>
                        <img src={IconClose} alt="Ícone de um quadrado com a letra X centralizada" title='Fechar modal' />
                    </button>
                </div>
                <div className="content">
                    <img src={IconMap} alt="Ícone de um mapa" title='Localização' />
                    <h3>Qual a sua localização?</h3>
                    <p>Informe a sua localização para ter acesso a ofertas e serviços exclusivos para a sua região</p>
                    <SearchHeader textHolder={'CEP'} />
                </div>
                <div className="bottom">
                    <span>Ou</span>
                    <a>Fazer login</a>
                </div>
            </div>
        </StyleModalLocalization>
    )
}