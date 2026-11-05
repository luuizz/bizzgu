import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import GlobalStyle from './styles/Global'
import { IconContext } from '@phosphor-icons/react'
import { ScrollToTop } from './components/ScrollToTop'
import { SetupNotice } from './components/SetupNotice'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import { WishlistProvider } from './context/WishlistProvider'
import { ToastProvider } from './context/ToastProvider'
import { isApiConfigured } from './lib/api'

// Phosphor Icons: variante de 2 tons (duotone) como padrão em todo o site
const iconDefaults = { weight: 'duotone', size: 24, color: 'currentColor', mirrored: false }

function App() {
    if (!isApiConfigured) {
        return (
            <>
                <GlobalStyle />
                <SetupNotice />
            </>
        )
    }

    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ToastProvider>
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <GlobalStyle />
                            <ScrollToTop />
                            <IconContext.Provider value={iconDefaults}>
                                <Router />
                            </IconContext.Provider>
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    )
}

export default App
