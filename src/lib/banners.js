// Tamanhos das artes: computador 1920x480 (4:1) e celular 1080x1080 (1:1)
export const BANNER_SIZES = { desktop: '1920 × 480 px', mobile: '1080 × 1080 px' }

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

// Situação do banner para quem visita a loja agora
export function bannerStatus(banner) {
    const now = Date.now()
    if (!banner.active) return { label: 'Inativo', tone: 'neutral' }
    if (banner.starts_at && new Date(banner.starts_at) > now) return { label: `Agendado · ${dateFormat.format(new Date(banner.starts_at))}`, tone: 'info' }
    if (banner.ends_at && new Date(banner.ends_at) <= now) return { label: 'Encerrado', tone: 'warning' }
    return { label: 'No ar', tone: 'success' }
}
