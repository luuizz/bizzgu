import { useEffect, useState } from 'react'
import { ArrowLeft, Desktop, DeviceMobile, ImageSquare, TextAa } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { ImageField } from '../../components/admin/ImageField'
import { BannerContent } from '../../components/Slider'
import { StyleSlide } from '../../components/Slider/style'
import { Alert, Badge, Button, Card, Checkbox, ErrorState, Field, Input, Loader, Spinner } from '../../components/ui'
import { bannerStatus } from '../../lib/banners'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { deleteBanner, getBannerById, removeUploadedImages, saveBanner } from '../../services/admin'
import { imageUrl } from '../../lib/format'

const empty = {
    layout: 'image',
    title: '',
    subtitle: '',
    cta_label: '',
    link: '',
    image: '',
    image_mobile: '',
    active: true,
    starts_at: '',
    ends_at: '',
}

// <input type="datetime-local"> trabalha com horário local sem fuso
const toLocalInput = (iso) => {
    if (!iso) return ''
    const date = new Date(iso)
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}
const fromLocalInput = (value) => (value ? new Date(value).toISOString() : null)

export function BannerForm() {
    const { id } = useParams()
    const isNew = !id
    const navigate = useNavigate()
    const toast = useToast()
    useDocumentTitle(isNew ? 'Novo banner · Admin' : 'Editar banner · Admin')

    const [form, setForm] = useState(empty)
    const [loading, setLoading] = useState(!isNew)
    const [loadError, setLoadError] = useState(null)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [device, setDevice] = useState('desktop')
    // Imagens trocadas/removidas: apagadas do Blob só depois de salvar
    const [discarded, setDiscarded] = useState([])

    useEffect(() => {
        if (isNew) return
        getBannerById(Number(id))
            .then((banner) => {
                if (!banner) throw new Error('Banner não encontrado.')
                setForm({
                    ...empty,
                    ...Object.fromEntries(Object.entries(banner).map(([key, value]) => [key, value ?? ''])),
                    active: banner.active,
                    starts_at: toLocalInput(banner.starts_at),
                    ends_at: toLocalInput(banner.ends_at),
                })
            })
            .catch(setLoadError)
            .finally(() => setLoading(false))
    }, [id, isNew])

    if (loading) return <Loader />
    if (loadError) return <ErrorState error={loadError} />

    const set = (field) => (event) => {
        const value = event?.target ? (event.target.type === 'checkbox' ? event.target.checked : event.target.value) : event
        setForm((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
    }
    const discard = (url) => url && setDiscarded((prev) => [...prev, url])

    const validate = () => {
        const next = {}
        if (!form.title.trim()) next.title = form.layout === 'image' ? 'Descreva o banner (usado para acessibilidade).' : 'Informe o título.'
        if (form.layout === 'image' && !form.image) next.image = 'Envie a arte do banner.'
        if (form.link && !/^(\/|https:\/\/)\S*$/.test(form.link.trim())) next.link = 'Use um caminho da loja (ex.: /categoria/games) ou um link https://'
        if (form.layout === 'text' && form.cta_label.trim() && !form.link.trim()) next.link = 'O botão precisa de um link.'
        if (form.starts_at && form.ends_at && form.starts_at >= form.ends_at) next.ends_at = 'O fim precisa ser depois do início.'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!validate()) return
        setSaving(true)
        try {
            const isText = form.layout === 'text'
            await saveBanner(isNew ? null : Number(id), {
                layout: form.layout,
                title: form.title.trim(),
                subtitle: isText ? form.subtitle.trim() || null : null,
                cta_label: isText ? form.cta_label.trim() || null : null,
                link: form.link.trim() || null,
                image: form.image || null,
                image_mobile: isText ? null : form.image_mobile || null,
                active: form.active,
                starts_at: fromLocalInput(form.starts_at),
                ends_at: fromLocalInput(form.ends_at),
            })
            const keep = new Set([form.image, isText ? null : form.image_mobile])
            removeUploadedImages(discarded.filter((url) => !keep.has(url))).catch(() => {})
            toast.show(isNew ? 'Banner criado!' : 'Banner atualizado!', 'success')
            navigate('/admin/banners')
        } catch (error) {
            setErrors({ form: error.message })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Excluir o banner "${form.title}"?`)) return
        try {
            await deleteBanner(Number(id))
            removeUploadedImages([form.image, form.image_mobile, ...discarded].filter(Boolean)).catch(() => {})
            toast.show('Banner excluído.', 'success')
            navigate('/admin/banners', { replace: true })
        } catch (error) {
            toast.show(error.message, 'danger')
        }
    }

    const preview = {
        ...form,
        title: form.title || (form.layout === 'text' ? 'Título do banner' : 'Banner'),
        subtitle: form.subtitle || (form.layout === 'text' ? 'Subtítulo com a oferta ou a mensagem' : ''),
        // Na prévia o link não navega (cliques são bloqueados no quadro da prévia)
        link: form.link || '#',
        cta_label: form.cta_label,
    }
    const status = bannerStatus({
        active: form.active,
        starts_at: fromLocalInput(form.starts_at),
        ends_at: fromLocalInput(form.ends_at),
    })
    const mobileImage = form.image_mobile || form.image

    return (
        <>
            <DashHeader>
                <div>
                    <Link to="/admin/banners" className="back"><ArrowLeft size={18} /> Banners</Link>
                    <h1>{isNew ? 'Novo banner' : 'Editar banner'}</h1>
                </div>
                <div className="actions"><Badge $tone={status.tone}>{status.label}</Badge></div>
            </DashHeader>

            <Card>
                <PreviewHead>
                    <CardTitle>Pré-visualização</CardTitle>
                    <div className="devices" role="group" aria-label="Dispositivo da prévia">
                        <button type="button" className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}><Desktop size={18} /> Computador</button>
                        <button type="button" className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')}><DeviceMobile size={18} /> Celular</button>
                    </div>
                </PreviewHead>
                {device === 'desktop' ? (
                    <PreviewDesktop onClickCapture={(event) => event.preventDefault()}>
                        <StyleSlide as="div" className="frame">
                            <BannerContent banner={preview} eager />
                            {preview.layout === 'image' && !preview.image && <div className="placeholder">A arte do banner aparece aqui</div>}
                            {form.link && <span className="cta-note">{preview.layout === 'text' ? 'O botão leva para' : 'O banner leva para'}: {form.link}</span>}
                        </StyleSlide>
                    </PreviewDesktop>
                ) : (
                    <PreviewMobile onClickCapture={(event) => event.preventDefault()}>
                        <StyleSlide as="div" className="phone">
                            {preview.layout === 'image'
                                ? (mobileImage ? <img src={imageUrl(mobileImage)} alt="" /> : <div className="placeholder">Sem arte</div>)
                                : <BannerContent banner={preview} eager />}
                        </StyleSlide>
                        <p>{preview.layout === 'image' && !form.image_mobile ? 'Sem arte para celular: a de computador é cortada para caber.' : 'Como aparece numa tela de celular.'}</p>
                    </PreviewMobile>
                )}
            </Card>

            <Form onSubmit={handleSubmit} noValidate>
                <div className="main">
                    <Card>
                        <CardTitle>Formato</CardTitle>
                        <Layouts role="radiogroup" aria-label="Formato do banner">
                            {[
                                { value: 'image', icon: ImageSquare, title: 'Arte pronta', text: 'Você sobe a imagem já com o texto (ex.: feita no Figma). O banner inteiro vira um link.' },
                                { value: 'text', icon: TextAa, title: 'Texto + imagem', text: 'Título, subtítulo e botão sobre o fundo da marca, com uma imagem opcional ao lado.' },
                            ].map(({ value, icon: Icon, title, text }) => (
                                <label key={value} className={form.layout === value ? 'on' : ''}>
                                    <input type="radio" name="layout" value={value} checked={form.layout === value} onChange={set('layout')} />
                                    <Icon size={28} />
                                    <strong>{title}</strong>
                                    <span>{text}</span>
                                </label>
                            ))}
                        </Layouts>
                    </Card>

                    <Card>
                        <CardTitle>Conteúdo</CardTitle>
                        <div className="fields">
                            <Field
                                label={form.layout === 'image' ? 'Descrição do banner' : 'Título'}
                                htmlFor="title"
                                error={errors.title}
                                hint={form.layout === 'image' ? 'Não aparece na arte: é lido por leitores de tela e buscadores.' : undefined}
                            >
                                <Input id="title" value={form.title} onChange={set('title')} maxLength={120} aria-invalid={!!errors.title} />
                            </Field>
                            {form.layout === 'text' && (
                                <>
                                    <Field label="Subtítulo" htmlFor="subtitle">
                                        <Input id="subtitle" value={form.subtitle} onChange={set('subtitle')} maxLength={200} />
                                    </Field>
                                    <Field label="Texto do botão" htmlFor="cta" hint="Deixe vazio para não mostrar botão.">
                                        <Input id="cta" value={form.cta_label} onChange={set('cta_label')} maxLength={40} placeholder="Ex.: Ver ofertas" />
                                    </Field>
                                </>
                            )}
                            <Field
                                label={form.layout === 'image' ? 'Link do banner' : 'Link do botão'}
                                htmlFor="link"
                                error={errors.link}
                                hint="Página da loja (ex.: /categoria/games, /produto/playstation-5) ou um link https://"
                            >
                                <Input id="link" value={form.link} onChange={set('link')} placeholder="/categoria/..." aria-invalid={!!errors.link} />
                            </Field>
                        </div>
                    </Card>

                    <Card>
                        <CardTitle>{form.layout === 'image' ? 'Artes' : 'Imagem ao lado do texto'}</CardTitle>
                        {form.layout === 'image' ? (
                            <Images>
                                <div>
                                    <h3>Computador {errors.image && <em>· {errors.image}</em>}</h3>
                                    <ImageField
                                        id="image"
                                        folder="banners"
                                        value={form.image}
                                        onChange={(url) => set('image')(url)}
                                        onRemoved={discard}
                                        ratio="4.4 / 1"
                                        hint="Recomendado: 1920 × 436 px, JPG ou WebP até 4 MB."
                                    />
                                </div>
                                <div className="mobile">
                                    <h3>Celular <small>(opcional)</small></h3>
                                    <ImageField
                                        id="image_mobile"
                                        folder="banners"
                                        value={form.image_mobile}
                                        onChange={(url) => set('image_mobile')(url)}
                                        onRemoved={discard}
                                        ratio="1.15 / 1"
                                        hint="Recomendado: 1080 × 940 px."
                                    />
                                </div>
                            </Images>
                        ) : (
                            <ImageField
                                id="image"
                                folder="banners"
                                value={form.image}
                                onChange={(url) => set('image')(url)}
                                onRemoved={discard}
                                ratio="1.6 / 1"
                                hint="PNG com fundo transparente fica melhor (ex.: foto do produto recortada). Não aparece no celular."
                            />
                        )}
                    </Card>
                </div>

                <div className="side">
                    <Card>
                        <CardTitle>Publicação</CardTitle>
                        <div className="fields">
                            <Checkbox label="Ativo" checked={form.active} onChange={set('active')} />
                            <Field label="Começa em" htmlFor="starts_at" hint="Opcional. Vazio: entra no ar ao salvar.">
                                <Input id="starts_at" type="datetime-local" value={form.starts_at} onChange={set('starts_at')} />
                            </Field>
                            <Field label="Termina em" htmlFor="ends_at" error={errors.ends_at} hint="Opcional. Vazio: fica no ar até você desativar.">
                                <Input id="ends_at" type="datetime-local" value={form.ends_at} onChange={set('ends_at')} aria-invalid={!!errors.ends_at} />
                            </Field>
                        </div>
                    </Card>

                    {errors.form && <Alert $tone="danger">{errors.form}</Alert>}
                    <Button type="submit" $size="lg" $block disabled={saving}>
                        {saving ? <><Spinner /> Salvando...</> : isNew ? 'Criar banner' : 'Salvar alterações'}
                    </Button>
                    {!isNew && <Button type="button" $variant="danger" $block onClick={handleDelete}>Excluir banner</Button>}
                </div>
            </Form>
        </>
    )
}

const PreviewHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.6rem;
    flex-wrap: wrap;
    margin-bottom: 1.6rem;
    h2 { margin: 0; }
    .devices {
        display: inline-flex;
        background: var(--white-600);
        border-radius: 1rem;
        padding: 0.4rem;
        button {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.6rem 1.2rem;
            border-radius: 0.7rem;
            font-size: 1.35rem;
            color: var(--gray-300);
            &.on { background: var(--white); color: var(--primary); font-weight: 600; box-shadow: var(--shadow-sm); }
        }
    }
`

const PreviewDesktop = styled.div`
    border-radius: 1.2rem;
    overflow: hidden;
    .frame { position: relative; --banner-height: 30rem; }
    /* na prévia o banner é menor que na home */
    .banner-text .left { width: 46rem; h2 { font-size: 3.8rem; } span { font-size: 1.9rem; } .btn-primary { margin-top: 2.4rem; } }
    .banner-text .right img { max-width: 44rem; }
    .placeholder, .cta-note {
        position: absolute;
        font-size: 1.3rem;
    }
    .placeholder { inset: 0; display: grid; place-items: center; color: var(--gray-100); }
    .cta-note { right: 1.2rem; bottom: 1rem; color: var(--gray-100); background: rgba(0, 0, 0, 0.35); padding: 0.4rem 0.8rem; border-radius: 0.6rem; }
`

const PreviewMobile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    .phone {
        --banner-height: 34rem;
        width: 39rem;
        max-width: 100%;
        border-radius: 2.4rem;
        overflow: hidden;
        border: 0.6rem solid var(--gray-500);
        > img { display: block; width: 100%; height: var(--banner-height); object-fit: cover; }
        .placeholder { height: var(--banner-height); display: grid; place-items: center; color: var(--gray-100); background: var(--gray-500); }
        .banner-text .left { width: 100%; padding: 0 2.4rem; h2 { font-size: 3rem; } span { font-size: 1.7rem; } .btn-primary { margin-top: 2rem; } }
        .banner-text .right { display: none; }
    }
    p { font-size: 1.3rem; color: var(--gray-200); }
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

const Layouts = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.2rem;
    label {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        padding: 1.6rem;
        border: 0.15rem solid var(--gray-50);
        border-radius: 1.2rem;
        cursor: pointer;
        color: var(--gray-300);
        transition: border-color .2s ease, background .2s ease;
        input { position: absolute; opacity: 0; pointer-events: none; }
        strong { color: var(--gray-800); font-size: 1.5rem; }
        span { font-size: 1.3rem; line-height: 1.45; }
        &.on { border-color: var(--primary); background: var(--primary-50); svg { color: var(--primary); } }
        &:has(input:focus-visible) { outline: 0.2rem solid var(--primary); outline-offset: 0.2rem; }
    }
    @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const Images = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 2rem;
    h3 { font-size: 1.4rem; margin-bottom: 0.8rem; color: var(--gray-700); }
    h3 small { font-weight: 400; color: var(--gray-200); }
    h3 em { font-style: normal; font-weight: 500; color: var(--danger); }
    @media (max-width: 800px) { grid-template-columns: 1fr; }
`
