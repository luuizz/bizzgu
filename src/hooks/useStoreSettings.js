import { useEffect, useState } from 'react'
import { getStoreSettings } from '../services/catalog'

// Usado enquanto carrega ou se o banco não responder, para o rodapé nunca ficar vazio
export const DEFAULT_SETTINGS = {
    about_title: 'Conheça a Bizzgu',
    about_summary: 'Eletrônicos, casa e lazer com preço justo, frete grátis acima de R$ 299 e atendimento de verdade.',
    about_text: '',
    about_image: null,
    support_email: 'oi@bizzgu.com.br',
    press_email: 'contato@bizzgu.com.br',
    business_hours: '24 horas',
    phone: null,
    whatsapp: null,
    address: null,
    instagram: null,
    facebook: null,
    youtube: null,
    linkedin: null,
    x: null,
    tiktok: null,
}

// Configurações mudam pouco: carrega uma vez e compartilha entre os componentes
let cache = null
let pending = null
const listeners = new Set()

function load() {
    if (!pending) {
        pending = getStoreSettings()
            .then((data) => {
                cache = { ...DEFAULT_SETTINGS, ...(data || {}) }
                listeners.forEach((listener) => listener(cache))
                return cache
            })
            .catch(() => {
                pending = null
                return DEFAULT_SETTINGS
            })
    }
    return pending
}

// Chamado pelo painel depois de salvar
export function setStoreSettingsCache(data) {
    cache = { ...DEFAULT_SETTINGS, ...data }
    pending = Promise.resolve(cache)
    listeners.forEach((listener) => listener(cache))
}

export function useStoreSettings() {
    const [settings, setSettings] = useState(cache || DEFAULT_SETTINGS)

    useEffect(() => {
        listeners.add(setSettings)
        if (!cache) load()
        return () => listeners.delete(setSettings)
    }, [])

    return settings
}

// Redes sociais preenchidas, na ordem do rodapé
export const SOCIAL_FIELDS = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'x', label: 'X (Twitter)' },
    { key: 'tiktok', label: 'TikTok' },
]

// Divide o texto em parágrafos (linha em branco separa)
export const paragraphs = (text) => (text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
