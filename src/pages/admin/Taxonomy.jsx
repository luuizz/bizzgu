import { useEffect, useState } from 'react'
import { ArrowLeft, Eye, MagnifyingGlass, PencilSimple, Plus, SquaresFour, Tag, Trash } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { ImageField } from '../../components/admin/ImageField'
import { Alert, Button, ButtonLink, Card, EmptyState, ErrorState, Field, Input, Loader, Spinner, Table, TableScroll, Textarea } from '../../components/ui'
import { Toolbar } from './Orders'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { invalidateCategories } from '../../hooks/useCategories'
import { deleteTerm, getTerm, listTerms, removeUploadedImages, saveTerm } from '../../services/admin'
import { slugify } from '../../lib/format'

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

// Diferenças entre categorias e tags; o resto das telas é igual
const KINDS = {
    categories: {
        title: 'Categorias',
        singular: 'categoria',
        newLabel: 'Nova categoria',
        description: 'Departamentos do menu da loja. Cada produto pertence a uma categoria.',
        base: '/admin/categorias',
        storePath: '/categoria/',
        productFilter: 'categoria',
        icon: SquaresFour,
        hasImage: true,
        hasOrder: true,
        afterChange: invalidateCategories,
        deleteWarning: (count) => (count ? `Os ${count} produto(s) dela ficarão sem categoria.` : ''),
    },
    tags: {
        title: 'Tags',
        singular: 'tag',
        newLabel: 'Nova tag',
        description: 'Etiquetas livres para agrupar produtos de categorias diferentes (ex.: Lançamento, Ideia de presente).',
        base: '/admin/tags',
        storePath: '/tag/',
        productFilter: 'tag',
        icon: Tag,
        hasImage: false,
        hasOrder: false,
        afterChange: () => {},
        deleteWarning: (count) => (count ? `Ela será removida de ${count} produto(s).` : ''),
    },
}

const storeUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

