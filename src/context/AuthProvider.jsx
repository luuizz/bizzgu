import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../services/account'
import { unwrap } from '../services/unwrap'
import { AuthContext } from './contexts'

const redirectTo = (path) => `${window.location.origin}${import.meta.env.BASE_URL}${path}`

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [recovering, setRecovering] = useState(false)

    const user = session?.user ?? null

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            if (!data.session) setLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (event === 'PASSWORD_RECOVERY') setRecovering(true)
            setSession(newSession)
            if (!newSession) {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    const refreshProfile = useCallback(async () => {
        if (!user) return null
        const data = await getProfile(user.id)
        setProfile(data)
        return data
    }, [user])

    // Busca o perfil (com o papel admin/cliente) sempre que o usuário muda
    useEffect(() => {
        if (!user) return
        let active = true
        getProfile(user.id)
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
        recovering,
        isAdmin: profile?.role === 'admin',
        refreshProfile,

        signIn: async (email, password) => unwrap(await supabase.auth.signInWithPassword({ email, password })),

        signUp: async ({ name, email, password }) => unwrap(await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name }, emailRedirectTo: redirectTo('login') },
        })),

        signOut: async () => {
            await supabase.auth.signOut()
            setProfile(null)
        },

        requestPasswordReset: async (email) => unwrap(
            await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo('redefinir-senha') }),
        ),

        updatePassword: async (password) => {
            const result = unwrap(await supabase.auth.updateUser({ password }))
            setRecovering(false)
            return result
        },
    }), [session, user, profile, loading, recovering, refreshProfile])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
