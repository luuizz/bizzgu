import { Link } from 'react-router-dom'
import { StylesGroupProfile } from './styles'
import iconWishList from '/src/assets/icon-wishlist.svg'
import iconAccount from '/src/assets/icon-account.svg'
import { CartWidget } from './CartWidget'

export function NavigationProfile() {
    return (
        <>
            <StylesGroupProfile>
                <li>
                    <Link to="/lista-desejos">
                        <img src={iconWishList} alt="Ícone de um coração" title='Lista de desejos'/>
                    </Link>
                </li>

                <li>
                    <Link to="/login">
                        <img src={iconAccount} alt="Ícone de um usuário com um círculo em volta" title='Conta'/>
                    </Link>
                </li>

                <li>
                    <CartWidget />
                </li>
            </StylesGroupProfile>
        </>
    )
}