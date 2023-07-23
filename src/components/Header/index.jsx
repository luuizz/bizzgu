import { StylesHeader, StylesLogo, StyleGroupLeftSide } from './styles'
import { NavigationProfile } from '/src/components/Header/NavigationProfile'
import { LocalizationHeader } from './LocalizationHeader'
import imagemLogo from '/src/assets/logo-theme-light.svg'
import { SearchHeader } from './SearchHeader'

export function Header() {
    return (
        <>
            <StylesHeader>
                <div className="container">
                    <StylesLogo className="logo">
                        <a href="/" title='Página Inicial'>
                            <img src={imagemLogo} alt="Logo" />
                        </a>
                    </StylesLogo>
                    <div className="contentHeader">
                        <StyleGroupLeftSide>
                            <LocalizationHeader />
                            <SearchHeader />
                        </StyleGroupLeftSide>
                        <NavigationProfile />
                    </div>
                </div>
            </StylesHeader>
        </>
    )
}