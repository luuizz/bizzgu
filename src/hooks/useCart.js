import { useContext } from 'react'
import { CartContext } from '../context/contexts'

export const useCart = () => useContext(CartContext)
