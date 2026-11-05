import { useSearchParams } from 'react-router-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Page } from '../components/layout'
import { ProductGrid } from '../components/product/ProductGrid'
import { SortSelect } from '../components/product/SortSelect'
import { Breadcrumb, ButtonLink, EmptyState, ErrorState, PageTitle } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getProducts } from '../services/catalog'

export function Search() {
    const [params, setParams] = useSearchParams()
    const q = (params.get('q') || '').trim()
    const onlyOffers = params.get('ofertas') === '1'
    const sort = params.get('ordem') || 'relevance'

    const title = onlyOffers ? 'Ofertas' : q ? `Resultados para "${q}"` : 'Todos os produtos'
    useDocumentTitle(title)

    const products = useAsync(() => getProducts({ search: q, onSale: onlyOffers, sort }), [q, onlyOffers, sort])
    const list = products.data || []

    const changeSort = (value) => {
        const next = new URLSearchParams(params)
        value === 'relevance' ? next.delete('ordem') : next.set('ordem', value)
        setParams(next, { replace: true })
    }

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: onlyOffers ? 'Ofertas' : 'Busca' }]} />
                    <PageTitle>{title}</PageTitle>
                </div>

                <SortSelect count={products.loading ? null : list.length} value={sort} onChange={changeSort} />

                {products.error && <ErrorState error={products.error} onRetry={products.reload} />}
                {!products.error && !products.loading && list.length === 0 ? (
                    <EmptyState
                        icon={MagnifyingGlass}
                        title="Nenhum produto encontrado"
                        description={q ? `Não encontramos nada para "${q}". Confira a ortografia ou tente termos mais gerais.` : undefined}
                        action={<ButtonLink to="/" $variant="secondary">Voltar para a loja</ButtonLink>}
                    />
                ) : (
                    !products.error && <ProductGrid products={list} loading={products.loading} />
                )}
            </div>
        </Page>
    )
}
