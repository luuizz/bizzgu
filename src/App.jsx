import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import GlobalStyle from './styles/Global'
import { Header } from './components/Header'
import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { SetupNotice } from './components/SetupNotice'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import { WishlistProvider } from './context/WishlistProvider'
import { ToastProvider } from './context/ToastProvider'
import { isSupabaseConfigured } from './lib/supabase'

function App() {
    if (!isSupabaseConfigured) {
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
                            <Header />
                            <NavBar />
                            <main>
                                <Router />
                            </main>
                            <Footer />
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    )
}

export default App
