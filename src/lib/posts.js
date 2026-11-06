// Situação de um post para quem visita o site agora
export function postStatus(post) {
    if (post.status !== 'published') return { label: 'Rascunho', tone: 'neutral' }
    if (post.published_at && new Date(post.published_at) > new Date()) return { label: 'Agendado', tone: 'info' }
    return { label: 'Publicado', tone: 'success' }
}

// <input type="datetime-local"> trabalha com horário local sem fuso
export const toLocalInput = (iso) => {
    if (!iso) return ''
    const date = new Date(iso)
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}
export const fromLocalInput = (value) => (value ? new Date(value).toISOString() : null)

// Tempo de leitura estimado (200 palavras por minuto)
export function readingMinutes(html) {
    const text = (html || '').replace(/<[^>]+>/g, ' ')
    const words = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 200))
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
export const formatPostDate = (iso) => (iso ? dateFormat.format(new Date(iso)) : '')
