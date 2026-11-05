import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './contexts'
import { shippingFor } from '../lib/format'

const STORAGE_KEY = 'bizzgu:cart'

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
        return Array.isArray(saved) ? saved : []
    } catch {
        return []
    }
}

// Guarda só o necessário para exibir o carrinho; preço e estoque são
// conferidos de novo com o banco na página do carrinho e no checkout.
const toCartItem = (product, quantity) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    image: product.images?.[0] || null,
    stock: product.stock,
    quantity,
})

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart)

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch {
            // navegação privada ou armazenamento cheio: segue só em memória
        }
    }, [items])

    // Mantém abas diferentes sincronizadas
    useEffect(() => {
        const onStorage = (event) => event.key === STORAGE_KEY && setItems(loadCart())
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    // Retorna quantas unidades realmente entraram (respeitando o estoque)
    const addItem = useCallback((product, quantity = 1) => {
        const current = items.find((item) => item.id === product.id)?.quantity ?? 0
        const added = Math.max(0, Math.min(quantity, product.stock - current))
        if (added === 0) return 0

        setItems((prev) => {
            const exists = prev.some((item) => item.id === product.id)
            if (!exists) return [...prev, toCartItem(product, added)]
            return prev.map((item) =>
                item.id === product.id ? { ...toCartItem(product, item.quantity + added) } : item,
            )
        })
        return added
    }, [items])

    const updateQuantity = useCallback((id, quantity) => {
        setItems((prev) => prev.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item,
        ))
    }, [])

    const removeItem = useCallback((id) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const clear = useCallback(() => setItems([]), [])

    // Atualiza preço/estoque com os dados do banco e remove o que saiu de linha
    const syncWithCatalog = useCallback((products) => {
        const byId = new Map(products.map((product) => [product.id, product]))
        const changes = []

        setItems((prev) => prev.flatMap((item) => {
            const product = byId.get(item.id)
            if (!product || product.stock === 0) {
                changes.push(`"${item.name}" não está mais disponível e saiu do carrinho.`)
                return []
            }
            const quantity = Math.min(item.quantity, product.stock)
            if (quantity < item.quantity) changes.push(`"${item.name}": só restam ${product.stock} unidade(s).`)
            if (Number(product.price) !== item.price) changes.push(`O preço de "${item.name}" foi atualizado.`)
            return [toCartItem(product, quantity)]
        }))

        return changes
    }, [])

    const value = useMemo(() => {
        const count = items.reduce((total, item) => total + item.quantity, 0)
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
        const shipping = shippingFor(subtotal)
        return {
            items,
            count,
            subtotal,
            shipping,
            total: subtotal + shipping,
            addItem,
            updateQuantity,
            removeItem,
            clear,
            syncWithCatalog,
            quantityOf: (id) => items.find((item) => item.id === id)?.quantity ?? 0,
        }
    }, [items, addItem, updateQuantity, removeItem, clear, syncWithCatalog])

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
