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
                // Endereços do site que podem enviar imagens, separados por vírgula.
                // Mudou o domínio do site? Troque aqui e rode `neon deploy` de novo.
                ALLOWED_ORIGINS: 'https://bizzgu.vercel.app,http://localhost:5173',
                BUCKET_NAME: 'product-images',
            },
        },
    },
})
