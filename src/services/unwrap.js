import { friendlyError } from '../lib/api'

// Lança um Error com mensagem amigável quando a resposta da API traz erro
export function unwrap({ data, error, count }) {
    if (error) {
        const err = new Error(friendlyError(error))
        err.code = error.code
        throw err
    }
    return count !== undefined && count !== null ? { data, count } : data
}
