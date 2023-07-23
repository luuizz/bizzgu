import { StylesGroupProfile } from './styles'
import iconWishList from '/src/assets/icon-wishlist.svg'
import iconAccount from '/src/assets/icon-account.svg'
import iconCarrinho from '/src/assets/icon-chart.svg'

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
                        <img src={iconCarrinho} alt="Ícone de uma sacola" title='Carrinho'/>
                    </a>
                </li>
            </StylesGroupProfile>
        </>
    )
}