import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// O GitHub Pages não conhece as rotas do React Router: servimos o mesmo
// index.html como 404.html para que links diretos (ex.: /produto/x) funcionem.
const spaFallback = () => ({
    name: 'spa-fallback-404',
    apply: 'build',
    closeBundle() {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
    },
})

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react(), spaFallback()],
        // Em produção o site fica em luuizz.github.io/bizzgu/. Para Vercel/Netlify use VITE_BASE_PATH=/
        base: command === 'build' ? env.VITE_BASE_PATH || '/bizzgu/' : '/',
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
