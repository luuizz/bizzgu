import { useParams, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Tag } from '@phosphor-icons/react'
import { Page } from '../components/layout'
import { ProductGrid } from '../components/product/ProductGrid'
import { SortSelect } from '../components/product/SortSelect'
import { Breadcrumb, ButtonLink, EmptyState, ErrorState, Loader, PageTitle } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getProducts, getTagBySlug } from '../services/catalog'
import { NotFound } from './NotFound'

// Produtos de uma tag (ex.: /tag/lancamento), de qualquer categoria
export function TagPage() {
    const { slug } = useParams()
    const [params, setParams] = useSearchParams()
    const sort = params.get('ordem') || 'relevance'

    const tag = useAsync(() => getTagBySlug(slug), [slug])
    const products = useAsync(
        () => (tag.data ? getProducts({ tagId: tag.data.id, sort }) : Promise.resolve(null)),
        [tag.data?.id, sort],
    )

    useDocumentTitle(tag.data?.name)

    if (tag.loading) return <Loader />
    if (tag.error) return <ErrorState error={tag.error} onRetry={tag.reload} />
    if (!tag.data) return <NotFound />

    const list = products.data || []
    const loadingProducts = products.loading || products.data === null

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: `#${tag.data.name}` }]} />
                    <Title><Tag size={32} /> {tag.data.name}</Title>
                    {tag.data.description && <p>{tag.data.description}</p>}
                </div>

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
    )
}

const Title = styled(PageTitle)`
    display: flex;
    align-items: center;
    gap: 1rem;
    svg { color: var(--primary); }
`