// ---------- Lista ----------
export function TermsList({ kind }) {
    const config = KINDS[kind]
    useDocumentTitle(`${config.title} · Admin`)
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')
    const terms = useAsync(() => listTerms(kind, { search: query }), [kind, query])
    const rows = terms.data || []

    // Tags: criação rápida direto na lista
    const [quickName, setQuickName] = useState('')
    const [quickSaving, setQuickSaving] = useState(false)

    useEffect(() => { setSearch(''); setQuery('') }, [kind])

    const quickAdd = async (event) => {
        event.preventDefault()
        const name = quickName.trim()
        if (!name) return
        setQuickSaving(true)
        try {
            await saveTerm(kind, null, { name, slug: slugify(name) })
            toast.show(`Tag "${name}" criada.`, 'success')
            setQuickName('')
            terms.reload()
        } catch (error) {
            toast.show(error.message, 'danger')
        } finally {
            setQuickSaving(false)
        }
    }

    const remove = async (term) => {
        const warning = config.deleteWarning(term.count)
        if (!window.confirm(`Excluir a ${config.singular} "${term.name}"? ${warning}`.trim())) return
        try {
            await deleteTerm(kind, term.id)
            if (term.image) removeUploadedImages([term.image]).catch(() => {})
            toast.show(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} excluída.`, 'success')
            config.afterChange()
            terms.reload()
        } catch (error) {
            toast.show(error.message, 'danger')
        }
    }

    const Icon = config.icon

    return (
        <>
            <DashHeader>
                <div>
                    <h1>{config.title}</h1>
                    <p>{config.description}</p>
                </div>
                <div className="actions">
                    <ButtonLink to={`${config.base}/nova`}><Plus size={20} weight="bold" /> {config.newLabel}</ButtonLink>
                </div>
            </DashHeader>

            {kind === 'tags' && (
                <Card>
                    <QuickAdd onSubmit={quickAdd}>
                        <Tag size={22} />
                        <Input value={quickName} onChange={(event) => setQuickName(event.target.value)} placeholder="Nome da nova tag" aria-label="Nome da nova tag" maxLength={60} />
                        <Button type="submit" disabled={!quickName.trim() || quickSaving}>{quickSaving ? <Spinner /> : <Plus size={18} weight="bold" />} Adicionar</Button>
                    </QuickAdd>
                </Card>
            )}

            <Card>
                <Toolbar onSubmit={(event) => { event.preventDefault(); setQuery(search.trim()) }}>
                    <Input type="search" placeholder={`Buscar ${config.title.toLowerCase()}`} value={search} onChange={(event) => setSearch(event.target.value)} aria-label={`Buscar ${config.title.toLowerCase()}`} />
                    <Button type="submit" $variant="secondary"><MagnifyingGlass size={18} /> Buscar</Button>
                </Toolbar>

                {terms.loading && !terms.data ? <Loader /> : terms.error ? <ErrorState error={terms.error} onRetry={terms.reload} /> : rows.length === 0 ? (
                    <EmptyState
                        icon={Icon}
                        title={query ? 'Nada encontrado' : `Nenhuma ${config.singular} cadastrada`}
                        action={!query && <ButtonLink to={`${config.base}/nova`}>{config.newLabel}</ButtonLink>}
                    />
                ) : (
                    <TermsTable>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th className="num">Produtos</th>
                                    {config.hasOrder && <th className="num">Ordem</th>}
                                    <th><span className="sr-only">Ações</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((term) => (
                                    <tr key={term.id}>
                                        <td>
                                            <NameCell to={`${config.base}/${term.id}`}>
                                                {config.hasImage && (
                                                    <span className="thumb">{term.image ? <img src={term.image.startsWith('http') ? term.image : storeUrl(term.image)} alt="" /> : <Icon size={20} />}</span>
                                                )}
                                                <span className="stack">
                                                    <strong>{term.name}</strong>
                                                    <small>{config.storePath}{term.slug}</small>
                                                </span>
                                            </NameCell>
                                        </td>
                                        <td><Description>{term.description || '—'}</Description></td>
                                        <td className="num">
                                            {term.count > 0
                                                ? <Link className="count" to={`/admin/produtos?${config.productFilter}=${term.id}`} title="Ver produtos no painel">{term.count}</Link>
                                                : <span className="muted">0</span>}
                                        </td>
                                        {config.hasOrder && <td className="num">{term.sort_order}</td>}
                                        <td>
                                            <RowActions>
                                                <a href={storeUrl(`${config.storePath}${term.slug}`)} target="_blank" rel="noreferrer" title="Ver na loja" aria-label={`Ver ${term.name} na loja`}><Eye size={20} /></a>
                                                <Link to={`${config.base}/${term.id}`} title="Editar" aria-label={`Editar ${term.name}`}><PencilSimple size={20} /></Link>
                                                <button type="button" className="danger" onClick={() => remove(term)} title="Excluir" aria-label={`Excluir ${term.name}`}><Trash size={20} /></button>
                                            </RowActions>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TermsTable>
                )}
            </Card>
        </>
    )
}

// ---------- Edição ----------
const emptyTerm = { name: '', slug: '', description: '', image: '', sort_order: '0' }

export function TermForm({ kind }) {
    const config = KINDS[kind]
    const { id } = useParams()
    const isNew = !id
    const navigate = useNavigate()
    const toast = useToast()
    useDocumentTitle(`${isNew ? config.newLabel : `Editar ${config.singular}`} · Admin`)

    const [form, setForm] = useState(emptyTerm)
    const [saved, setSaved] = useState(null)
    const [slugTouched, setSlugTouched] = useState(false)
    const [loading, setLoading] = useState(!isNew)
    const [loadError, setLoadError] = useState(null)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [discarded, setDiscarded] = useState([])

    useEffect(() => {
        if (isNew) return
        getTerm(kind, Number(id))
            .then((term) => {
                if (!term) throw new Error(`${config.singular} não encontrada.`)
                setSaved(term)
                setForm({
                    name: term.name,
                    slug: term.slug,
                    description: term.description || '',
                    image: term.image || '',
                    sort_order: String(term.sort_order ?? 0),
                })
                setSlugTouched(true)
            })
            .catch(setLoadError)
            .finally(() => setLoading(false))
    }, [kind, id, isNew, config.singular])

    if (loading) return <Loader />
    if (loadError) return <ErrorState error={loadError} />

    const set = (field) => (event) => {
        const value = event?.target ? event.target.value : event
        setForm((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'name' && !slugTouched ? { slug: slugify(value) } : {}),
        }))
        setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const next = {}
        if (!form.name.trim()) next.name = 'Informe o nome.'
        if (!SLUG_RE.test(form.slug)) next.slug = 'Use letras minúsculas, números e hífens.'
        setErrors(next)
        if (Object.keys(next).length) return
        setSaving(true)
        try {
            await saveTerm(kind, isNew ? null : Number(id), {
                name: form.name.trim(),
                slug: form.slug,
                description: form.description.trim() || null,
                ...(config.hasImage ? { image: form.image || null } : {}),
                ...(config.hasOrder ? { sort_order: Number(form.sort_order) || 0 } : {}),
            })
            removeUploadedImages(discarded.filter((url) => url !== form.image)).catch(() => {})
            config.afterChange()
            toast.show(isNew ? `${config.singular[0].toUpperCase()}${config.singular.slice(1)} criada!` : 'Alterações salvas!', 'success')
            navigate(config.base)
        } catch (error) {
            setErrors({ form: error.message })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        const warning = config.deleteWarning(saved?.count || 0)
        if (!window.confirm(`Excluir a ${config.singular} "${saved.name}"? ${warning}`.trim())) return
        try {
            await deleteTerm(kind, Number(id))
            removeUploadedImages([saved.image, ...discarded].filter(Boolean)).catch(() => {})
            config.afterChange()
            toast.show('Excluída.', 'success')
            navigate(config.base, { replace: true })
        } catch (error) {
            toast.show(error.message, 'danger')
        }
    }

    return (
        <>
            <DashHeader>
                <div>
                    <Link to={config.base} className="back"><ArrowLeft size={18} /> {config.title}</Link>
                    <h1>{isNew ? config.newLabel : saved?.name}</h1>
                </div>
                {!isNew && saved && (
                    <div className="actions">
                        <Button as="a" href={storeUrl(`${config.storePath}${saved.slug}`)} target="_blank" rel="noreferrer" $variant="ghost">
                            <Eye size={20} /> Ver na loja
                        </Button>
                    </div>
                )}
            </DashHeader>

            <Form onSubmit={handleSubmit} noValidate>
                <div className="main">
                    <Card>
                        <CardTitle>Informações</CardTitle>
                        <div className="fields">
                            <Field label="Nome" htmlFor="term-name" error={errors.name}>
                                <Input id="term-name" value={form.name} onChange={set('name')} maxLength={60} aria-invalid={!!errors.name} />
                            </Field>
                            <Field label="Slug (endereço)" htmlFor="term-slug" error={errors.slug} hint={`${config.storePath}${form.slug || '...'}`}>
                                <Input
                                    id="term-slug"
                                    value={form.slug}
                                    onChange={(event) => { setSlugTouched(true); set('slug')(slugify(event.target.value)) }}
                                    aria-invalid={!!errors.slug}
                                />
                            </Field>
                            <Field label="Descrição" htmlFor="term-description" hint="Aparece no topo da página na loja.">
                                <Textarea id="term-description" rows={4} value={form.description} onChange={set('description')} maxLength={500} />
                            </Field>
                        </div>
                    </Card>

                    {config.hasImage && (
                        <Card>
                            <CardTitle>Imagem</CardTitle>
                            <ImageField
                                id="term-image"
                                folder="categories"
                                value={form.image}
                                onChange={(url) => set('image')(url)}
                                onRemoved={(url) => url && setDiscarded((prev) => [...prev, url])}
                                ratio="1 / 1"
                                hint="Opcional. Quadrada (ex.: 600 × 600 px), usada no topo da página da categoria."
                            />
                        </Card>
                    )}
                </div>

                <div className="side">
                    {!isNew && saved && (
                        <Card>
                            <CardTitle>Resumo</CardTitle>
                            <Summary>
                                <strong>{saved.count}</strong>
                                <span>{saved.count === 1 ? 'produto' : 'produtos'}</span>
                            </Summary>
                            {saved.count > 0 && (
                                <ButtonLink to={`/admin/produtos?${config.productFilter}=${saved.id}`} $variant="secondary" $size="sm" $block>
                                    Ver produtos no painel
                                </ButtonLink>
                            )}
                        </Card>
                    )}
                    {config.hasOrder && (
                        <Card>
                            <CardTitle>Menu</CardTitle>
                            <Field label="Ordem no menu" htmlFor="term-order" hint="Menor número aparece primeiro.">
                                <Input id="term-order" type="number" value={form.sort_order} onChange={set('sort_order')} />
                            </Field>
                        </Card>
                    )}
                    {errors.form && <Alert $tone="danger">{errors.form}</Alert>}
                    <Button type="submit" $size="lg" $block disabled={saving}>
                        {saving ? <><Spinner /> Salvando...</> : isNew ? `Criar ${config.singular}` : 'Salvar alterações'}
                    </Button>
                    {!isNew && <Button type="button" $variant="danger" $block onClick={handleDelete}>Excluir {config.singular}</Button>}
                </div>
            </Form>
        </>
    )
}

const TermsTable = styled(TableScroll)`
    .count { font-weight: 600; color: var(--primary); &:hover { text-decoration: underline; } }
    .muted { color: var(--gray-100); }
`

const QuickAdd = styled.form`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    > svg { color: var(--primary); flex-shrink: 0; }
    input { flex: 1; }
`

const NameCell = styled(Link)`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    min-width: 22rem;
    .thumb {
        width: 4rem;
        height: 4rem;
        border-radius: 0.8rem;
        background: var(--primary-50);
        color: var(--primary);
        display: grid;
        place-items: center;
        overflow: hidden;
        flex-shrink: 0;
        img { width: 100%; height: 100%; object-fit: cover; }
    }
    .stack { display: flex; flex-direction: column; }
    strong { color: var(--gray-700); font-weight: 600; }
    small { color: var(--gray-200); font-size: 1.25rem; }
    &:hover strong { color: var(--primary); }
`

const Description = styled.span`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 40rem;
    color: var(--gray-300);
    font-size: 1.35rem;
`

const RowActions = styled.div`
    display: flex;
    gap: 0.4rem;
    justify-content: flex-end;
    a, button {
        display: grid;
        place-items: center;
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 0.8rem;
        color: var(--gray-300);
        transition: background .2s ease, color .2s ease;
        &:hover { background: var(--primary-50); color: var(--primary); }
        &.danger:hover { background: var(--danger-50); color: var(--danger); }
    }
`

const Form = styled.form`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 32rem;
    gap: 2.4rem;
    align-items: start;
    .main, .side { display: flex; flex-direction: column; gap: 2.4rem; }
    .side { position: sticky; top: 8.8rem; }
    .fields { display: flex; flex-direction: column; gap: 1.6rem; }
    @media (max-width: 1100px) {
        grid-template-columns: 1fr;
        .side { position: static; }
    }
`

const Summary = styled.div`
    display: flex;
    align-items: baseline;
    gap: 0.8rem;
    margin-bottom: 1.6rem;
    strong { font-family: var(--font-red-hat); font-size: 3.2rem; color: var(--gray-800); }
    span { color: var(--gray-300); }
`
