import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { StylesHeader, StylesLogo, StyleGroupLeftSide } from './styles'
import { NavigationProfile } from './NavigationProfile'
import { LocalizationHeader } from './LocalizationHeader'
import imagemLogo from '/src/assets/logo-theme-light.svg'
import { SearchHeader } from './SearchHeader'
import { ModalLocalization } from './ModalLocalization';

export function Header() {

    const [showModal, setshowModal] = useState(false);

    const toggleModal = () => {
        setshowModal(!showModal)
    };

    const closeModal = () => {
        setshowModal(false);
    }

    return (
        <>
            <StylesHeader>
                <div className="container">
                    <StylesLogo className="logo">
                        <Link to="/" title='Página Inicial'>
                            <img src={imagemLogo} alt="Logo" />
                        </Link>
                    </StylesLogo>
                    <div className="contentHeader">
                        <StyleGroupLeftSide>
                            <LocalizationHeader toggleModal={toggleModal} />
                            <SearchHeader />
                        </StyleGroupLeftSide>
                        <NavigationProfile />
                    </div>
                </div>
            </StylesHeader>
            {showModal && <ModalLocalization closeModal={closeModal} />}
        </>
    )
}