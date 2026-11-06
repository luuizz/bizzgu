import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { CalendarBlank, Clock, EyeSlash, PencilSimple, ShareNetwork, UserCircle } from '@phosphor-icons/react'
import { Page } from '../components/layout'
import { PostCard, PostGrid } from '../components/blog/PostCard'
import { PostContentStyles } from '../components/blog/PostContentStyles'
import { Breadcrumb, ErrorState, Loader, SectionTitle } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useToast } from '../hooks/useToast'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getPostBySlug, getPosts } from '../services/catalog'
import { sanitizeHtml } from '../lib/html'
import { formatPostDate, readingMinutes } from '../lib/posts'
import { imageUrl } from '../lib/format'
import { NotFound } from './NotFound'

export function Post() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const post = useAsync(() => getPostBySlug(slug), [slug])
    const more = useAsync(() => (post.data ? getPosts({ limit: 3, excludeId: post.data.id }) : Promise.resolve([])), [post.data?.id])
    const html = useMemo(() => sanitizeHtml(post.data?.content), [post.data?.content])

    useDocumentTitle(post.data?.title)

    if (post.loading) return <Loader />
    if (post.error) return <ErrorState error={post.error} onRetry={post.reload} />
    if (!post.data) return <NotFound />

    const data = post.data
    const isPublic = data.status === 'published' && new Date(data.published_at) <= new Date()

    // Links internos do conteúdo (/categoria/...) navegam sem recarregar a página
    const handleContentClick = (event) => {
        const anchor = event.target.closest('a')
        const href = anchor?.getAttribute('href')
        if (href?.startsWith('/') && !event.metaKey && !event.ctrlKey) {
            event.preventDefault()
            navigate(href)
        }
    }

    const share = async () => {
        const url = window.location.href
        try {
            if (navigator.share) await navigator.share({ title: data.title, url })
            else { await navigator.clipboard.writeText(url); toast.show('Link copiado!', 'success') }
        } catch {
            // compartilhamento cancelado
        }
    }

    return (
        <Page>
            <div className="container">
                {!isPublic && (
                    <Preview role="status">
                        <EyeSlash size={22} />
                        <span><strong>Pré-visualização.</strong> {data.status === 'draft' ? 'Este post é um rascunho' : 'Este post está agendado'} e só aparece para administradores.</span>
                        <Link to={`/admin/blog/${data.id}`}><PencilSimple size={18} /> Editar post</Link>
                    </Preview>
                )}
                <div className="page-head">
                    <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: 'Blog', to: '/blog' }, { label: data.title }]} />
                </div>

                <Article>
                    <header>
                        <h1>{data.title}</h1>
                        {data.excerpt && <p className="excerpt">{data.excerpt}</p>}
                        <div className="meta">
                            {data.author_name && <span><UserCircle size={18} /> {data.author_name}</span>}
                            {data.published_at && <span><CalendarBlank size={18} /> {formatPostDate(data.published_at)}</span>}
                            <span><Clock size={18} /> {readingMinutes(data.content)} min de leitura</span>
                            <button type="button" onClick={share}><ShareNetwork size={18} /> Compartilhar</button>
                        </div>
                    </header>
                    {data.cover_image && <img className="cover" src={imageUrl(data.cover_image)} alt="" />}
                    <PostContentStyles className="content" onClick={handleContentClick} dangerouslySetInnerHTML={{ __html: html }} />
                </Article>

                {more.data?.length > 0 && (
                    <More>
                        <SectionTitle>Leia também</SectionTitle>
                        <PostGrid>{more.data.map((item) => <PostCard key={item.id} post={item} />)}</PostGrid>
                    </More>
                )}
            </div>
        </Page>
    )
}

const Preview = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    flex-wrap: wrap;
    padding: 1.2rem 1.6rem;
    margin-top: 2rem;
    border-radius: 1.2rem;
    background: var(--warning-50);
    font-size: 1.4rem;
    span { flex: 1; min-width: 20rem; }
    a { display: inline-flex; align-items: center; gap: 0.6rem; font-weight: 600; color: var(--primary); }
`

const Article = styled.article`
    max-width: 80rem;
    margin: 0 auto;
    background: var(--white);
    border-radius: 2.4rem;
    padding: 5.6rem 6.4rem 6.4rem;
    header { display: flex; flex-direction: column; gap: 1.6rem; margin-bottom: 3.2rem; }
    h1 { font-size: 4rem; line-height: 1.15; color: var(--gray-800); }
    .excerpt { font-size: 2rem; line-height: 1.5; color: var(--gray-300); }
    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem 2rem;
        padding-top: 1.6rem;
        border-top: 0.1rem solid var(--white-500);
        font-size: 1.4rem;
        color: var(--gray-200);
        span, button { display: inline-flex; align-items: center; gap: 0.6rem; }
        svg { color: var(--primary); }
        button { color: var(--primary); font-weight: 600; margin-left: auto; }
    }
    .cover { width: 100%; border-radius: 1.6rem; margin-bottom: 4rem; aspect-ratio: 1200 / 630; object-fit: cover; }
    @media (max-width: 700px) {
        padding: 2.8rem 2rem 3.2rem;
        border-radius: 1.6rem;
        h1 { font-size: 2.8rem; }
        .excerpt { font-size: 1.7rem; }
        .meta button { margin-left: 0; }
    }
`

const More = styled.section`
    padding: 6.4rem 0 8rem;
    h2 { margin-bottom: 2.4rem; }
`
