import styled from 'styled-components'
import { LockKey } from '@phosphor-icons/react'
import { ButtonLink, EmptyState } from '../components/ui'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import logo from '/src/assets/logo-theme-light.svg'

// Mostrada fora da moldura da loja (rota do painel), por isso tem layout próprio
export function Forbidden() {
    useDocumentTitle('Acesso restrito')
    return (
        <Wrapper>
            <img src={logo} alt="Bizzgu" className="logo" />
            <div className="card">
                <EmptyState
                    icon={LockKey}
                    title="Acesso restrito"
                    description="O painel administrativo é exclusivo para administradores da loja."
                    action={
                        <div className="actions">
                            <ButtonLink to="/">Ir para a loja</ButtonLink>
                            <ButtonLink to="/minha-conta" $variant="secondary">Minha conta</ButtonLink>
                        </div>
                    }
                />
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3.2rem;
    padding: 2.4rem 1.6rem;
    .logo { height: 4rem; }
    .card { background: var(--white); border-radius: 1.6rem; width: 100%; max-width: 56rem; }
    .actions { display: flex; gap: 1.2rem; flex-wrap: wrap; justify-content: center; }
`
