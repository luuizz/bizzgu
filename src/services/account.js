import { api } from '../lib/api'
import { unwrap } from './unwrap'

// Cria o perfil no primeiro acesso (copiando nome/e-mail do Neon Auth) e o retorna
export async function ensureProfile() {
    return unwrap(await api.rpc('ensure_profile'))
}

export async function updateProfile(userId, { full_name, phone }) {
    return unwrap(await api.from('profiles').update({ full_name, phone }).eq('id', userId).select().single())
}

export async function getWishlistIds() {
    const rows = unwrap(await api.from('wishlist_items').select('product_id'))
    return rows.map((row) => row.product_id)
}

export async function addToWishlist(userId, productId) {
    return unwrap(await api.from('wishlist_items').insert({ user_id: userId, product_id: productId }))
}

export async function removeFromWishlist(userId, productId) {
    return unwrap(await api.from('wishlist_items').delete().eq('user_id', userId).eq('product_id', productId))
}
