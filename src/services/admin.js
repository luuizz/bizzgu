import { supabase, PRODUCT_IMAGES_BUCKET } from '../lib/supabase'
import { unwrap } from './unwrap'

// ---------- Painel ----------
export async function getDashboard() {
    return unwrap(await supabase.rpc('admin_dashboard'))
}

// ---------- Pedidos ----------
export async function listOrders({ status, search, page = 1, pageSize = 20 } = {}) {
    let query = supabase
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
    return unwrap(await supabase.rpc('admin_update_order_status', { p_order_id: id, p_status: status }))
}

// ---------- Produtos ----------
export async function listAllProducts({ search, categoryId } = {}) {
    let query = supabase
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
    return unwrap(await supabase.from('products').select('*').eq('id', id).maybeSingle())
}

export async function saveProduct(id, values) {
    const query = id
        ? supabase.from('products').update(values).eq('id', id)
        : supabase.from('products').insert(values)
    return unwrap(await query.select().single())
}

export async function deleteProduct(id) {
    return unwrap(await supabase.from('products').delete().eq('id', id))
}

export async function uploadProductImage(file) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type })
    if (error) throw new Error(error.message)

    return supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl
}

// Apaga do Storage imagens que foram enviadas pelo painel (as de public/ ficam)
export async function removeProductImages(urls) {
    const marker = `/object/public/${PRODUCT_IMAGES_BUCKET}/`
    const paths = urls.filter((url) => url.includes(marker)).map((url) => url.split(marker)[1])
    if (paths.length) await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(paths)
}

// ---------- Categorias ----------
export async function listCategoriesWithCount() {
    return unwrap(await supabase.from('categories').select('*, products(count)').order('sort_order').order('name'))
}

export async function saveCategory(id, values) {
    const query = id
        ? supabase.from('categories').update(values).eq('id', id)
        : supabase.from('categories').insert(values)
    return unwrap(await query.select().single())
}

export async function deleteCategory(id) {
    return unwrap(await supabase.from('categories').delete().eq('id', id))
}

// ---------- Clientes ----------
export async function listUsers({ search } = {}) {
    let query = supabase
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
    return unwrap(await supabase.rpc('admin_set_role', { p_user_id: userId, p_role: role }))
}
