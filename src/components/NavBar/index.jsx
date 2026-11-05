import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NavigationCategories } from './NavigationCategories'
import { NavLinks, AllCategories, NavWrapper } from './styles'
import { MegaMenu } from './MegaMenu'
import { List } from '@phosphor-icons/react'

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
                            <List size={24} />
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
