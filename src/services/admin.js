import { api, UPLOAD_FUNCTION_URL, getAccessToken } from '../lib/api'
import { unwrap } from './unwrap'

// ---------- Painel ----------
export async function getDashboard() {
    return unwrap(await api.rpc('admin_dashboard'))
}

// ---------- Pedidos ----------
export async function listOrders({ status, search, page = 1, pageSize = 20 } = {}) {
    let query = api
        .from('orders')
        .select('id, status, total, payment_method, customer_name, customer_email, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

    if (status) query = query.eq('status', status)
    if (search) {
        const term = search.replace(/[,()%*\\:"#]/g, ' ').trim()
        if (/^\d+$/.test(term)) query = query.eq('id', Number(term))
        else if (term) query = query.or(`customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`)
    }

    return unwrap(await query)
}

export async function updateOrderStatus(id, status) {
    return unwrap(await api.rpc('admin_update_order_status', { p_order_id: id, p_status: status }))
}

// ---------- Produtos ----------
export async function listAllProducts({ search, categoryId } = {}) {
    let query = api
        .from('products')
        .select('id, name, slug, price, compare_at_price, stock, images, featured, active, category:categories(id, name)')
        .order('created_at', { ascending: false })

    if (categoryId) query = query.eq('category_id', categoryId)
    if (search) {
        const term = search.replace(/[,()%*\\:"]/g, ' ').trim()
        if (term) query = query.or(`name.ilike.%${term}%,slug.ilike.%${term}%`)
    }
    return unwrap(await query)
}

export async function getProductById(id) {
    return unwrap(await api.from('products').select('*').eq('id', id).maybeSingle())
}

export async function saveProduct(id, values) {
    const query = id
        ? api.from('products').update(values).eq('id', id)
        : api.from('products').insert(values)
    return unwrap(await query.select().single())
}

export async function deleteProduct(id) {
    return unwrap(await api.from('products').delete().eq('id', id))
}

// Upload pela Vercel Function (api/images.js), que confere se o usuário é admin
// e grava o arquivo no Vercel Blob. Sem ela (ex.: no `yarn dev`), o painel
// aceita imagens por link.
export const canUploadImages = Boolean(UPLOAD_FUNCTION_URL)

async function callUploadFunction(method, body, contentType, folder) {
    const token = await getAccessToken()
    const url = folder ? `${UPLOAD_FUNCTION_URL}?pasta=${folder}` : UPLOAD_FUNCTION_URL
    const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': contentType },
        body,
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || `Falha no envio (${response.status}).`)
    return data
}

// folder: 'products' | 'banners' | 'blog'
export async function uploadImage(file, folder = 'products') {
    const { url } = await callUploadFunction('POST', file, file.type, folder)
    return url
}

export const uploadProductImage = (file) => uploadImage(file, 'products')

// Apaga do Blob as imagens enviadas pelo painel (links externos e as de public/ ficam)
const isUploadedImage = (url) => /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\/(products|banners|blog)\//.test(url)

export async function removeUploadedImages(urls) {
    if (!canUploadImages) return
    const uploaded = urls.filter(isUploadedImage)
    await Promise.allSettled(uploaded.map((url) => callUploadFunction('DELETE', JSON.stringify({ url }), 'application/json')))
}

export const removeProductImages = removeUploadedImages

// ---------- Categorias ----------
export async function listCategoriesWithCount() {
    return unwrap(await api.from('categories').select('*, products(count)').order('sort_order').order('name'))
}

export async function saveCategory(id, values) {
    const query = id
        ? api.from('categories').update(values).eq('id', id)
        : api.from('categories').insert(values)
    return unwrap(await query.select().single())
}

export async function deleteCategory(id) {
    return unwrap(await api.from('categories').delete().eq('id', id))
}

// ---------- Clientes ----------
export async function listUsers({ search } = {}) {
    let query = api
        .from('profiles')
        .select('id, email, full_name, phone, role, created_at, orders(count)')
        .order('created_at', { ascending: false })

    if (search) {
        const term = search.replace(/[,()%*\\:"]/g, ' ').trim()
        if (term) query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`)
    }
    return unwrap(await query)
}

export async function setUserRole(userId, role) {
    return unwrap(await api.rpc('admin_set_role', { p_user_id: userId, p_role: role }))
}

// ---------- Banners ----------
export async function listBanners() {
    return unwrap(await api.from('banners').select('*').order('position').order('id'))
}

export async function getBannerById(id) {
    return unwrap(await api.from('banners').select('*').eq('id', id).maybeSingle())
}

export async function saveBanner(id, values) {
    if (!id) {
        // Novo banner entra no fim da fila
        const last = unwrap(await api.from('banners').select('position').order('position', { ascending: false }).limit(1))
        values = { ...values, position: (last[0]?.position ?? 0) + 1 }
    }
    const query = id ? api.from('banners').update(values).eq('id', id) : api.from('banners').insert(values)
    return unwrap(await query.select().single())
}

export async function deleteBanner(id) {
    return unwrap(await api.from('banners').delete().eq('id', id))
}

// Reordena gravando a posição de cada banner conforme a lista recebida
export async function reorderBanners(ids) {
    await Promise.all(ids.map((id, index) => api.from('banners').update({ position: index + 1 }).eq('id', id).then(unwrap)))
}
