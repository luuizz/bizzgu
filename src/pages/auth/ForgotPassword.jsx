import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Alert, Button, Field, Input, Spinner } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function ForgotPassword() {
    useDocumentTitle('Recuperar senha')
    const { requestPasswordReset } = useAuth()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState({ sent: false, error: '', loading: false })

    const handleSubmit = async (event) => {
        event.preventDefault()
        setStatus({ sent: false, error: '', loading: true })
        try {
            await requestPasswordReset(email.trim())
            setStatus({ sent: true, error: '', loading: false })
        } catch (err) {
            setStatus({ sent: false, error: err.message, loading: false })
        }
    }

    return (
        <AuthLayout
            title="Recuperar senha"
            subtitle="Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha."
            footer={<Link to="/login">Voltar para o login</Link>}
        >
            {status.sent ? (
                <Alert $tone="success">Se houver uma conta com {email}, você receberá o link em instantes. Confira também o spam.</Alert>
            ) : (
                <form onSubmit={handleSubmit}>
                    {status.error && <Alert $tone="danger">{status.error}</Alert>}
                    <Field label="E-mail" htmlFor="email">
                        <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Field>
                    <Button type="submit" $size="lg" $block disabled={status.loading}>
                        {status.loading ? <><Spinner /> Enviando...</> : 'Enviar link'}
                    </Button>
                </form>
            )}
        </AuthLayout>
    )
}
