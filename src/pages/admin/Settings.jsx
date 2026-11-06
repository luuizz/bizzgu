import { useEffect, useState } from 'react'
import { Eye } from '@phosphor-icons/react'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { ImageField } from '../../components/admin/ImageField'
import { Alert, Button, Card, ErrorState, Field, Input, Loader, Spinner, Textarea } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { SOCIAL_FIELDS, setStoreSettingsCache } from '../../hooks/useStoreSettings'
import { getStoreSettings } from '../../services/catalog'
import { removeUploadedImages, saveStoreSettings } from '../../services/admin'

const FIELDS = [
    'about_title', 'about_summary', 'about_text', 'about_image',
    'support_email', 'press_email', 'phone', 'whatsapp', 'business_hours', 'address',
    ...SOCIAL_FIELDS.map((field) => field.key),
]

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function Settings() {
    useDocumentTitle('Configurações · Admin')
    const toast = useToast()
    const [form, setForm] = useState(null)
    const [saved, setSaved] = useState(null)
    const [loadError, setLoadError] = useState(null)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [discarded, setDiscarded] = useState([])

    useEffect(() => {
        getStoreSettings()
            .then((data) => {
                if (!data) throw new Error('Configurações não encontradas. Rode as migrations do banco.')
                const values = Object.fromEntries(FIELDS.map((key) => [key, data[key] ?? '']))
                setForm(values)
                setSaved(values)
            })
            .catch(setLoadError)
    }, [])

    if (loadError) return <ErrorState error={loadError} />
    if (!form) return <Loader />

    const set = (field) => (event) => {
        const value = event?.target ? event.target.value : event
        setForm((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
    }
    const dirty = FIELDS.some((key) => form[key] !== saved[key])

    const validate = () => {
        const next = {}
        if (!form.about_title.trim()) next.about_title = 'Informe o título.'
        ;['support_email', 'press_email'].forEach((key) => {
            if (form[key].trim() && !EMAIL_RE.test(form[key].trim())) next[key] = 'E-mail inválido.'
        })
        const digits = form.whatsapp.replace(/\D/g, '')
        if (form.whatsapp.trim() && (digits.length < 10 || digits.length > 15)) next.whatsapp = 'Use DDI + DDD + número, ex.: 5511999998888.'
        SOCIAL_FIELDS.forEach(({ key }) => {
            if (form[key].trim() && !/^https:\/\/\S+$/.test(form[key].trim())) next[key] = 'O link precisa começar com https://'
        })
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!validate()) return
        setSaving(true)
        try {
            const values = Object.fromEntries(FIELDS.map((key) => {
                const value = String(form[key]).trim()
                if (key === 'whatsapp') {
                    // Só DDD + número: assume Brasil (55)
                    const digits = value.replace(/\D/g, '')
                    return [key, digits ? (digits.length <= 11 ? `55${digits}` : digits) : null]
                }
                if (key === 'about_title') return [key, value]
                return [key, value || null]
            }))
            const data = await saveStoreSettings(values)
            removeUploadedImages(discarded.filter((url) => url !== form.about_image)).catch(() => {})
            setDiscarded([])
            setStoreSettingsCache(data)
            const next = Object.fromEntries(FIELDS.map((key) => [key, data[key] ?? '']))
            setForm(next)
            setSaved(next)
            toast.show('Configurações salvas!', 'success')
        } catch (error) {
            setErrors({ form: error.message })
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Configurações da loja</h1>
                    <p>Texto do “Sobre”, contatos e redes sociais exibidos no rodapé e na página Sobre.</p>
                </div>
                <div className="actions">
                    <Button as="a" href={`${import.meta.env.BASE_URL}sobre`} target="_blank" rel="noreferrer" $variant="ghost">
                        <Eye size={20} /> Ver página Sobre
                    </Button>
                </div>
            </DashHeader>

            <Form onSubmit={handleSubmit} noValidate>
                <div className="main">
                    <Card>
                        <CardTitle>Sobre a loja</CardTitle>
                        <div className="fields">
                            <Field label="Título" htmlFor="about_title" error={errors.about_title}>
                                <Input id="about_title" value={form.about_title} onChange={set('about_title')} maxLength={120} aria-invalid={!!errors.about_title} />
                            </Field>
                            <Field label="Resumo" htmlFor="about_summary" hint="Uma ou duas frases. Aparece na seção “Sobre” da página inicial.">
                                <Textarea id="about_summary" rows={3} value={form.about_summary} onChange={set('about_summary')} maxLength={400} />
                            </Field>
                            <Field label="Texto completo" htmlFor="about_text" hint="Página /sobre. Deixe uma linha em branco entre os parágrafos.">
                                <Textarea id="about_text" rows={10} value={form.about_text} onChange={set('about_text')} maxLength={8000} />
                            </Field>
                        </div>
                    </Card>

                    <Card>
                        <CardTitle>Imagem do Sobre</CardTitle>
                        <ImageField
                            id="about_image"
                            folder="banners"
                            value={form.about_image}
                            onChange={(url) => set('about_image')(url)}
                            onRemoved={(url) => url && setDiscarded((prev) => [...prev, url])}
                            ratio="4 / 3"
                            hint="Opcional. Foto da equipe, da loja ou dos produtos (ex.: 1200 × 900 px)."
                        />
                    </Card>

                    <Card>
                        <CardTitle>Redes sociais</CardTitle>
                        <p className="help">Só as redes preenchidas aparecem no rodapé.</p>
                        <div className="grid">
                            {SOCIAL_FIELDS.map(({ key, label }) => (
                                <Field key={key} label={label} htmlFor={key} error={errors[key]}>
                                    <Input id={key} type="url" value={form[key]} onChange={set(key)} placeholder="https://..." aria-invalid={!!errors[key]} />
                                </Field>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="side">
                    <Card>
                        <CardTitle>Contato</CardTitle>
                        <div className="fields">
                            <Field label="E-mail de atendimento" htmlFor="support_email" error={errors.support_email}>
                                <Input id="support_email" type="email" value={form.support_email} onChange={set('support_email')} aria-invalid={!!errors.support_email} />
                            </Field>
                            <Field label="E-mail para imprensa" htmlFor="press_email" error={errors.press_email}>
                                <Input id="press_email" type="email" value={form.press_email} onChange={set('press_email')} aria-invalid={!!errors.press_email} />
                            </Field>
                            <Field label="Telefone" htmlFor="phone">
                                <Input id="phone" value={form.phone} onChange={set('phone')} maxLength={30} placeholder="(11) 4000-0000" />
                            </Field>
                            <Field label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp} hint="DDD + número (o 55 do Brasil é adicionado sozinho). Vira um link wa.me.">
                                <Input id="whatsapp" inputMode="numeric" value={form.whatsapp} onChange={set('whatsapp')} placeholder="5511999998888" aria-invalid={!!errors.whatsapp} />
                            </Field>
                            <Field label="Horário de atendimento" htmlFor="business_hours">
                                <Input id="business_hours" value={form.business_hours} onChange={set('business_hours')} maxLength={120} />
                            </Field>
                            <Field label="Endereço" htmlFor="address">
                                <Textarea id="address" rows={2} value={form.address} onChange={set('address')} maxLength={200} />
                            </Field>
                        </div>
                    </Card>

                    {errors.form && <Alert $tone="danger">{errors.form}</Alert>}
                    <Button type="submit" $size="lg" $block disabled={saving || !dirty}>
                        {saving ? <><Spinner /> Salvando...</> : dirty ? 'Salvar configurações' : 'Tudo salvo'}
                    </Button>
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
    .main, .side { display: flex; flex-direction: column; gap: 2.4rem; }
    .side { position: sticky; top: 8.8rem; }
    .fields { display: flex; flex-direction: column; gap: 1.6rem; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.6rem; }
    .help { font-size: 1.35rem; color: var(--gray-200); margin: -0.8rem 0 1.6rem; }
    @media (max-width: 1100px) {
        grid-template-columns: 1fr;
        .side { position: static; }
    }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
`
