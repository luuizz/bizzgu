import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Alert, Button, Field, Input, Spinner } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function Register() {
    useDocumentTitle('Criar conta')
    const { user, signUp, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from
    const destination = from ? `${from.pathname}${from.search || ''}` : '/minha-conta'

    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [errors, setErrors] = useState({})
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [needsConfirmation, setNeedsConfirmation] = useState(false)

    if (!loading && user && !submitting) return <Navigate to={destination} replace />

    const set = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const validate = () => {
        const next = {}
        if (form.name.trim().length < 3) next.name = 'Informe seu nome.'
        if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'E-mail inválido.'
        if (form.password.length < 8) next.password = 'Use pelo menos 8 caracteres.'
        if (form.password !== form.confirm) next.confirm = 'As senhas não conferem.'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        if (!validate()) return
        setSubmitting(true)
        try {
            const { session } = await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password })
            if (session) {
                navigate(destination, { replace: true })
            } else {
                // Projeto com confirmação de e-mail ativa
                setNeedsConfirmation(true)
                setSubmitting(false)
            }
        } catch (err) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    if (needsConfirmation) {
        return (
            <AuthLayout
                title="Confirme seu e-mail"
                subtitle={`Enviamos um link de confirmação para ${form.email}. Clique nele para ativar sua conta e depois faça login.`}
                footer={<Link to="/login">Ir para o login</Link>}
            />
        )
    }

    return (
        <AuthLayout
            title="Criar conta"
            subtitle="Leva menos de um minuto."
            footer={<>Já tem conta? <Link to="/login" state={location.state}>Entrar</Link></>}
        >
            <form onSubmit={handleSubmit} noValidate>
                {error && <Alert $tone="danger">{error}</Alert>}
                <Field label="Nome completo" htmlFor="name" error={errors.name}>
                    <Input id="name" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
                </Field>
                <Field label="E-mail" htmlFor="email" error={errors.email}>
                    <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
                </Field>
                <Field label="Senha" htmlFor="password" error={errors.password} hint="Mínimo de 8 caracteres">
                    <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} />
                </Field>
                <Field label="Confirmar senha" htmlFor="confirm" error={errors.confirm}>
                    <Input id="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} aria-invalid={!!errors.confirm} />
                </Field>
                <Button type="submit" $size="lg" $block disabled={submitting}>
                    {submitting ? <><Spinner /> Criando conta...</> : 'Criar conta'}
                </Button>
            </form>
        </AuthLayout>
    )
}
