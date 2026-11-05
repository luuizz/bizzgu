import { useEffect, useState } from 'react'
import { ArrowLeft, Desktop, DeviceMobile } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { ImageField } from '../../components/admin/ImageField'
import { BannerContent } from '../../components/Slider'
import { Alert, Badge, Button, Card, Checkbox, ErrorState, Field, Input, Loader, Spinner } from '../../components/ui'
import { BANNER_SIZES, bannerStatus } from '../../lib/banners'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { deleteBanner, getBannerById, removeUploadedImages, saveBanner } from '../../services/admin'

const empty = {
    title: '',
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
        if (!form.title.trim()) next.title = 'Descreva o banner (usado por leitores de tela e buscadores).'
        if (!form.image) next.image = 'Envie a arte para computador.'
        if (!form.image_mobile) next.image_mobile = 'Envie a arte para celular.'
        if (form.link && !/^(\/|https:\/\/)\S*$/.test(form.link.trim())) next.link = 'Use um caminho da loja (ex.: /categoria/games) ou um link https://'
        if (form.starts_at && form.ends_at && form.starts_at >= form.ends_at) next.ends_at = 'O fim precisa ser depois do início.'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!validate()) return
        setSaving(true)
        try {
            await saveBanner(isNew ? null : Number(id), {
                title: form.title.trim(),
                link: form.link.trim() || null,
                image: form.image,
                image_mobile: form.image_mobile,
                active: form.active,
                starts_at: fromLocalInput(form.starts_at),
                ends_at: fromLocalInput(form.ends_at),
            })
            const keep = new Set([form.image, form.image_mobile])
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

    const status = bannerStatus({
        active: form.active,
        starts_at: fromLocalInput(form.starts_at),
        ends_at: fromLocalInput(form.ends_at),
    })

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
                <PreviewFrame $device={device} onClickCapture={(event) => event.preventDefault()}>
                    {(device === 'desktop' ? form.image : form.image_mobile)
                        ? <BannerContent banner={form} device={device} eager />
                        : <div className="placeholder">Envie a arte para {device === 'desktop' ? 'computador' : 'celular'} ({BANNER_SIZES[device]})</div>}
                </PreviewFrame>
                {form.link && <LinkNote>Ao clicar, o visitante vai para <code>{form.link}</code></LinkNote>}
            </Card>

            <Form onSubmit={handleSubmit} noValidate>
                <div className="main">
                    <Card>
                        <CardTitle>Artes</CardTitle>
                        <Images>
                            <div>
                                <h3>Computador {errors.image && <em>· {errors.image}</em>}</h3>
                                <ImageField
                                    id="image"
                                    folder="banners"
                                    value={form.image}
                                    onChange={(url) => set('image')(url)}
                                    onRemoved={discard}
                                    ratio="4 / 1"
                                    hint={`${BANNER_SIZES.desktop} · JPG ou WebP até 4 MB. Deixe o texto no centro: em telas menores a arte só diminui, não é cortada.`}
                                />
                            </div>
                            <div>
                                <h3>Celular {errors.image_mobile && <em>· {errors.image_mobile}</em>}</h3>
                                <ImageField
                                    id="image_mobile"
                                    folder="banners"
                                    value={form.image_mobile}
                                    onChange={(url) => set('image_mobile')(url)}
                                    onRemoved={discard}
                                    ratio="1 / 1"
                                    hint={`${BANNER_SIZES.mobile} · usada em telas de até 700 px.`}
                                />
                            </div>
                        </Images>
                    </Card>

                    <Card>
                        <CardTitle>Informações</CardTitle>
                        <div className="fields">
                            <Field label="Descrição do banner" htmlFor="title" error={errors.title} hint="Não aparece na arte: é lida por leitores de tela e buscadores. Ex.: Black Friday: até 40% off em games.">
                                <Input id="title" value={form.title} onChange={set('title')} maxLength={120} aria-invalid={!!errors.title} />
                            </Field>
                            <Field label="Link" htmlFor="link" error={errors.link} hint="Página da loja (ex.: /categoria/games, /produto/playstation-5, /busca?ofertas=1) ou um link https://">
                                <Input id="link" value={form.link} onChange={set('link')} placeholder="/categoria/..." aria-invalid={!!errors.link} />
                            </Field>
                        </div>
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

const PreviewFrame = styled.div`
    margin: 0 auto;
    width: ${({ $device }) => ($device === 'mobile' ? '36rem' : '100%')};
    max-width: 100%;
    border-radius: ${({ $device }) => ($device === 'mobile' ? '2.4rem' : '1.2rem')};
    border: ${({ $device }) => ($device === 'mobile' ? '0.6rem solid var(--gray-500)' : '0')};
    overflow: hidden;
    background: var(--white-600);
    aspect-ratio: ${({ $device }) => ($device === 'mobile' ? '1 / 1' : '4 / 1')};
    .banner, img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .placeholder { height: 100%; display: grid; place-items: center; text-align: center; padding: 1.6rem; color: var(--gray-200); font-size: 1.4rem; }
`

const LinkNote = styled.p`
    margin-top: 1.2rem;
    font-size: 1.35rem;
    color: var(--gray-300);
    text-align: center;
    code { font-size: 1.3rem; background: var(--white-600); padding: 0.2rem 0.6rem; border-radius: 0.4rem; }
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

const Images = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);
    align-items: start;
    gap: 2rem;
    h3 { font-size: 1.4rem; margin-bottom: 0.8rem; color: var(--gray-700); }
    h3 small { font-weight: 400; color: var(--gray-200); }
    h3 em { font-style: normal; font-weight: 500; color: var(--danger); }
    @media (max-width: 800px) { grid-template-columns: 1fr; }
`
