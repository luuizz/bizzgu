import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NavigationCategories } from './NavigationCategories'
import { NavLinks, AllCategories, NavWrapper } from './styles'
import { MegaMenu } from './MegaMenu'
import MenuCategories from '/src/assets/icon-menu.svg'

export function NavBar() {
    const [showMegaMenu, setShowMegaMenu] = useState(false)
    const location = useLocation()

    useEffect(() => setShowMegaMenu(false), [location.pathname])

    return (
        <NavWrapper>
            <NavLinks>
                <div className="container">
                    <AllCategories>
                        <button
                            type="button"
                            title="Todas as categorias"
                            onClick={() => setShowMegaMenu((open) => !open)}
                            aria-expanded={showMegaMenu}
                        >
                            <img src={MenuCategories} alt="" />
                            <span>Todas as categorias</span>
                        </button>
                    </AllCategories>
                    <NavigationCategories />
                </div>
            </NavLinks>
            {showMegaMenu && <MegaMenu closeMegaMenu={() => setShowMegaMenu(false)} />}
        </NavWrapper>
    )
}
