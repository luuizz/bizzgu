import { Page } from '../components/layout'
import { ButtonLink, EmptyState } from '../components/ui'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFound() {
    useDocumentTitle('Página não encontrada')
    return (
        <Page>
            <div className="container">
                <EmptyState
                    title="Página não encontrada"
                    description="O endereço pode estar errado ou o conteúdo foi removido."
                    action={<ButtonLink to="/">Voltar para a loja</ButtonLink>}
                />
            </div>
        </Page>
    )
}
