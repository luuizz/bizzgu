import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowSquareOut, LinkSimple, Trash, UploadSimple } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { ProductImage } from '../../components/product/ProductImage'
import { Alert, Button, Card, Checkbox, ErrorState, Field, Input, Loader, Select, Spinner, Textarea } from '../../components/ui'
import { useCategories } from '../../hooks/useCategories'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { canUploadImages, deleteProduct, getProductById, removeProductImages, saveProduct, uploadProductImage } from '../../services/admin'
import { slugify } from '../../lib/format'

const empty = {
    name: '',
    slug: '',
    category_id: '',
    description: '',
    price: '',
    compare_at_price: '',
    stock: '0',
    images: [],
    featured: false,
    active: true,
}

const MAX_IMAGES = 6
const MAX_SIZE = 4 * 1024 * 1024

export function ProductForm() {
    const { id } = useParams()
    const isNew = !id
    const navigate = useNavigate()
    const toast = useToast()
    const categories = useCategories()
    const fileInput = useRef(null)

    const [form, setForm] = useState(empty)
    const [slugTouched, setSlugTouched] = useState(false)
    const [loading, setLoading] = useState(!isNew)
    const [loadError, setLoadError] = useState(null)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(0)
    const [removedUploads, setRemovedUploads] = useState([])
    const [imageLink, setImageLink] = useState('')

    useDocumentTitle(isNew ? 'Novo produto · Admin' : 'Editar produto · Admin')

    useEffect(() => {
        if (isNew) return
        getProductById(Number(id))
            .then((product) => {
                if (!product) throw new Error('Produto não encontrado.')
                setForm({
                    ...product,
                    category_id: product.category_id ?? '',
                    description: product.description ?? '',
                    price: String(product.price),
                    compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
                    stock: String(product.stock),
                })
                setSlugTouched(true)
            })
            .catch(setLoadError)
            .finally(() => setLoading(false))
    }, [id, isNew])

    if (loading) return <Loader />
    if (loadError) return <ErrorState error={loadError} />

    const set = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
        setForm((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'name' && !slugTouched ? { slug: slugify(value) } : {}),
        }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handleFiles = async (files) => {
        const list = [...files].slice(0, MAX_IMAGES - form.images.length)
        const invalid = list.find((file) => !file.type.startsWith('image/') || file.size > MAX_SIZE)
        if (invalid) {
            toast.show('Envie apenas imagens de até 4 MB.', 'danger')
            return
        }
        setUploading(list.length)
        for (const file of list) {
            try {
                const url = await uploadProductImage(file)
                setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
            } catch (error) {
                toast.show(`Falha ao enviar ${file.name}: ${error.message}`, 'danger')
            } finally {
                setUploading((count) => count - 1)
            }
        }
    }

    const addImageLink = () => {
        const url = imageLink.trim()
        if (!/^https?:\/\/\S+$/.test(url)) {
            toast.show('Cole um link começando com https://', 'danger')
            return
        }
        if (form.images.includes(url)) return setImageLink('')
        setForm((prev) => ({ ...prev, images: [...prev.images, url].slice(0, MAX_IMAGES) }))
        setImageLink('')
    }

    const removeImage = (url) => {
        setForm((prev) => ({ ...prev, images: prev.images.filter((image) => image !== url) }))
        setRemovedUploads((prev) => [...prev, url])
    }

    const moveImage = (index, direction) => {
        setForm((prev) => {
            const images = [...prev.images]
            const target = index + direction
            ;[images[index], images[target]] = [images[target], images[index]]
            return { ...prev, images }
        })
    }

    const validate = () => {
        const next = {}
        if (form.name.trim().length < 3) next.name = 'Informe o nome do produto.'
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) next.slug = 'Use letras minúsculas, números e hífens.'
        const price = Number(form.price)
        if (!(price >= 0) || form.price === '') next.price = 'Preço inválido.'
        if (form.compare_at_price && Number(form.compare_at_price) <= price) next.compare_at_price = 'Deve ser maior que o preço.'
        if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) next.stock = 'Estoque inválido.'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!validate()) return
        setSaving(true)
        try {
            const saved = await saveProduct(isNew ? null : Number(id), {
                name: form.name.trim(),
                slug: form.slug,
                category_id: form.category_id ? Number(form.category_id) : null,
                description: form.description.trim() || null,
                price: Number(form.price),
                compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
                stock: Number(form.stock),
                images: form.images,
                featured: form.featured,
                active: form.active,
            })
            // Só apaga do Storage as imagens removidas depois que o produto foi salvo
            removeProductImages(removedUploads).catch(() => {})
            toast.show(isNew ? 'Produto cadastrado!' : 'Produto atualizado!', 'success')
            navigate(isNew ? `/admin/produtos/${saved.id}` : '/admin/produtos', { replace: isNew })
            if (isNew) setRemovedUploads([])
        } catch (error) {
            setErrors({ form: error.message })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Excluir "${form.name}"? Pedidos antigos continuam com o registro do item. Para só tirar da loja, desative o produto.`)) return
        try {
            await deleteProduct(Number(id))
            removeProductImages(form.images).catch(() => {})
            toast.show('Produto excluído.', 'success')
            navigate('/admin/produtos', { replace: true })
        } catch (error) {
            toast.show(error.message, 'danger')
        }
    }

    return (
        <>
            <DashHeader>
                <div>
                    <Link to="/admin/produtos" className="back"><ArrowLeft size={18} /> Produtos</Link>
                    <h1>{isNew ? 'Novo produto' : form.name}</h1>
                </div>
                {!isNew && form.active && (
                    <div className="actions">
                        <Button as={Link} to={`/produto/${form.slug}`} target="_blank" $variant="ghost"><ArrowSquareOut size={20} /> Ver na loja</Button>
                    </div>
                )}
            </DashHeader>

            <Form onSubmit={handleSubmit} noValidate>
                <div className="main">
                    <Card>
                        <CardTitle>Informações</CardTitle>
                        <div className="fields">
                            <Field label="Nome" htmlFor="name" error={errors.name}>
                                <Input id="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
                            </Field>
                            <Field label="Slug (endereço)" htmlFor="slug" error={errors.slug} hint={`/produto/${form.slug || '...'}`}>
                                <Input
                                    id="slug"
                                    value={form.slug}
                                    onChange={(event) => { setSlugTouched(true); set('slug')({ target: { value: slugify(event.target.value), type: 'text' } }) }}
                                    aria-invalid={!!errors.slug}
                                />
                            </Field>
                            <Field label="Descrição" htmlFor="description">
                                <Textarea id="description" rows={6} value={form.description} onChange={set('description')} />
                            </Field>
                        </div>
                    </Card>

                    <Card>
                        <CardTitle>Imagens</CardTitle>
                        <Gallery>
                            {form.images.map((url, index) => (
                                <li key={url}>
                                    <div className="img"><ProductImage src={url} alt={`Imagem ${index + 1}`} /></div>
                                    {index === 0 && <span className="cover">Capa</span>}
                                    <div className="tools">
                                        <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label="Mover para a esquerda"><ArrowLeft size={16} weight="bold" /></button>
                                        <button type="button" onClick={() => removeImage(url)} aria-label="Remover imagem"><Trash size={16} /></button>
                                        <button type="button" onClick={() => moveImage(index, 1)} disabled={index === form.images.length - 1} aria-label="Mover para a direita"><ArrowRight size={16} weight="bold" /></button>
                                    </div>
                                </li>
                            ))}
                            {Array.from({ length: uploading }, (_, index) => (
                                <li key={`up-${index}`} className="uploading"><Spinner $size={2.4} /></li>
                            ))}
                            {canUploadImages && form.images.length + uploading < MAX_IMAGES && (
                                <li>
                                    <button
                                        type="button"
                                        className="add"
                                        onClick={() => fileInput.current?.click()}
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={(event) => { event.preventDefault(); handleFiles(event.dataTransfer.files) }}
                                    >
                                        <UploadSimple size={32} />
                                        <span>Adicionar imagens</span>
                                    </button>
                                </li>
                            )}
                        </Gallery>
                        {canUploadImages && (
                            <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(event) => { handleFiles(event.target.files); event.target.value = '' }} />
                        )}
                        {form.images.length < MAX_IMAGES && (
                            <LinkRow>
                                <Input
                                    type="url"
                                    placeholder="https://... (link de uma imagem)"
                                    aria-label="Link da imagem"
                                    value={imageLink}
                                    onChange={(event) => setImageLink(event.target.value)}
                                    onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addImageLink() } }}
                                />
                                <Button type="button" $variant="secondary" onClick={addImageLink}><LinkSimple size={20} /> Adicionar link</Button>
                            </LinkRow>
                        )}
                        <p className="help">
                            Até {MAX_IMAGES} imagens. A primeira é a capa.{' '}
                            {canUploadImages
                                ? 'Envie arquivos (JPG, PNG ou WebP, máx. 4 MB) ou cole o link de uma imagem.'
                                : 'Cole o link de uma imagem já publicada. Para enviar arquivos, configure a função de upload (veja o README).'}
                        </p>
                    </Card>
                </div>

                <div className="side">
                    <Card>
                        <CardTitle>Preço e estoque</CardTitle>
                        <div className="fields">
                            <Field label="Preço (R$)" htmlFor="price" error={errors.price}>
                                <Input id="price" type="number" step="0.01" min="0" inputMode="decimal" value={form.price} onChange={set('price')} aria-invalid={!!errors.price} />
                            </Field>
                            <Field label="Preço “de” (R$)" htmlFor="compare_at_price" error={errors.compare_at_price} hint="Opcional. Mostra o desconto riscado.">
                                <Input id="compare_at_price" type="number" step="0.01" min="0" inputMode="decimal" value={form.compare_at_price} onChange={set('compare_at_price')} aria-invalid={!!errors.compare_at_price} />
                            </Field>
                            <Field label="Estoque" htmlFor="stock" error={errors.stock}>
                                <Input id="stock" type="number" step="1" min="0" inputMode="numeric" value={form.stock} onChange={set('stock')} aria-invalid={!!errors.stock} />
                            </Field>
                        </div>
                    </Card>

                    <Card>
                        <CardTitle>Organização</CardTitle>
                        <div className="fields">
                            <Field label="Categoria" htmlFor="category">
                                <Select id="category" value={form.category_id} onChange={set('category_id')}>
                                    <option value="">Sem categoria</option>
                                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                </Select>
                            </Field>
                            <Checkbox label="Ativo (visível na loja)" checked={form.active} onChange={set('active')} />
                            <Checkbox label="Destaque na página inicial" checked={form.featured} onChange={set('featured')} />
                        </div>
                    </Card>

                    {errors.form && <Alert $tone="danger">{errors.form}</Alert>}
                    <Button type="submit" $size="lg" $block disabled={saving || uploading > 0}>
                        {saving ? <><Spinner /> Salvando...</> : isNew ? 'Cadastrar produto' : 'Salvar alterações'}
                    </Button>
                    {!isNew && <Button type="button" $variant="danger" $block onClick={handleDelete}>Excluir produto</Button>}
                </div>
            </Form>
        </>
    )
}

const Form = styled.form`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 32rem;
    gap: 2.4rem;
    align-items: start;
    .main, .side { display: flex; flex-direction: column; gap: 2.4rem; }
    .side { position: sticky; top: 2.4rem; }
    .fields { display: flex; flex-direction: column; gap: 1.6rem; }
    .help { font-size: 1.3rem; color: var(--gray-200); margin-top: 1.6rem; }
    @media (max-width: 1100px) {
        grid-template-columns: 1fr;
        .side { position: static; }
    }
`

const LinkRow = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.6rem;
    input { flex: 1; }
    @media (max-width: 600px) { flex-direction: column; }
`

const Gallery = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
    gap: 1.2rem;
    li {
        position: relative;
        aspect-ratio: 1;
        border-radius: 1rem;
        background: var(--white-600);
        overflow: hidden;
        &.uploading { display: flex; align-items: center; justify-content: center; color: var(--primary); }
        &:hover .tools { opacity: 1; }
    }
    .img { width: 100%; height: 100%; padding: 0.8rem; }
    .cover {
        position: absolute;
        top: 0.8rem;
        left: 0.8rem;
        background: var(--primary);
        color: var(--white);
        font-size: 1.1rem;
        font-weight: 700;
        padding: 0.3rem 0.8rem;
        border-radius: 2rem;
    }
    .tools {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        padding: 0.6rem;
        background: linear-gradient(transparent, rgba(16, 7, 23, 0.6));
        opacity: 0;
        transition: opacity .2s ease;
        button {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: var(--white);
            color: var(--gray-700);
            display: grid;
            place-items: center;
            &:disabled { opacity: 0.4; }
        }
        @media (hover: none) { opacity: 1; }
    }
    .add {
        width: 100%;
        height: 100%;
        border: 0.2rem dashed var(--gray-100);
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        color: var(--gray-300);
        transition: border-color .2s ease, color .2s ease;
        span { font-size: 1.3rem; }
        &:hover { border-color: var(--primary); color: var(--primary); }
    }
`
