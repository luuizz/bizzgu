import DOMPurify from 'dompurify'

// HTML dos posts (gerado pelo editor do painel). Mesmo vindo de admins, é
// sanitizado antes de ir para a página: só passam as tags que o editor produz.
const ALLOWED_TAGS = ['p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'hr', 'br', 'img', 'code', 'pre']
const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'title']

export function sanitizeHtml(html) {
    const clean = DOMPurify.sanitize(html || '', { ALLOWED_TAGS, ALLOWED_ATTR, ALLOWED_URI_REGEXP: /^(https?:|mailto:|tel:|\/)/i })
    // Links externos abrem em nova aba, sem passar referência
    const doc = new DOMParser().parseFromString(clean, 'text/html')
    doc.querySelectorAll('a').forEach((a) => {
        if (/^https?:/i.test(a.getAttribute('href') || '')) {
            a.setAttribute('target', '_blank')
            a.setAttribute('rel', 'noopener noreferrer')
        } else {
            a.removeAttribute('target')
            a.removeAttribute('rel')
        }
    })
    doc.querySelectorAll('img').forEach((img) => img.setAttribute('loading', 'lazy'))
    return doc.body.innerHTML
}
