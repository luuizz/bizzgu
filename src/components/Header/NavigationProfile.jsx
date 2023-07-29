import { StylesGroupProfile } from './styles'
import iconWishList from '/src/assets/icon-wishlist.svg'
import iconAccount from '/src/assets/icon-account.svg'
import { CartWidget } from './CartWidget'

export function NavigationProfile() {
    return (
        <>
            <StylesGroupProfile>
                <li>
                    <a href="#">
                        <img src={iconWishList} alt="Ícone de um coração" title='Lista de desejos'/>
                    </a>
                </li>

                <li>
                    <a href="#">
                        <img src={iconAccount} alt="Ícone de um usuário com um círculo em volta" title='Conta'/>
                    </a>
                </li>

                <li>
                    <a href="#">
                        <CartWidget />
                    </a>
                </li>
            </StylesGroupProfile>
        </>
    )
}