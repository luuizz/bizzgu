import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader } from './ui'
import { Header } from './Header'
import { NavBar } from './NavBar'
import { Footer } from './Footer'

// Moldura da loja (cabeçalho, menu de categorias e rodapé).
// O painel administrativo usa o próprio layout, sem nada disso.
export function StoreLayout() {
    return (
        <>
            <Header />
            <NavBar />
            <main>
                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </>
    )
}
