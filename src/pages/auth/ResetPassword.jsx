import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Alert, Button, Field, Input, Spinner } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

// Página aberta pelo link do e-mail de recuperação: o Neon Auth envia ?token=...
export function ResetPassword() {
    useDocumentTitle('Nova senha')
    const { resetPassword } = useAuth()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const token = params.get('token')
    const linkError = params.get('error')

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    if (!token || linkError) {
        return (
            <AuthLayout
                title="Link inválido ou expirado"
                subtitle="Peça um novo link de recuperação para redefinir sua senha."
                footer={<Link to="/recuperar-senha">Pedir novo link</Link>}
            />
        )
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        if (password.length < 8) return setError('Use pelo menos 8 caracteres.')
        if (password !== confirm) return setError('As senhas não conferem.')
        setSubmitting(true)
        try {
            await resetPassword(token, password)
            navigate('/login', { replace: true, state: { passwordReset: true } })
        } catch (err) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout title="Criar nova senha" subtitle="Escolha uma senha nova para a sua conta.">
            <form onSubmit={handleSubmit}>
                {error && <Alert $tone="danger">{error}</Alert>}
                <Field label="Nova senha" htmlFor="password" hint="Mínimo de 8 caracteres">
                    <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
                <Field label="Confirmar nova senha" htmlFor="confirm">
                    <Input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </Field>
                <Button type="submit" $size="lg" $block disabled={submitting}>
                    {submitting ? <><Spinner /> Salvando...</> : 'Salvar nova senha'}
                </Button>
            </form>
        </AuthLayout>
    )
}
