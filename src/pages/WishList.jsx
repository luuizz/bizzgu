import { Page } from '../components/layout'
import { Heart } from '@phosphor-icons/react'
import { ProductGrid } from '../components/product/ProductGrid'
import { ButtonLink, EmptyState, ErrorState, PageTitle } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useWishlist } from '../hooks/useWishlist'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getProducts } from '../services/catalog'

export function WishList() {
    useDocumentTitle('Lista de desejos')
    const wishlist = useWishlist()
    const key = [...wishlist.ids].sort().join(',')
    const products = useAsync(() => getProducts({ ids: wishlist.ids, sort: 'name' }), [key])
    const list = (products.data || []).filter((product) => wishlist.has(product.id))

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <PageTitle>Lista de desejos</PageTitle>
                    <p>Os produtos que você salvou ficam aqui. Toque no coração para remover.</p>
                </div>
                {products.error && <ErrorState error={products.error} onRetry={products.reload} />}
                {!products.error && !products.loading && list.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="Sua lista está vazia"
                        description="Salve produtos tocando no coração para encontrá-los depois."
                        action={<ButtonLink to="/">Explorar produtos</ButtonLink>}
                    />
                ) : (
                    !products.error && <ProductGrid products={list} loading={products.loading && !products.data} skeletonCount={4} />
                )}
            </div>
        </Page>
    )
}
