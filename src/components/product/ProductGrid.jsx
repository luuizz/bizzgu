import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products, loading, skeletonCount = 8 }) {
    if (loading) {
        return (
            <Grid aria-busy="true">
                {Array.from({ length: skeletonCount }, (_, index) => (
                    <SkeletonCard key={index}>
                        <Skeleton height={190} borderRadius={8} />
                        <Skeleton width="40%" style={{ marginTop: 16 }} />
                        <Skeleton count={2} />
                        <Skeleton width="60%" height={28} style={{ marginTop: 12 }} />
                        <Skeleton height={42} borderRadius={10} style={{ marginTop: 16 }} />
                    </SkeletonCard>
                ))}
            </Grid>
        )
    }

    return (
        <Grid>
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </Grid>
    )
}

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2.4rem;
    @media (max-width: 1080px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    @media (max-width: 780px) { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2rem; }
`

const SkeletonCard = styled.div`
    background: var(--white);
    border-radius: 1.2rem;
    padding: 1.6rem;
`
