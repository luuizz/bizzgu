const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

export const formatBRL = (value) => currency.format(Number(value) || 0)
export const formatDateTime = (value) => (value ? dateTime.format(new Date(value)) : '—')
export const formatDate = (value) => (value ? dateOnly.format(new Date(value)) : '—')
export const formatOrderNumber = (id) => `#${String(id).padStart(5, '0')}`

export const FREE_SHIPPING_FROM = 299
export const SHIPPING_FEE = 19.9
// Espelha a função public.shipping_for do banco (o valor final é sempre o do servidor)
export const shippingFor = (subtotal) => (subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_FEE)

export function installments(value, max = 10) {
    const times = Math.min(max, Math.max(1, Math.floor(value / 50)))
    return { times, value: value / times }
}

export function discountPercent(price, compareAt) {
    if (!compareAt || Number(compareAt) <= Number(price)) return 0
    return Math.round((1 - Number(price) / Number(compareAt)) * 100)
}

// Caminhos sem "http" vêm da pasta public/ do site
export function imageUrl(path) {
    if (!path) return ''
    if (/^(https?:|data:|blob:)/.test(path)) return path
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export function slugify(text) {
    return String(text || '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/&/g, ' e ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export const onlyDigits = (value) => String(value || '').replace(/\D/g, '')

export function maskCep(value) {
    const d = onlyDigits(value).slice(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function maskPhone(value) {
    const d = onlyDigits(value).slice(0, 11)
    if (d.length <= 2) return d
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export const ORDER_STATUS = {
    pending: { label: 'Aguardando pagamento', tone: 'warning' },
    paid: { label: 'Pago', tone: 'info' },
    shipped: { label: 'Enviado', tone: 'primary' },
    delivered: { label: 'Entregue', tone: 'success' },
    canceled: { label: 'Cancelado', tone: 'danger' },
}

export const ORDER_FLOW = ['pending', 'paid', 'shipped', 'delivered']

export const PAYMENT_METHODS = {
    pix: 'Pix',
    credit_card: 'Cartão de crédito',
    boleto: 'Boleto bancário',
}

export const BR_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]
