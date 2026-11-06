import { useParams, useSearchParams } from 'react-router-dom'
import { Tag } from '@phosphor-icons/react'
import { Page } from '../components/layout'
import { ProductGrid } from '../components/product/ProductGrid'
import { SortSelect } from '../components/product/SortSelect'
import { ButtonLink, EmptyState, ErrorState } from '../components/ui'
import { CatalogHero } from '../components/catalog/CatalogHero'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getProducts, getTagBySlug, getTags } from '../services/catalog'
import { NotFound } from './NotFound'

// Produtos de uma tag (ex.: /tag/lancamento), de qualquer categoria
export function TagPage() {
    const { slug } = useParams()
    const [params, setParams] = useSearchParams()
    const sort = params.get('ordem') || 'relevance'

    const tag = useAsync(() => getTagBySlug(slug), [slug])
    const tags = useAsync(() => getTags(), [])
    const products = useAsync(
        () => (tag.data ? getProducts({ tagId: tag.data.id, sort }) : Promise.resolve(null)),
        [tag.data?.id, sort],
    )

    useDocumentTitle(tag.data?.name)

    const siblings = (tags.data || []).map((item) => ({ to: `/tag/${item.slug}`, label: `#${item.name}` }))

    if (tag.loading) {
        return (
            <>
                <CatalogHero loading links={siblings} linksLabel="Outras tags" />
                <Page><div className="container"><ProductGrid loading /></div></Page>
            </>
        )
    }
    if (tag.error) return <ErrorState error={tag.error} onRetry={tag.reload} />
    if (!tag.data) return <NotFound />

    const list = products.data || []
    const loadingProducts = products.loading || products.data === null

    return (
        <>
            <CatalogHero
                crumbs={[{ label: 'Início', to: '/' }, { label: `#${tag.data.name}` }]}
                title={`#${tag.data.name}`}
                description={tag.data.description}
                icon={Tag}
                count={loadingProducts ? null : list.length}
                links={siblings}
                linksLabel="Outras tags"
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
                        icon={Tag}
                        title="Nenhum produto com esta tag"
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

