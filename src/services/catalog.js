import { api } from '../lib/api'
import { unwrap } from './unwrap'

const PRODUCT_FIELDS = 'id, name, slug, description, price, compare_at_price, stock, images, featured, active, category_id, category:categories(id, name, slug)'

export const SORT_OPTIONS = {
    relevance: { label: 'Mais relevantes', column: 'featured', ascending: false },
    newest: { label: 'Lançamentos', column: 'created_at', ascending: false },
    price_asc: { label: 'Menor preço', column: 'price', ascending: true },
    price_desc: { label: 'Maior preço', column: 'price', ascending: false },
    name: { label: 'Nome (A-Z)', column: 'name', ascending: true },
}

// Remove caracteres com significado especial nos filtros do PostgREST
const sanitizeTerm = (term) => term.replace(/[,()%*\\:"]/g, ' ').trim()

export async function getCategories() {
    return unwrap(await api.from('categories').select('*').order('sort_order').order('name'))
}

export async function getCategoryBySlug(slug) {
    return unwrap(await api.from('categories').select('*').eq('slug', slug).maybeSingle())
}

export async function getProducts({ categoryId, search, featured, onSale, sort = 'relevance', limit, ids, excludeId } = {}) {
    let query = api.from('products').select(PRODUCT_FIELDS).eq('active', true)

    if (categoryId) query = query.eq('category_id', categoryId)
    if (featured) query = query.eq('featured', true)
    if (onSale) query = query.not('compare_at_price', 'is', null)
    if (ids) query = query.in('id', ids.length ? ids : [-1])
    if (excludeId) query = query.neq('id', excludeId)

    if (search) {
        const term = sanitizeTerm(search)
        if (term) query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`)
    }

    const order = SORT_OPTIONS[sort] || SORT_OPTIONS.relevance
    query = query.order(order.column, { ascending: order.ascending }).order('id', { ascending: false })

    if (limit) query = query.limit(limit)

    return unwrap(await query)
}

export async function getProductBySlug(slug) {
    return unwrap(await api.from('products').select(PRODUCT_FIELDS).eq('slug', slug).eq('active', true).maybeSingle())
}
