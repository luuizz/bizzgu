import { friendlyError } from '../lib/supabase'

// Lança um Error com mensagem amigável quando a resposta do Supabase traz erro
export function unwrap({ data, error, count }) {
    if (error) {
        const err = new Error(friendlyError(error))
        err.code = error.code
        throw err
    }
    return count !== undefined && count !== null ? { data, count } : data
}
