import styled from 'styled-components'
import { Article } from '@phosphor-icons/react'
import { Page } from '../components/layout'
import { PostCard, PostGrid } from '../components/blog/PostCard'
import { Breadcrumb, EmptyState, ErrorState, Loader, PageTitle } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getPosts } from '../services/catalog'

export function Blog() {
    useDocumentTitle('Blog')
    const posts = useAsync(() => getPosts(), [])
    const list = posts.data || []
    const [first, ...rest] = list

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: 'Blog' }]} />
                    <PageTitle>Blog Bizzgu</PageTitle>
                    <p>Guias de compra, dicas e novidades para escolher melhor.</p>
                </div>

                {posts.loading ? <Loader /> : posts.error ? <ErrorState error={posts.error} onRetry={posts.reload} /> : list.length === 0 ? (
                    <EmptyState icon={Article} title="Nenhum post publicado ainda" description="Volte em breve: estamos preparando conteúdo." />
                ) : (
                    <Wrapper>
                        <div className="featured"><PostCard post={first} headingLevel={2} /></div>
                        {rest.length > 0 && <PostGrid>{rest.map((post) => <PostCard key={post.id} post={post} headingLevel={2} />)}</PostGrid>}
                    </Wrapper>
                )}
            </div>
        </Page>
    )
}

// O post mais recente ganha destaque, com a capa ao lado do texto
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    padding-bottom: 8rem;
    .featured > a {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
        .cover { aspect-ratio: auto; min-height: 32rem; }
        .body { padding: 4rem; justify-content: center; }
        h2 { font-size: 3rem; }
        p { -webkit-line-clamp: 4; font-size: 1.7rem; }
        .more { margin-top: 1.2rem; }
    }
    @media (max-width: 900px) {
        .featured > a { grid-template-columns: 1fr; .cover { min-height: 0; aspect-ratio: 1200 / 630; } .body { padding: 2.4rem; } h2 { font-size: 2.4rem; } }
    }
`
