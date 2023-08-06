import React, { useRef, useState } from 'react';
import { StylesLocalization } from './styles'
import iconLocalization from '/src/assets/icon-local.svg'
import iconDropDown from '/src/assets/icon-dropdown.svg'

export function LocalizationHeader({toggleModal}) {
    return (
        <>
        <StylesLocalization>
            <button title='Selecionar cidade' onClick={toggleModal}>
                <img src={iconLocalization} alt="Ícone de localização" title='Localização' />
                <p>Localização</p>
                <img className='dropdown' src={iconDropDown} alt="Ícone de uma seta para baixo" />
            </button>
        </StylesLocalization>
        </>
    )
}