import { useEffect, useState } from 'react'
import { getCategories } from '../services/catalog'

// Categorias mudam pouco: carrega uma vez e compartilha entre os componentes
let cache = null
let pending = null
const listeners = new Set()

export function invalidateCategories() {
    cache = null
    pending = null
    load()
}

function load() {
    if (!pending) {
        pending = getCategories()
            .then((data) => {
                cache = data
                listeners.forEach((listener) => listener(data))
                return data
            })
            .catch(() => {
                pending = null
                return []
            })
    }
    return pending
}

export function useCategories() {
    const [categories, setCategories] = useState(cache || [])

    useEffect(() => {
        listeners.add(setCategories)
        if (!cache) load()
        return () => listeners.delete(setCategories)
    }, [])

    return categories
}
