import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Endereço público do site, usado nas tags de compartilhamento (Open Graph)
const DEFAULT_SITE_URL = 'https://bizzgu.vercel.app'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')

    return {
        plugins: [
            react(),
            {
                name: 'site-url',
                // 'pre': troca antes do Vite processar o HTML (o % quebraria a leitura das URLs)
                transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('%SITE_URL%', siteUrl) },
            },
        ],
        // Na Vercel o site fica na raiz. Para hospedar numa subpasta, use VITE_BASE_PATH=/pasta/
        base: env.VITE_BASE_PATH || '/',
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        react: ['react', 'react-dom', 'react-router-dom'],
                        neon: ['@neon/neon-js/supabase'],
                    },
                },
            },
        },
    }
})
