import { NavigationCategories } from './NavigationCategories'
import { NavLinks, AllCategories } from './styles'
import MenuCategories from '/src/assets/icon-menu.svg'

export function NavBar() {
    return (
        <>
            <NavLinks>
                <div className="container">
                    <AllCategories>
                        <button type='button' title='Todas as categorias'>
                            <img src={MenuCategories} alt="Icone de 3 traços simbolizando um menu hamburguer" />
                            <span>Todas as categorias</span>
                        </button>
                    </AllCategories>
                    <NavigationCategories />
                </div>
            </NavLinks>
        </>
    )
}