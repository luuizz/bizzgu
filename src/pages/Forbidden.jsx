import { Page } from '../components/layout'
import { ButtonLink, EmptyState } from '../components/ui'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Forbidden() {
    useDocumentTitle('Acesso restrito')
    return (
        <Page>
            <div className="container">
                <EmptyState
                    title="Acesso restrito"
                    description="Esta área é exclusiva para administradores da loja."
                    action={<ButtonLink to="/minha-conta" $variant="secondary">Ir para minha conta</ButtonLink>}
                />
            </div>
        </Page>
    )
}
