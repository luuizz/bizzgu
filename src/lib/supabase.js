import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

export const supabase = isSupabaseConfigured
    ? createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
    : null

export const PRODUCT_IMAGES_BUCKET = 'product-images'

// Converte erros do Supabase/Postgres em mensagens amigáveis
export function friendlyError(error) {
    if (!error) return ''
    const message = error.message || String(error)

    const known = {
        'Invalid login credentials': 'E-mail ou senha incorretos.',
        'User already registered': 'Já existe uma conta com este e-mail.',
        'Email not confirmed': 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.',
        'Password should be at least 6 characters': 'A senha precisa ter pelo menos 6 caracteres.',
        'Failed to fetch': 'Não foi possível conectar ao servidor. Verifique sua internet.',
    }

    for (const [key, value] of Object.entries(known)) {
        if (message.includes(key)) return value
    }

    if (error.code === '23505') return 'Já existe um registro com esse identificador (slug).'
    if (error.code === '23503') return 'Este registro está em uso e não pode ser removido.'
    if (error.code === '42501' && !/[À-ú]/.test(message)) return 'Você não tem permissão para fazer isso.'

    return message
}
