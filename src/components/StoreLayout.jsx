import { AnimatedOutlet } from './AnimatedOutlet'
import { PageSkeleton, StoreSkeletonTheme } from './skeletons'
import { Header } from './Header'
import { NavBar } from './NavBar'
import { Footer } from './Footer'

// Moldura da loja (cabeçalho, menu de categorias e rodapé).
// O painel administrativo usa o próprio layout, sem nada disso.
// A área do cliente tem menu lateral próprio: anima só ao entrar nela,
// e as subpáginas animam dentro do layout dela
const storeRouteKey = (pathname) => (pathname.startsWith('/minha-conta') ? '/minha-conta' : pathname)

export function StoreLayout() {
    return (
        <StoreSkeletonTheme>
            <Header />
            <NavBar />
            <main>
                <AnimatedOutlet routeKey={storeRouteKey} fallback={<PageSkeleton />} />
            </main>
            <Footer />
        </StoreSkeletonTheme>
    )
}
