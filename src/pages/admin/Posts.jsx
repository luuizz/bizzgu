import { useState } from 'react'
import { Article, Eye, PencilSimple, Plus } from '@phosphor-icons/react'
import { Link, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { DashHeader } from '../../components/DashboardLayout'
import { Badge, Button, ButtonLink, Card, EmptyState, ErrorState, Input, Loader, Select, Table, TableScroll } from '../../components/ui'
import { Toolbar } from './Orders'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { listPosts } from '../../services/admin'
import { imageUrl } from '../../lib/format'
import { postStatus } from '../../lib/posts'

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export function Posts() {
    useDocumentTitle('Blog · Admin')
    const [search, setSearch] = useState('')
    const [params] = useSearchParams()
    const [query, setQuery] = useState({ search: '', status: params.get('status') || '' })
    const posts = useAsync(() => listPosts(query), [query])
    const rows = posts.data || []

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Blog</h1>
                    <p>Posts publicados aparecem em /blog e na seção “Do blog” da página inicial.</p>
                </div>
                <div className="actions">
                    <ButtonLink to="/admin/blog/novo"><Plus size={20} weight="bold" /> Novo post</ButtonLink>
                </div>
            </DashHeader>

            <Card>
                <Toolbar onSubmit={(event) => { event.preventDefault(); setQuery((prev) => ({ ...prev, search: search.trim() })) }}>
                    <Select
                        value={query.status}
                        onChange={(event) => setQuery((prev) => ({ ...prev, status: event.target.value }))}
                        aria-label="Filtrar por situação"
                        style={{ maxWidth: '20rem', height: '4.2rem' }}
                    >
                        <option value="">Todos</option>
                        <option value="published">Publicados</option>
                        <option value="draft">Rascunhos</option>
                    </Select>
                    <Input type="search" placeholder="Buscar pelo título" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar posts" />
                    <Button type="submit" $variant="secondary">Buscar</Button>
                </Toolbar>

                {posts.loading && !posts.data ? <Loader /> : posts.error ? <ErrorState error={posts.error} onRetry={posts.reload} /> : rows.length === 0 ? (
                    <EmptyState
                        icon={Article}
                        title={query.search || query.status ? 'Nenhum post encontrado' : 'Nenhum post ainda'}
                        action={<ButtonLink to="/admin/blog/novo">Escrever o primeiro post</ButtonLink>}
                    />
                ) : (
                    <TableScroll>
                        <Table>
                            <thead>
                                <tr><th>Post</th><th>Situação</th><th>Data</th><th><span className="sr-only">Ações</span></th></tr>
                            </thead>
                            <tbody>
                                {rows.map((post) => {
                                    const status = postStatus(post)
                                    return (
                                        <tr key={post.id}>
                                            <td>
                                                <PostCell to={`/admin/blog/${post.id}`}>
                                                    <span className="thumb">{post.cover_image ? <img src={imageUrl(post.cover_image)} alt="" /> : <Article size={22} />}</span>
                                                    <span className="stack">
                                                        <strong>{post.title}</strong>
                                                        <small>/blog/{post.slug}</small>
                                                    </span>
                                                </PostCell>
                                            </td>
                                            <td><Badge $tone={status.tone}>{status.label}</Badge></td>
                                            <td>{post.published_at ? dateFormat.format(new Date(post.published_at)) : '—'}</td>
                                            <td>
                                                <RowActions>
                                                    <a href={`${import.meta.env.BASE_URL}blog/${post.slug}`} target="_blank" rel="noreferrer" title={status.label === 'Publicado' ? 'Ver no site' : 'Pré-visualizar'} aria-label={`Ver ${post.title}`}><Eye size={20} /></a>
                                                    <Link to={`/admin/blog/${post.id}`} title="Editar" aria-label={`Editar ${post.title}`}><PencilSimple size={20} /></Link>
                                                </RowActions>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </TableScroll>
                )}
            </Card>
        </>
    )
}

const PostCell = styled(Link)`
    display: flex;
    align-items: center;
    gap: 1.4rem;
    min-width: 30rem;
    .thumb {
        width: 8.8rem;
        aspect-ratio: 1200 / 630;
        border-radius: 0.8rem;
        overflow: hidden;
        background: var(--primary-50);
        color: var(--primary);
        display: grid;
        place-items: center;
        flex-shrink: 0;
        img { width: 100%; height: 100%; object-fit: cover; }
    }
    .stack { display: flex; flex-direction: column; min-width: 0; }
    strong { color: var(--gray-700); font-weight: 600; }
    small { color: var(--gray-200); font-size: 1.25rem; }
    &:hover strong { color: var(--primary); }
`

const RowActions = styled.div`
    display: flex;
    gap: 0.4rem;
    justify-content: flex-end;
    a {
        display: grid;
        place-items: center;
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 0.8rem;
        color: var(--gray-300);
        &:hover { background: var(--primary-50); color: var(--primary); }
    }
`
