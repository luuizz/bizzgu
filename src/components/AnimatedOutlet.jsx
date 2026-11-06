import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Loader } from './ui'

// Troca de página com entrada suave (fade + leve subida), feita só com CSS:
// não pesa no pacote da loja. Só anima a entrada, então a navegação não espera
// a página anterior sair. Quem pede menos movimento no sistema não vê a animação.
// routeKey: agrupa rotas que compartilham um layout próprio (ex.: /minha-conta/*),
// para o layout não piscar ao trocar entre as subpáginas dele.
export function AnimatedOutlet({ className, routeKey = (pathname) => pathname }) {
    const { pathname } = useLocation()
    return (
        <Page key={routeKey(pathname)} className={className}>
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        </Page>
    )
}

const pageIn = keyframes`
    from { opacity: 0; transform: translateY(1rem); }
    to { opacity: 1; transform: none; }
`

const Page = styled.div`
    animation: ${pageIn} .36s cubic-bezier(0.22, 1, 0.36, 1) backwards;
`
