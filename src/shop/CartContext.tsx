import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { TeaId } from '../content/teas'
import { addItem, EMPTY_CART, removeItem, type Cart } from './cart'

type CartAction = { type: 'add'; id: TeaId } | { type: 'remove'; id: TeaId } | { type: 'clear' }

/** Lo que el carrito ofrece a la interfaz. */
interface CartContextValue {
  cart: Cart
  isOpen: boolean
  add: (id: TeaId) => void
  remove: (id: TeaId) => void
  clear: () => void
  open: () => void
  close: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

/** Aplica una acción al carrito con las funciones puras de cart.ts. */
function cartReducer(cart: Cart, action: CartAction): Cart {
  if (action.type === 'add') {
    return addItem(cart, action.id)
  }
  if (action.type === 'remove') {
    return removeItem(cart, action.id)
  }
  return EMPTY_CART
}

/** Guarda el carrito y si su panel está abierto. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, EMPTY_CART)
  const [isOpen, setIsOpen] = useState(false)
  const add = useCallback((id: TeaId) => dispatch({ type: 'add', id }), [])
  const remove = useCallback((id: TeaId) => dispatch({ type: 'remove', id }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const value = useMemo(
    () => ({ cart, isOpen, add, remove, clear, open, close }),
    [cart, isOpen, add, remove, clear, open, close],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/** Acceso al carrito desde cualquier componente dentro de CartProvider. */
export function useCart(): CartContextValue {
  const value = useContext(CartContext)
  if (value === null) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return value
}
