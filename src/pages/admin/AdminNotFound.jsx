import { MapTrifold } from '@phosphor-icons/react'
import { ButtonLink, Card, EmptyState } from '../../components/ui'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AdminNotFound() {
    useDocumentTitle('Página não encontrada')
    return (
        <Card>
            <EmptyState
                icon={MapTrifold}
                title="Página não encontrada"
                description="Este endereço não existe no painel."
                action={<ButtonLink to="/admin" $variant="secondary">Voltar para o painel</ButtonLink>}
            />
        </Card>
    )
}
