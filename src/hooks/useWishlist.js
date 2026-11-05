import { useContext } from 'react'
import { WishlistContext } from '../context/contexts'

export const useWishlist = () => useContext(WishlistContext)
