import { createClient } from '@neon/neon-js/supabase'

// Endereços do projeto no Neon (Console → Auth e Console → Data API)
const authUrl = import.meta.env.VITE_NEON_AUTH_URL
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL
const uploadUrl = import.meta.env.VITE_UPLOAD_FUNCTION_URL

export const isApiConfigured = Boolean(authUrl && dataApiUrl)

// Cliente único: `api.auth` (Neon Auth, API no estilo Supabase) e
// `api.from()` / `api.rpc()` (Data API). Visitantes sem login usam um token
// anônimo, que só tem permissão de leitura no catálogo.
export const api = isApiConfigured
    ? createClient({
        auth: { url: authUrl, allowAnonymous: true },
        dataApi: { url: dataApiUrl },
    })
    : null

// Upload de imagens: opcional, feito pela Neon Function em functions/product-images.ts
export const UPLOAD_FUNCTION_URL = uploadUrl || ''

// JWT do usuário logado (o mesmo que a Data API recebe)
export async function getAccessToken() {
    const { data } = await api.auth.getSession()
    return data.session?.access_token || null
}

// Converte erros do Neon Auth/Postgres em mensagens amigáveis
export function friendlyError(error) {
    if (!error) return ''
    const message = error.message || String(error)

    const byCode = {
        invalid_credentials: 'E-mail ou senha incorretos.',
        user_already_exists: 'Já existe uma conta com este e-mail.',
        email_exists: 'Já existe uma conta com este e-mail.',
        email_not_confirmed: 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.',
        weak_password: 'A senha precisa ter pelo menos 8 caracteres.',
        email_address_invalid: 'E-mail inválido.',
        over_request_rate_limit: 'Muitas tentativas. Aguarde um pouco e tente de novo.',
        // códigos crus do Better Auth (troca/redefinição de senha)
        INVALID_PASSWORD: 'Senha atual incorreta.',
        INVALID_TOKEN: 'O link expirou ou já foi usado. Peça um novo.',
        PASSWORD_TOO_SHORT: 'A senha precisa ter pelo menos 8 caracteres.',
        '23505': 'Já existe um registro com esse identificador (slug).',
        '23503': 'Este registro está em uso e não pode ser removido.',
    }
    if (byCode[error.code]) return byCode[error.code]

    const byMessage = {
        'Invalid email or password': 'E-mail ou senha incorretos.',
        'Invalid password': 'Senha atual incorreta.',
        'User already exists': 'Já existe uma conta com este e-mail.',
        'Invalid token': 'O link expirou ou já foi usado. Peça um novo.',
        'Failed to fetch': 'Não foi possível conectar ao servidor. Verifique sua internet.',
    }
    for (const [key, value] of Object.entries(byMessage)) {
        if (message.includes(key)) return value
    }

    if (error.code === '42501' && !/[À-ú]/.test(message)) return 'Você não tem permissão para fazer isso.'

    return message
}
