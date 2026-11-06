import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled, { createGlobalStyle } from 'styled-components'
import { Page } from './layout'
import { Grid } from './product/ProductGrid'
import { PostGrid } from './blog/PostCard'

// Esqueletos da loja: imitam o formato da página que vai aparecer, para o conteúdo
// "encaixar" no lugar sem pulos. Cores puxadas para o lilás da marca.
const skeletonColors = { baseColor: '#ece9f4', highlightColor: '#f8f7fc' }
const skeletonColorsDark = { baseColor: 'rgba(255, 255, 255, 0.08)', highlightColor: 'rgba(255, 255, 255, 0.16)' }

export function StoreSkeletonTheme({ children }) {
    return (
        <SkeletonTheme {...skeletonColors} duration={1.4} borderRadius="0.6rem">
            <SkeletonText />
            {children}
        </SkeletonTheme>
    )
}

// Linhas de texto com altura de texto de verdade (a fonte base do site é 10px)
const SkeletonText = createGlobalStyle`
    .react-loading-skeleton { font-size: 1.4rem; }
`

// Para fundos escuros (topo das categorias)
export function DarkSkeletonTheme({ children }) {
    return <SkeletonTheme {...skeletonColorsDark} duration={1.4}>{children}</SkeletonTheme>
}

const Crumbs = () => <Skeleton width={180} height={14} />

// ---------------------------------------------------------------- Produto
export function ProductDetailSkeleton() {
    return (
        <ProductWrapper aria-busy="true" aria-label="Carregando produto">
            <div className="container">
                <Crumbs />
                <div className="layout">
                    <div>
                        <Skeleton className="square" borderRadius={16} />
                        <div className="thumbs">
                            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="square" borderRadius={10} />)}
                        </div>
                    </div>
                    <div className="infos">
                        <Skeleton width={90} height={13} />
                        <Skeleton height={36} style={{ marginTop: 12 }} />
                        <Skeleton width="70%" height={36} />
                        <div className="block">
                            <Skeleton width={110} height={16} />
                            <Skeleton width={220} height={44} />
                            <Skeleton width={190} height={16} />
                        </div>
                        <Skeleton width={150} height={44} borderRadius={10} />
                        <Skeleton height={56} borderRadius={12} style={{ marginTop: 16 }} />
                        <Skeleton height={56} borderRadius={12} style={{ marginTop: 12 }} />
                        <Skeleton count={4} style={{ marginTop: 10 }} />
                    </div>
                </div>
            </div>
        </ProductWrapper>
    )
}

const ProductWrapper = styled.section`
    padding: 3.2rem 0 8rem;
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 5.6rem; margin-top: 2.4rem; }
    .square { aspect-ratio: 1; display: block; }
    .thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem; margin-top: 1.2rem; }
    .infos { display: flex; flex-direction: column; }
    .block { display: flex; flex-direction: column; gap: 0.6rem; margin: 2.4rem 0; padding: 2.4rem 0; border-block: 0.1rem solid var(--gray-50); }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; gap: 3.2rem; } }
`

// ---------------------------------------------------------------- Blog
export function PostCardSkeleton({ featured = false }) {
    return (
        <PostCardBox className={featured ? 'featured' : ''}>
            <Skeleton className="cover" borderRadius={0} />
            <div className="body">
                <Skeleton width={120} height={14} />
                <Skeleton height={featured ? 32 : 22} style={{ marginTop: 6 }} />
                <Skeleton width="65%" height={featured ? 32 : 22} />
                <Skeleton count={featured ? 3 : 2} style={{ marginTop: 6 }} />
            </div>
        </PostCardBox>
    )
}

export function PostListSkeleton({ featured = true, count = 3 }) {
    return (
        <PostList aria-busy="true" aria-label="Carregando posts">
            {featured && <PostCardSkeleton featured />}
            <PostGrid>{Array.from({ length: count }, (_, index) => <PostCardSkeleton key={index} />)}</PostGrid>
        </PostList>
    )
}

const PostList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    padding-bottom: 8rem;
`

const PostCardBox = styled.div`
    display: flex;
    flex-direction: column;
    background: var(--white);
    border-radius: 1.6rem;
    overflow: hidden;
    .cover { display: block; aspect-ratio: 1200 / 630; line-height: 1; }
    .body { padding: 2.4rem; display: flex; flex-direction: column; gap: 0.4rem; }
    &.featured {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
        .cover { aspect-ratio: auto; height: 100%; min-height: 32rem; }
        .body { padding: 4rem; justify-content: center; }
    }
    @media (max-width: 900px) {
        &.featured { grid-template-columns: 1fr; .cover { min-height: 0; aspect-ratio: 1200 / 630; } .body { padding: 2.4rem; } }
    }
