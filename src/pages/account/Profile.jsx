import { useState } from 'react'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { Alert, Button, Card, Field, Input, Spinner } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { updateProfile } from '../../services/account'
import { formatDate, maskPhone, onlyDigits } from '../../lib/format'

export function Profile() {
    useDocumentTitle('Meus dados')
    const { user, profile, refreshProfile, updatePassword } = useAuth()
    const toast = useToast()

    const [form, setForm] = useState({
        full_name: profile?.full_name || '',
        phone: profile?.phone ? maskPhone(profile.phone) : '',
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [passwords, setPasswords] = useState({ password: '', confirm: '' })
    const [passwordError, setPasswordError] = useState('')
    const [changing, setChanging] = useState(false)

    const saveProfile = async (event) => {
        event.preventDefault()
        setError('')
        if (form.full_name.trim().length < 3) return setError('Informe seu nome completo.')
        setSaving(true)
        try {
            await updateProfile(user.id, { full_name: form.full_name.trim(), phone: onlyDigits(form.phone) || null })
            await refreshProfile()
            toast.show('Dados atualizados!', 'success')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const changePassword = async (event) => {
        event.preventDefault()
        setPasswordError('')
        if (passwords.password.length < 8) return setPasswordError('Use pelo menos 8 caracteres.')
        if (passwords.password !== passwords.confirm) return setPasswordError('As senhas não conferem.')
        setChanging(true)
        try {
            await updatePassword(passwords.password)
            setPasswords({ password: '', confirm: '' })
            toast.show('Senha alterada!', 'success')
        } catch (err) {
            setPasswordError(err.message)
        } finally {
            setChanging(false)
        }
    }

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Meus dados</h1>
                    <p>Cliente desde {formatDate(profile?.created_at || user.created_at)}</p>
                </div>
            </DashHeader>

            <Grid>
                <Card>
                    <CardTitle>Informações pessoais</CardTitle>
                    <form onSubmit={saveProfile}>
                        {error && <Alert $tone="danger">{error}</Alert>}
                        <Field label="Nome completo" htmlFor="full_name">
                            <Input id="full_name" autoComplete="name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                        </Field>
                        <Field label="E-mail" htmlFor="email" hint="O e-mail de acesso não pode ser alterado por aqui.">
                            <Input id="email" value={user.email} disabled />
                        </Field>
                        <Field label="Telefone" htmlFor="phone">
                            <Input id="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })} />
                        </Field>
                        <Button type="submit" disabled={saving}>{saving ? <><Spinner /> Salvando...</> : 'Salvar alterações'}</Button>
                    </form>
                </Card>

                <Card>
                    <CardTitle>Alterar senha</CardTitle>
                    <form onSubmit={changePassword}>
                        {passwordError && <Alert $tone="danger">{passwordError}</Alert>}
                        <Field label="Nova senha" htmlFor="new-password" hint="Mínimo de 8 caracteres">
                            <Input id="new-password" type="password" autoComplete="new-password" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} />
                        </Field>
                        <Field label="Confirmar nova senha" htmlFor="confirm-password">
                            <Input id="confirm-password" type="password" autoComplete="new-password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                        </Field>
                        <Button type="submit" $variant="secondary" disabled={changing}>{changing ? 'Alterando...' : 'Alterar senha'}</Button>
                    </form>
                </Card>
            </Grid>
        </>
    )
}

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.4rem;
    align-items: start;
    form { display: flex; flex-direction: column; gap: 1.6rem; align-items: stretch; }
    form > button { align-self: flex-start; }
    @media (max-width: 1000px) { grid-template-columns: 1fr; }
`
