// Neon Function: upload e remoção de imagens de produtos no Object Storage.
//
// POST   (corpo = o arquivo, Content-Type = tipo da imagem) → { url }
// DELETE (corpo = { "url": "..." })                         → { ok: true }
//
// Só administradores da loja podem usar: o JWT do Neon Auth é validado e o
// papel é conferido na tabela public.profiles.
import { createRemoteJWKSet, jwtVerify } from 'jose'
import pg from 'pg'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const env = process.env
const BUCKET = env.BUCKET_NAME || 'product-images'
const MAX_SIZE = 5 * 1024 * 1024
const TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
}

// Origens do site que podem chamar a função (separadas por vírgula)
const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean)

const jwks = createRemoteJWKSet(new URL(env.NEON_AUTH_JWKS_URL as string))
const issuer = new URL(env.NEON_AUTH_BASE_URL as string).origin
const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 3 })
const s3 = new S3Client({
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT_URL_S3,
    credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID as string, secretAccessKey: env.AWS_SECRET_ACCESS_KEY as string },
    forcePathStyle: true,
    requestChecksumCalculation: 'WHEN_REQUIRED',
})

// Bucket público (public_read): os arquivos ficam acessíveis no endpoint do storage
const publicBase = (env.PUBLIC_BASE_URL || `${env.AWS_ENDPOINT_URL_S3}/${BUCKET}`).replace(/\/$/, '')

function corsHeaders(request: Request): Record<string, string> {
    const origin = request.headers.get('Origin') || ''
    return {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
    }
}

function json(request: Request, status: number, body: unknown) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
    })
}

async function requireAdmin(request: Request) {
    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
    if (!token) return null
    try {
        const { payload } = await jwtVerify(token, jwks, { issuer })
        if (payload.role !== 'authenticated' || !payload.sub) return null
        const { rows } = await pool.query('select role from public.profiles where id = $1', [payload.sub])
        return rows[0]?.role === 'admin' ? payload.sub : null
    } catch {
        return null
    }
}

export default {
    async fetch(request: Request): Promise<Response> {
        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) })

        const admin = await requireAdmin(request)
        if (!admin) return json(request, 403, { error: 'Acesso restrito a administradores.' })

        if (request.method === 'POST') {
            const type = (request.headers.get('Content-Type') || '').split(';')[0].trim()
            const ext = TYPES[type]
            if (!ext) return json(request, 415, { error: 'Envie uma imagem JPG, PNG, WebP, AVIF ou GIF.' })

            const body = new Uint8Array(await request.arrayBuffer())
            if (body.byteLength === 0) return json(request, 400, { error: 'Arquivo vazio.' })
            if (body.byteLength > MAX_SIZE) return json(request, 413, { error: 'A imagem deve ter no máximo 5 MB.' })

            const key = `products/${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`
            await s3.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: key,
                Body: body,
                ContentType: type,
                CacheControl: 'public, max-age=31536000, immutable',
            }))
            return json(request, 201, { url: `${publicBase}/${key}` })
        }

        if (request.method === 'DELETE') {
            const { url } = await request.json().catch(() => ({ url: '' }))
            // Só apaga arquivos deste bucket enviados pelo painel
            if (typeof url !== 'string' || !url.startsWith(`${publicBase}/products/`)) {
                return json(request, 400, { error: 'Imagem não pertence ao storage da loja.' })
            }
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: url.slice(publicBase.length + 1) }))
            return json(request, 200, { ok: true })
        }

        return json(request, 405, { error: 'Método não permitido.' })
    },
}
