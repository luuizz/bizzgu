import { Link } from 'react-router-dom'
import { StylesGroupProfile } from './styles'
import { CartWidget } from './CartWidget'
import { AccountMenu } from './AccountMenu'
import { useWishlist } from '../../hooks/useWishlist'
import iconWishList from '/src/assets/icon-wishlist.svg'

export function NavigationProfile() {
    const { count } = useWishlist()

    return (
        <StylesGroupProfile>
            <li className="badge-holder">
                <Link to="/lista-desejos" title="Lista de desejos">
                    <img src={iconWishList} alt="Lista de desejos" />
                    {count > 0 && <span className="item-count">{count}</span>}
                </Link>
            </li>
            <li>
                <AccountMenu />
            </li>
            <li>
                <CartWidget />
            </li>
        </StylesGroupProfile>
    )
}