`

export function PostSkeleton() {
    return (
        <Page aria-busy="true" aria-label="Carregando post">
            <div className="container">
                <div className="page-head"><Crumbs /></div>
                <ArticleBox>
                    <Skeleton height={44} />
                    <Skeleton width="60%" height={44} />
                    <Skeleton count={2} height={20} style={{ marginTop: 12 }} />
                    <div className="meta"><Skeleton width={320} height={16} /></div>
                    <Skeleton className="cover" borderRadius={16} />
                    <Skeleton count={5} style={{ marginTop: 8 }} />
                    <Skeleton width="80%" />
                    <Skeleton count={4} style={{ marginTop: 24 }} />
                </ArticleBox>
            </div>
        </Page>
    )
}

const ArticleBox = styled.div`
    max-width: 80rem;
    margin: 0 auto;
    background: var(--white);
    border-radius: 2.4rem;
    padding: 5.6rem 6.4rem 6.4rem;
    .meta { margin: 1.6rem 0 3.2rem; padding-top: 1.6rem; border-top: 0.1rem solid var(--white-500); }
    .cover { display: block; aspect-ratio: 1200 / 630; margin-bottom: 3.2rem; }
    @media (max-width: 700px) { padding: 2.8rem 2rem 3.2rem; border-radius: 1.6rem; }
`

// ---------------------------------------------------------------- Pedidos (área do cliente)
export function OrderListSkeleton({ rows = 3 }) {
    return (
        <OrderRows aria-busy="true" aria-label="Carregando pedidos">
            {Array.from({ length: rows }, (_, index) => (
                <li key={index}>
                    <Skeleton circle width={44} height={44} />
                    <div className="text">
                        <Skeleton width="40%" height={16} />
                        <Skeleton width="25%" height={13} />
                    </div>
                    <Skeleton width={90} height={26} borderRadius={20} />
                    <Skeleton width={90} height={18} />
                </li>
            ))}
        </OrderRows>
    )
}

const OrderRows = styled.ul`
    display: flex;
    flex-direction: column;
    li {
        display: flex;
        align-items: center;
        gap: 1.6rem;
        padding: 1.6rem 0;
        &:not(:last-child) { border-bottom: 0.1rem solid var(--white-500); }
        > span { flex-shrink: 0; line-height: 1; }
    }
    .text { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; min-width: 0; }
    @media (max-width: 600px) { li > span:last-child { display: none; } }
`

// ---------------------------------------------------------------- Página genérica
// Enquanto o código de uma página carrega (rotas sob demanda)
export function PageSkeleton() {
    return (
        <Page aria-busy="true" aria-label="Carregando página">
            <div className="container">
                <div className="page-head">
                    <Crumbs />
                    <Skeleton width={320} height={38} />
                    <Skeleton width={420} height={18} />
                </div>
                <Grid>
                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} style={{ background: 'var(--white)', borderRadius: 12, padding: 16 }}>
                            <Skeleton height={190} borderRadius={8} />
                            <Skeleton width="40%" style={{ marginTop: 16 }} />
                            <Skeleton count={2} />
                        </div>
                    ))}
                </Grid>
            </div>
        </Page>
    )
}

// Cartões de números (área do cliente)
export function StatsSkeleton({ count = 4 }) {
    return (
        <StatsRow aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <div key={index}>
                    <Skeleton width="55%" height={14} />
                    <Skeleton width="40%" height={30} style={{ marginTop: 10 }} />
                </div>
            ))}
        </StatsRow>
    )
}

const StatsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.6rem;
    > div { background: var(--white); border-radius: 1.2rem; padding: 2rem 2.4rem; border-top: 0.3rem solid var(--primary-100); }
    @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    @media (max-width: 480px) { grid-template-columns: 1fr; }
`

export function OrderDetailSkeleton() {
    return (
        <DetailBox aria-busy="true" aria-label="Carregando pedido">
            <Skeleton width={90} height={14} />
            <Skeleton width={260} height={32} />
            <div className="card">
                <Skeleton height={8} borderRadius={8} />
                <OrderListSkeleton rows={2} />
            </div>
            <div className="card"><Skeleton count={4} /></div>
        </DetailBox>
    )
}

const DetailBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    .card { background: var(--white); border-radius: 1.2rem; padding: 2.4rem; margin-top: 1.2rem; }
`
