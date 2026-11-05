import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StylesHeader, StylesLogo, StyleGroupLeftSide } from './styles'
import { NavigationProfile } from './NavigationProfile'
import { LocalizationHeader } from './LocalizationHeader'
import { SearchHeader } from './SearchHeader'
import { ModalLocalization } from './ModalLocalization'
import imagemLogo from '/src/assets/logo-theme-light.svg'

const LOCATION_KEY = 'bizzgu:location'

function loadLocation() {
    try {
        return JSON.parse(localStorage.getItem(LOCATION_KEY))
    } catch {
        return null
    }
}

export function Header() {
    const [showModal, setShowModal] = useState(false)
    const [location, setLocation] = useState(loadLocation)

    useEffect(() => {
        try {
            if (location) localStorage.setItem(LOCATION_KEY, JSON.stringify(location))
        } catch {
            // ignora falha de armazenamento
        }
    }, [location])

    return (
        <>
            <StylesHeader>
                <div className="container">
                    <StylesLogo className="logo">
                        <Link to="/" title="Página Inicial">
                            <img src={imagemLogo} alt="Bizzgu" />
                        </Link>
                    </StylesLogo>
                    <div className="contentHeader">
                        <StyleGroupLeftSide>
                            <LocalizationHeader location={location} toggleModal={() => setShowModal((open) => !open)} />
                            <SearchHeader />
                        </StyleGroupLeftSide>
                        <NavigationProfile />
                    </div>
                </div>
            </StylesHeader>
            {showModal && (
                <ModalLocalization
                    closeModal={() => setShowModal(false)}
                    onConfirm={(value) => {
                        setLocation(value)
                        setShowModal(false)
                    }}
                />
            )}
        </>
    )
}
