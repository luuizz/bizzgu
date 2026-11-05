import { supabase } from '../lib/supabase'
import { unwrap } from './unwrap'

export async function getProfile(userId) {
    return unwrap(await supabase.from('profiles').select('*').eq('id', userId).maybeSingle())
}

export async function updateProfile(userId, { full_name, phone }) {
    return unwrap(await supabase.from('profiles').update({ full_name, phone }).eq('id', userId).select().single())
}

export async function getWishlistIds() {
    const rows = unwrap(await supabase.from('wishlist_items').select('product_id'))
    return rows.map((row) => row.product_id)
}

export async function addToWishlist(userId, productId) {
    return unwrap(await supabase.from('wishlist_items').insert({ user_id: userId, product_id: productId }))
}

export async function removeFromWishlist(userId, productId) {
    return unwrap(await supabase.from('wishlist_items').delete().eq('user_id', userId).eq('product_id', productId))
}
