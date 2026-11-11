import { TEAS, type Tea, type TeaId } from '../content/teas'

/** Unidades de cada té en el carrito; un té ausente equivale a cero. */
export type Cart = Partial<Record<TeaId, number>>

/** Renglón del carrito listo para mostrarse. */
export interface CartLine {
  tea: Tea
  units: number
  subtotalCents: number
}

export const MAX_UNITS_PER_TEA = 9
export const EMPTY_CART: Cart = {}

/** Unidades de un té en el carrito. */
export function unitsOf(cart: Cart, id: TeaId): number {
  return cart[id] ?? 0
}

/** Suma una lata al carrito sin pasar del máximo por pedido. */
export function addItem(cart: Cart, id: TeaId): Cart {
  return { ...cart, [id]: Math.min(unitsOf(cart, id) + 1, MAX_UNITS_PER_TEA) }
}

/** Quita una lata del carrito; al llegar a cero el té desaparece. */
export function removeItem(cart: Cart, id: TeaId): Cart {
  const units = unitsOf(cart, id) - 1
  const next = { ...cart }
  if (units <= 0) {
    delete next[id]
    return next
  }
  next[id] = units
  return next
}

/** Renglones del carrito en el orden del catálogo. */
export function cartLines(cart: Cart): CartLine[] {
  return TEAS.filter((tea) => unitsOf(cart, tea.id) > 0).map((tea) => {
    const units = unitsOf(cart, tea.id)
    return { tea, units, subtotalCents: units * tea.priceCents }
  })
}

/** Total de latas en el carrito. */
export function countUnits(cart: Cart): number {
  return cartLines(cart).reduce((sum, line) => sum + line.units, 0)
}

/** Importe total del carrito, en céntimos. */
export function totalCents(cart: Cart): number {
  return cartLines(cart).reduce((sum, line) => sum + line.subtotalCents, 0)
}

export const FREE_SHIPPING_CENTS = 5000
export const SHIPPING_CENTS = 490

/** Costo del envío: gratis desde FREE_SHIPPING_CENTS y nulo con el carrito vacío. */
export function shippingCents(cart: Cart): number {
  const total = totalCents(cart)
  if (total === 0 || total >= FREE_SHIPPING_CENTS) {
    return 0
  }
  return SHIPPING_CENTS
}
