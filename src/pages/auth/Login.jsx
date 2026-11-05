import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Alert, Button, Field, Input, Spinner } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function Login() {
    useDocumentTitle('Entrar')
    const { user, signIn, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from
    const destination = from ? `${from.pathname}${from.search || ''}` : '/minha-conta'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    if (!loading && user && !submitting) return <Navigate to={destination} replace />

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            await signIn(email.trim(), password)
            navigate(destination, { replace: true })
        } catch (err) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Entrar"
            subtitle="Acesse sua conta para acompanhar pedidos e finalizar compras."
            footer={<>Ainda não tem conta? <Link to="/cadastro" state={location.state}>Criar conta</Link></>}
        >
            <form onSubmit={handleSubmit}>
                {location.state?.registered && <Alert $tone="success">Conta criada! Agora é só entrar.</Alert>}
                {error && <Alert $tone="danger">{error}</Alert>}
                <Field label="E-mail" htmlFor="email">
                    <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field label="Senha" htmlFor="password">
                    <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
                <div className="row-end"><Link to="/recuperar-senha">Esqueci minha senha</Link></div>
                <Button type="submit" $size="lg" $block disabled={submitting}>
                    {submitting ? <><Spinner /> Entrando...</> : 'Entrar'}
                </Button>
            </form>
        </AuthLayout>
    )
}
