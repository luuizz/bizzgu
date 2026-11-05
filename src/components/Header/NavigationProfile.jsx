import { Link } from 'react-router-dom'
import { Heart } from '@phosphor-icons/react'
import { StylesGroupProfile } from './styles'
import { CartWidget } from './CartWidget'
import { AccountMenu } from './AccountMenu'
import { useWishlist } from '../../hooks/useWishlist'

export function NavigationProfile() {
    const { count } = useWishlist()

    return (
        <StylesGroupProfile>
            <li className="badge-holder">
                <Link to="/lista-desejos" title="Lista de desejos">
                    <Heart size={28} aria-label="Lista de desejos" />
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
