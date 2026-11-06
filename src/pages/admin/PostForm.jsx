import { useEffect, useState } from 'react'
import { ArrowLeft, Eye } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { ImageField } from '../../components/admin/ImageField'
import { RichTextEditor } from '../../components/admin/RichTextEditor'
import { Alert, Badge, Button, Card, ErrorState, Field, Input, Loader, Spinner, Textarea } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { deletePost, getPostById, removeUploadedImages, savePost } from '../../services/admin'
import { fromLocalInput, postStatus, readingMinutes, toLocalInput } from '../../lib/posts'
import { slugify } from '../../lib/format'

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function PostForm() {
    const { id } = useParams()
    const isNew = !id
    const navigate = useNavigate()
    const toast = useToast()
    const { profile } = useAuth()
    useDocumentTitle(isNew ? 'Novo post · Admin' : 'Editar post · Admin')

    const [form, setForm] = useState({
        title: '',
        slug: '',
        excerpt: '',
        cover_image: '',
        content: '',
        status: 'draft',
        published_at: '',
        author_name: profile?.full_name || 'Equipe Bizzgu',
    })
    const [saved, setSaved] = useState(null)
    const [slugTouched, setSlugTouched] = useState(false)
    const [loading, setLoading] = useState(!isNew)
    const [loadError, setLoadError] = useState(null)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(null) // 'draft' | 'published'
    const [discarded, setDiscarded] = useState([])

    useEffect(() => {
        if (isNew) return
        getPostById(Number(id))
            .then((post) => {
                if (!post) throw new Error('Post não encontrado.')
                setSaved(post)
                setForm({
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt || '',
                    cover_image: post.cover_image || '',
                    content: post.content || '',
                    status: post.status,
                    published_at: toLocalInput(post.published_at),
                    author_name: post.author_name || '',
                })
                setSlugTouched(true)
            })
            .catch(setLoadError)
            .finally(() => setLoading(false))
    }, [id, isNew])

    if (loading) return <Loader />
    if (loadError) return <ErrorState error={loadError} />

    const set = (field) => (event) => {
        const value = event?.target ? event.target.value : event
        setForm((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'title' && !slugTouched ? { slug: slugify(value) } : {}),
        }))
        setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
    }

    // status: 'draft' salva como rascunho; 'published' publica (ou mantém publicado)
    const submit = async (status) => {
        const next = {}
        if (!form.title.trim()) next.title = 'Informe o título.'
        if (!SLUG_RE.test(form.slug)) next.slug = 'Use letras minúsculas, números e hífens.'
        if (status === 'published' && !form.content.replace(/<[^>]+>/g, '').trim()) next.content = 'Escreva o conteúdo antes de publicar.'
        setErrors(next)
        if (Object.keys(next).length) return

        setSaving(status)
        try {
            const publishedAt = status === 'published'
                ? fromLocalInput(form.published_at) || new Date().toISOString()
                : fromLocalInput(form.published_at)
            const post = await savePost(isNew ? null : Number(id), {
                title: form.title.trim(),
                slug: form.slug,
                excerpt: form.excerpt.trim() || null,
                cover_image: form.cover_image || null,
                content: form.content,
                status,
                published_at: publishedAt,
                author_name: form.author_name.trim() || null,
            })
            removeUploadedImages(discarded.filter((url) => url !== form.cover_image)).catch(() => {})
            setDiscarded([])
            setSaved(post)
            setForm((prev) => ({ ...prev, status: post.status, published_at: toLocalInput(post.published_at) }))
            toast.show(status === 'published' ? (postStatus(post).label === 'Agendado' ? 'Post agendado!' : 'Post publicado!') : 'Rascunho salvo.', 'success')
            if (isNew) navigate(`/admin/blog/${post.id}`, { replace: true })
        } catch (error) {
            setErrors({ form: error.message.includes('posts_slug_key') ? 'Já existe um post com esse slug.' : error.message })
        } finally {
            setSaving(null)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Excluir o post "${saved.title}"? Isso não pode ser desfeito.`)) return
        try {
            await deletePost(Number(id))
            removeUploadedImages([saved.cover_image, ...discarded].filter(Boolean)).catch(() => {})
            toast.show('Post excluído.', 'success')
            navigate('/admin/blog', { replace: true })
        } catch (error) {
            toast.show(error.message, 'danger')
        }
    }

    const status = saved ? postStatus(saved) : { label: 'Novo', tone: 'neutral' }
    const isPublished = saved?.status === 'published'

    return (
        <>
            <DashHeader>
                <div>
                    <Link to="/admin/blog" className="back"><ArrowLeft size={18} /> Blog</Link>
                    <h1>{isNew ? 'Novo post' : 'Editar post'}</h1>
                </div>
                <div className="actions">
                    <Badge $tone={status.tone}>{status.label}</Badge>
                    {saved && (
                        <Button as="a" href={`${import.meta.env.BASE_URL}blog/${saved.slug}`} target="_blank" rel="noreferrer" $variant="ghost" title="Abre a versão salva numa nova aba">
                            <Eye size={20} /> {status.label === 'Publicado' ? 'Ver no site' : 'Pré-visualizar'}
                        </Button>
                    )}
                </div>
            </DashHeader>

            <Form onSubmit={(event) => { event.preventDefault(); submit(isPublished ? 'published' : 'draft') }} noValidate>
                <div className="main">
                    <Card>
                        <div className="fields">
                            <Field label="Título" htmlFor="post-title" error={errors.title}>
                                <Input id="post-title" className="title-input" value={form.title} onChange={set('title')} maxLength={160} placeholder="Um título que chame para a leitura" aria-invalid={!!errors.title} />
                            </Field>
                            <Field label="Slug (endereço)" htmlFor="post-slug" error={errors.slug} hint={`/blog/${form.slug || '...'}`}>
                                <Input id="post-slug" value={form.slug} onChange={(event) => { setSlugTouched(true); set('slug')(slugify(event.target.value)) }} aria-invalid={!!errors.slug} />
                            </Field>
                            <Field label="Resumo" htmlFor="post-excerpt" hint="Aparece nos cards do blog e abaixo do título. Até 300 caracteres.">
                                <Textarea id="post-excerpt" rows={3} value={form.excerpt} onChange={set('excerpt')} maxLength={300} />
                            </Field>
                        </div>
                    </Card>

                    <div>
                        <EditorHead>
                            <CardTitle as="h2">Conteúdo</CardTitle>
                            <span>{readingMinutes(form.content)} min de leitura</span>
                        </EditorHead>
                        {errors.content && <Alert $tone="danger" style={{ marginBottom: '1.2rem' }}>{errors.content}</Alert>}
                        <RichTextEditor value={form.content} onChange={(html) => set('content')(html)} />
                    </div>
                </div>

                <div className="side">
                    <Card>
                        <CardTitle>Publicação</CardTitle>
                        <div className="fields">
                            <Field label="Data de publicação" htmlFor="post-date" hint="Vazio: publica agora. Data futura: o post fica agendado.">
                                <Input id="post-date" type="datetime-local" value={form.published_at} onChange={set('published_at')} />
                            </Field>
                            <Field label="Autor" htmlFor="post-author">
                                <Input id="post-author" value={form.author_name} onChange={set('author_name')} maxLength={80} />
                            </Field>
                        </div>
                        <div className="buttons">
                            {errors.form && <Alert $tone="danger">{errors.form}</Alert>}
                            {isPublished ? (
                                <>
                                    <Button type="button" $size="lg" $block disabled={!!saving} onClick={() => submit('published')}>
                                        {saving === 'published' ? <><Spinner /> Salvando...</> : 'Salvar alterações'}
                                    </Button>
                                    <Button type="button" $variant="secondary" $block disabled={!!saving} onClick={() => submit('draft')}>
                                        {saving === 'draft' ? <Spinner /> : 'Voltar para rascunho'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button type="button" $size="lg" $block disabled={!!saving} onClick={() => submit('published')}>
                                        {saving === 'published' ? <><Spinner /> Publicando...</> : 'Publicar'}
                                    </Button>
                                    <Button type="button" $variant="secondary" $block disabled={!!saving} onClick={() => submit('draft')}>
                                        {saving === 'draft' ? <Spinner /> : 'Salvar rascunho'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <CardTitle>Capa</CardTitle>
                        <ImageField
                            id="post-cover"
                            folder="blog"
                            value={form.cover_image}
                            onChange={(url) => set('cover_image')(url)}
                            onRemoved={(url) => url && setDiscarded((prev) => [...prev, url])}
                            ratio="1200 / 630"
                            hint="1200 × 630 px. Também é a imagem usada ao compartilhar."
                        />
                    </Card>

                    {!isNew && <Button type="button" $variant="danger" $block onClick={handleDelete}>Excluir post</Button>}
                </div>
            </Form>
        </>
    )
}

const Form = styled.form`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 34rem;
    gap: 2.4rem;
    align-items: start;
    .main, .side { display: flex; flex-direction: column; gap: 2.4rem; min-width: 0; }
    .side { position: sticky; top: 8.8rem; }
    .fields { display: flex; flex-direction: column; gap: 1.6rem; }
    .buttons { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
    .title-input { font-size: 2rem; font-weight: 600; height: 5.6rem; }
    @media (max-width: 1100px) {
        grid-template-columns: 1fr;
        .side { position: static; }
    }
`

const EditorHead = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1.2rem;
    h2 { margin: 0; }
    span { font-size: 1.3rem; color: var(--gray-200); }
`
