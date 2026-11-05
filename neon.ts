// Configuração opcional do Neon para o upload de imagens pelo painel admin.
// Usada pela Neon CLI: `neon link` e depois `neon deploy --env .env.neon`.
// O site funciona sem isso (as imagens podem ser adicionadas por link).
import { defineConfig } from '@neon/config/v1'

export default defineConfig({
    auth: true,
    dataApi: true,

    // Bucket com leitura pública: as fotos aparecem na loja sem login
    buckets: {
        'product-images': { access: 'public_read' },
    },

    // O identificador da função só aceita letras minúsculas e números (até 20)
    functions: {
        productimages: {
            name: 'Upload de imagens de produtos',
            source: './functions/product-images.ts',
            env: {
                // Endereço(s) do site, separados por vírgula. Ex.: https://bizzgu.vercel.app,http://localhost:5173
                ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS!,
                BUCKET_NAME: 'product-images',
            },
        },
    },
})
