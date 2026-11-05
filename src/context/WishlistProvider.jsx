import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { WishlistContext } from './contexts'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { addToWishlist, getWishlistIds, removeFromWishlist } from '../services/account'

export function WishlistProvider({ children }) {
    const { user } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()
    const location = useLocation()
    const [ids, setIds] = useState(() => new Set())

    useEffect(() => {
        if (!user) {
            setIds(new Set())
            return
        }
        getWishlistIds()
            .then((list) => setIds(new Set(list)))
            .catch(() => setIds(new Set()))
    }, [user])

    const toggle = useCallback(async (product) => {
        if (!user) {
            toast.show('Entre na sua conta para salvar na lista de desejos.', 'info')
            navigate('/login', { state: { from: location } })
            return
        }

        const saved = ids.has(product.id)
        // Atualização otimista: muda na tela e desfaz se o banco recusar
        setIds((prev) => {
            const next = new Set(prev)
            saved ? next.delete(product.id) : next.add(product.id)
            return next
        })

        try {
            if (saved) {
                await removeFromWishlist(user.id, product.id)
                toast.show('Removido da lista de desejos.')
            } else {
                await addToWishlist(user.id, product.id)
                toast.show('Salvo na lista de desejos.', 'success')
            }
        } catch (error) {
            setIds((prev) => {
                const next = new Set(prev)
                saved ? next.add(product.id) : next.delete(product.id)
                return next
            })
            toast.show(error.message, 'danger')
        }
    }, [user, ids, toast, navigate, location])

    const value = useMemo(() => ({
        ids: [...ids],
        count: ids.size,
        has: (id) => ids.has(id),
        toggle,
    }), [ids, toggle])

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
