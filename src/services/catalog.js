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

export async function getTagBySlug(slug) {
    return unwrap(await api.from('tags').select('id, name, slug, description').eq('slug', slug).maybeSingle())
}

export async function getProducts({ categoryId, tagId, search, featured, onSale, sort = 'relevance', limit, ids, excludeId } = {}) {
    // Filtro por tag: junta com product_tags (inner = só produtos que têm a tag)
    const fields = tagId ? `${PRODUCT_FIELDS}, product_tags!inner(tag_id)` : PRODUCT_FIELDS
    let query = api.from('products').select(fields).eq('active', true)

    if (tagId) query = query.eq('product_tags.tag_id', tagId)
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

// Sem filtro de "ativo": o banco (RLS) só devolve produtos inativos para admins,
// o que permite ao painel pré-visualizar um produto antes de publicá-lo
export async function getProductBySlug(slug) {
    return unwrap(await api.from('products').select(`${PRODUCT_FIELDS}, tags(id, name, slug)`).eq('slug', slug).maybeSingle())
}

// ---------- Banners da home ----------
// O banco (RLS) já filtra: visitantes só recebem banners ativos e dentro do período
const BANNER_FIELDS = 'id, title, link, image, image_mobile, active, starts_at, ends_at'

export async function getHomeBanners() {
    const banners = unwrap(await api.from('banners').select(BANNER_FIELDS).eq('active', true).order('position').order('id'))
    // Para admins o banco devolve também os fora do período; a home mostra o mesmo que o visitante vê
    const now = Date.now()
    return banners.filter((banner) => (!banner.starts_at || new Date(banner.starts_at) <= now)
        && (!banner.ends_at || new Date(banner.ends_at) > now))
}

// ---------- Configurações da loja (Sobre, contatos, redes) ----------
export async function getStoreSettings() {
    return unwrap(await api.from('store_settings').select('*').eq('id', 1).maybeSingle())
}

// ---------- Blog ----------
// O banco (RLS) só devolve aos visitantes posts publicados com data já passada
const POST_LIST_FIELDS = 'id, title, slug, excerpt, cover_image, published_at, author_name'

export async function getPosts({ limit, excludeId } = {}) {
    let query = api
        .from('posts')
        .select(POST_LIST_FIELDS)
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
    if (excludeId) query = query.neq('id', excludeId)
    if (limit) query = query.limit(limit)
    return unwrap(await query)
}

// Sem filtro de status: admins conseguem pré-visualizar rascunhos (o RLS esconde dos demais)
export async function getPostBySlug(slug) {
    return unwrap(await api.from('posts').select('*').eq('slug', slug).maybeSingle())
}

export async function getTags() {
    return unwrap(await api.from('tags').select('id, name, slug').order('name'))
}
