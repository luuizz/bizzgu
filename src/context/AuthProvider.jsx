import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, friendlyError } from '../lib/api'
import { ensureProfile } from '../services/account'
import { unwrap } from '../services/unwrap'
import { AuthContext } from './contexts'

const redirectTo = (path) => `${window.location.origin}${import.meta.env.BASE_URL}${path}`

// Métodos do Better Auth (motor do Neon Auth) que não existem na API estilo Supabase.
// Eles podem lançar exceção em vez de devolver { error }; `messages` traduz por código.
async function callBetterAuth(method, args, messages) {
    let result
    try {
        result = await api.auth.getBetterAuthInstance()[method](args)
    } catch (error) {
        result = { error }
    }
    if (result?.error) {
        const err = result.error
        const raw = err.error?.code || err.code
        throw new Error(messages[raw] || messages[err.code] || friendlyError(err))
    }
    return result.data
}

// Depois do login/cadastro, a biblioteca guarda em cache a sessão da resposta do login,
// que traz o token interno do Better Auth (não o JWT que a Data API aceita). Buscar a
// sessão de novo no servidor, ignorando o cache, troca esse token pelo JWT. Sem isso,
// as primeiras consultas (como o perfil com o papel de admin) falham até recarregar a página.
async function refreshSessionJwt() {
    try {
        await api.auth.getBetterAuthInstance().getSession({ fetchOptions: { headers: { 'X-Force-Fetch': 'true' } } })
    } catch {
        // Se falhar, segue com a sessão atual; o próximo carregamento busca de novo
    }
    const { data } = await api.auth.getSession()
    return data.session
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const user = session?.user ?? null

    useEffect(() => {
        let active = true

        api.auth.getSession().then(({ data }) => {
            if (!active) return
            setSession(data.session)
            if (!data.session) setLoading(false)
        })

        // Mantém abas diferentes sincronizadas (login/logout em outra aba)
        const { data: listener } = api.auth.onAuthStateChange((_event, newSession) => {
            if (!active) return
            setSession(newSession)
            if (!newSession) {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => {
            active = false
            listener.subscription.unsubscribe()
        }
    }, [])

    const refreshProfile = useCallback(async () => {
        if (!user) return null
        const data = await ensureProfile()
        setProfile(data)
        return data
    }, [user])

    // Garante o perfil (com o papel admin/cliente) sempre que o usuário muda
    useEffect(() => {
        if (!user) return
        let active = true
        setLoading(true)
        // Se falhar logo após o login (token ainda não trocado pelo JWT), renova e tenta de novo
        ensureProfile()
            .catch(async () => {
                await refreshSessionJwt()
                return ensureProfile()
            })
            .then((data) => active && setProfile(data))
            .catch(() => active && setProfile(null))
            .finally(() => active && setLoading(false))
        return () => { active = false }
    }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

    const value = useMemo(() => ({
        session,
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'admin',
        refreshProfile,

        signIn: async (email, password) => {
            const data = unwrap(await api.auth.signInWithPassword({ email, password }))
            setSession((await refreshSessionJwt()) || data.session)
            return data
        },

        // Retorna { needsConfirmation: true } quando o projeto exige confirmar o e-mail
        signUp: async ({ name, email, password }) => {
            const result = await api.auth.signUp({
                email,
                password,
                options: { data: { displayName: name }, emailRedirectTo: redirectTo('login') },
            })
            if (result.error?.code === 'session_not_found') return { needsConfirmation: true }
            const data = unwrap(result)
            setSession((await refreshSessionJwt()) || data.session)
            return data
        },

        signOut: async () => {
            await api.auth.signOut()
            setSession(null)
            setProfile(null)
        },

        requestPasswordReset: async (email) => unwrap(
            await api.auth.resetPasswordForEmail(email, { redirectTo: redirectTo('redefinir-senha') }),
        ),

        // Conclui a recuperação com o token que chega no link do e-mail
        resetPassword: (token, newPassword) => callBetterAuth('resetPassword', { token, newPassword }, {
            INVALID_TOKEN: 'O link expirou ou já foi usado. Peça um novo.',
            bad_jwt: 'O link expirou ou já foi usado. Peça um novo.',
        }),

        changePassword: (currentPassword, newPassword) => callBetterAuth(
            'changePassword',
            { currentPassword, newPassword, revokeOtherSessions: false },
            { INVALID_PASSWORD: 'Senha atual incorreta.', invalid_credentials: 'Senha atual incorreta.' },
        ),
    }), [session, user, profile, loading, refreshProfile])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
