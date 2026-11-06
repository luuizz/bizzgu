import { useParams, useSearchParams } from 'react-router-dom'
import { Package } from '@phosphor-icons/react'
import { Page } from '../components/layout'
import { ProductGrid } from '../components/product/ProductGrid'
import { SortSelect } from '../components/product/SortSelect'
import { ButtonLink, EmptyState, ErrorState } from '../components/ui'
import { CatalogHero } from '../components/catalog/CatalogHero'
import { useCategories } from '../hooks/useCategories'
import { categoryIcon } from '../lib/categoryIcons'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getCategoryBySlug, getProducts } from '../services/catalog'
import { NotFound } from './NotFound'

export function Categoria() {
    const { slug } = useParams()
    const [params, setParams] = useSearchParams()
    const sort = params.get('ordem') || 'relevance'

    const categories = useCategories()
    const category = useAsync(() => getCategoryBySlug(slug), [slug])
    const products = useAsync(
        () => (category.data ? getProducts({ categoryId: category.data.id, sort }) : Promise.resolve(null)),
        [category.data?.id, sort],
    )

    useDocumentTitle(category.data?.name)

    const siblings = categories.map((item) => ({ to: `/categoria/${item.slug}`, label: item.name }))

    if (category.loading) {
        return (
            <>
                <CatalogHero loading links={siblings} linksLabel="Outros departamentos" />
                <Page><div className="container"><ProductGrid loading /></div></Page>
            </>
        )
    }
    if (category.error) return <ErrorState error={category.error} onRetry={category.reload} />
    if (!category.data) return <NotFound />

    const list = products.data || []
    const loadingProducts = products.loading || products.data === null

    return (
        <>
            <CatalogHero
                crumbs={[{ label: 'Início', to: '/' }, { label: category.data.name }]}
                title={category.data.name}
                description={category.data.description}
                image={category.data.image}
                icon={categoryIcon(category.data.slug)}
                count={loadingProducts ? null : list.length}
                links={siblings}
                linksLabel="Outros departamentos"
            />
        <Page>
            <div className="container">

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
        </>
    )
}

