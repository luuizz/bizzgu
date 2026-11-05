import { useParams, useSearchParams } from 'react-router-dom'
import { Package } from '@phosphor-icons/react'
import { Page } from '../components/layout'
import { ProductGrid } from '../components/product/ProductGrid'
import { SortSelect } from '../components/product/SortSelect'
import { Breadcrumb, ButtonLink, EmptyState, ErrorState, Loader, PageTitle } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getCategoryBySlug, getProducts } from '../services/catalog'
import { NotFound } from './NotFound'

export function Categoria() {
    const { slug } = useParams()
    const [params, setParams] = useSearchParams()
    const sort = params.get('ordem') || 'relevance'

    const category = useAsync(() => getCategoryBySlug(slug), [slug])
    const products = useAsync(
        () => (category.data ? getProducts({ categoryId: category.data.id, sort }) : Promise.resolve(null)),
        [category.data?.id, sort],
    )

    useDocumentTitle(category.data?.name)

    if (category.loading) return <Loader />
    if (category.error) return <ErrorState error={category.error} onRetry={category.reload} />
    if (!category.data) return <NotFound />

    const list = products.data || []
    const loadingProducts = products.loading || products.data === null

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: category.data.name }]} />
                    <PageTitle>{category.data.name}</PageTitle>
                    {category.data.description && <p>{category.data.description}</p>}
                </div>

                <SortSelect
                    count={loadingProducts ? null : list.length}
                    value={sort}
                    onChange={(value) => setParams(value === 'relevance' ? {} : { ordem: value }, { replace: true })}
                />

                {products.error && <ErrorState error={products.error} onRetry={products.reload} />}
                {!products.error && !loadingProducts && list.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="Nenhum produto por aqui ainda"
                        description="Estamos preparando novidades para este departamento."
                        action={<ButtonLink to="/" $variant="secondary">Ver outros produtos</ButtonLink>}
                    />
                ) : (
                    !products.error && <ProductGrid products={list} loading={loadingProducts} />
                )}
            </div>
        </Page>
    )
}
