import React, { useState } from 'react';
import { NavigationCategories } from './NavigationCategories'
import { NavLinks, AllCategories } from './styles'
import MenuCategories from '/src/assets/icon-menu.svg'
import { MegaMenu } from './MegaMenu';

export function NavBar() {

    const [showMegaMenu, setshowMegaMenu] = useState(false);

    const toggleMegaMenu = () => {
        setshowMegaMenu(!showMegaMenu);
    };

    const closeMegaMenu = () => {
        setshowMegaMenu(false);
    }

    return (
        <>
            <NavLinks>
                <div className="container">
                    <AllCategories>
                        <button type='button' title='Todas as categorias' onClick={toggleMegaMenu}>
                            <img src={MenuCategories} alt="Icone de 3 traços simbolizando um menu hamburguer" />
                            <span>Todas as categorias</span>
                        </button>
                    </AllCategories>
                    <NavigationCategories />
                </div>
            </NavLinks>
            {showMegaMenu && <MegaMenu closeMegaMenu={closeMegaMenu} />}
        </>
    )
}