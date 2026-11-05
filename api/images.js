// Vercel Function: upload e remoção de imagens de produtos no Vercel Blob.
//
// POST   /api/images?pasta=products  (corpo = o arquivo, Content-Type = tipo da imagem) → { url }
//        pastas permitidas: products, banners, blog
// DELETE /api/images  (corpo = { "url": "..." })                         → { ok: true }
//
// Só administradores da loja podem usar. Quem decide é o próprio banco: a função
// repassa o token do Neon Auth para a Data API e chama public.is_admin().
// Por isso esta função não guarda senha do banco.
//
// Variáveis no projeto da Vercel:
//   NEON_DATA_API_URL      endereço da Data API (o mesmo do VITE_NEON_DATA_API_URL)
//   BLOB_READ_WRITE_TOKEN  criada automaticamente ao conectar o Blob Store ao projeto
import { put, del } from '@vercel/blob'

// Limite de corpo das Vercel Functions é 4,5 MB; deixamos uma folga
export const MAX_SIZE = 4 * 1024 * 1024
const TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
}

const FOLDERS = ['products', 'banners', 'blog']

const json = (status, body) => Response.json(body, { status })

export async function isAdmin(request) {
    const auth = request.headers.get('authorization') || ''
    const dataApi = (process.env.NEON_DATA_API_URL || '').replace(/\/$/, '')
    if (!/^Bearer\s+\S+/i.test(auth) || !dataApi) return false
    try {
        const response = await fetch(`${dataApi}/rpc/is_admin`, {
            method: 'POST',
            headers: { Authorization: auth, 'Content-Type': 'application/json' },
            body: '{}',
        })
        return response.ok && (await response.json()) === true
    } catch {
        return false
    }
}

// Só apaga arquivos do Blob da loja, dentro das pastas do painel
export function isOwnBlob(url) {
    try {
        const { protocol, hostname, pathname } = new URL(url)
        return protocol === 'https:'
            && hostname.endsWith('.public.blob.vercel-storage.com')
            && FOLDERS.some((folder) => pathname.startsWith(`/${folder}/`))
    } catch {
        return false
    }
}

function configError() {
    if (!process.env.NEON_DATA_API_URL) return 'Upload indisponível: falta NEON_DATA_API_URL no projeto da Vercel.'
    if (!process.env.BLOB_READ_WRITE_TOKEN) return 'Upload indisponível: conecte um Blob Store ao projeto da Vercel.'
    return null
}

export async function POST(request) {
    const misconfigured = configError()
    if (misconfigured) return json(503, { error: misconfigured })
    if (!(await isAdmin(request))) return json(403, { error: 'Acesso restrito a administradores.' })

    const type = (request.headers.get('content-type') || '').split(';')[0].trim()
    const ext = TYPES[type]
    if (!ext) return json(415, { error: 'Envie uma imagem JPG, PNG, WebP, AVIF ou GIF.' })

    const body = await request.arrayBuffer()
    if (body.byteLength === 0) return json(400, { error: 'Arquivo vazio.' })
    if (body.byteLength > MAX_SIZE) return json(413, { error: 'A imagem deve ter no máximo 4 MB.' })

    const requested = new URL(request.url).searchParams.get('pasta') || 'products'
    if (!FOLDERS.includes(requested)) return json(400, { error: 'Pasta inválida.' })

    const blob = await put(`${requested}/${new Date().getFullYear()}/imagem.${ext}`, body, {
        access: 'public',
        contentType: type,
        addRandomSuffix: true,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
    })

    // Confere se a imagem abre sem login. Se não abrir (ex.: Blob Store criado
    // como Private), apaga e avisa, em vez de salvar um link quebrado no produto.
    const check = await fetch(blob.url, { method: 'HEAD' }).catch(() => null)
    if (!check?.ok) {
        await del(blob.url).catch(() => {})
        return json(503, { error: 'A imagem foi enviada, mas não ficou pública. O Blob Store da Vercel precisa ser do tipo Public.' })
    }
    return json(201, { url: blob.url })
}

export async function DELETE(request) {
    const misconfigured = configError()
    if (misconfigured) return json(503, { error: misconfigured })
    if (!(await isAdmin(request))) return json(403, { error: 'Acesso restrito a administradores.' })

    const { url } = await request.json().catch(() => ({}))
    if (typeof url !== 'string' || !isOwnBlob(url)) return json(400, { error: 'Imagem não pertence ao storage da loja.' })

    await del(url)
    return json(200, { ok: true })
}
