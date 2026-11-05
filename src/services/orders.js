import { api } from '../lib/api'
import { unwrap } from './unwrap'

export async function createOrder({ items, customer, address, paymentMethod }) {
    return unwrap(await api.rpc('create_order', {
        p_items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        p_customer: customer,
        p_address: address,
        p_payment_method: paymentMethod,
    }))
}

export async function getMyOrders({ limit } = {}) {
    let query = api
        .from('orders')
        .select('id, status, total, payment_method, created_at, order_items(id, product_name, product_image, quantity)')
        .order('created_at', { ascending: false })
    if (limit) query = query.limit(limit)
    return unwrap(await query)
}

export async function getOrder(id) {
    return unwrap(await api.from('orders').select('*, order_items(*)').eq('id', id).maybeSingle())
}

export async function payOrder(id) {
    return unwrap(await api.rpc('pay_order', { p_order_id: id }))
}

export async function cancelOrder(id) {
    return unwrap(await api.rpc('cancel_order', { p_order_id: id }))
}
