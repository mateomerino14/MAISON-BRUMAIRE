import { describe, expect, it } from 'vitest'
import { TEAS } from '../content/teas'
import {
  addItem,
  cartLines,
  countUnits,
  EMPTY_CART,
  FREE_SHIPPING_CENTS,
  MAX_UNITS_PER_TEA,
  removeItem,
  SHIPPING_CENTS,
  shippingCents,
  totalCents,
  unitsOf,
} from './cart'

describe('carrito', () => {
  it('suma latas y calcula el total', () => {
    let cart = addItem(EMPTY_CART, 'montmartre')
    cart = addItem(cart, 'montmartre')
    cart = addItem(cart, 'provence')
    expect(countUnits(cart)).toBe(3)
    expect(totalCents(cart)).toBe(2 * TEAS[0].priceCents + TEAS[3].priceCents)
  })

  it('no pasa del máximo por té', () => {
    let cart = EMPTY_CART
    for (let i = 0; i < MAX_UNITS_PER_TEA + 3; i++) {
      cart = addItem(cart, 'luxembourg')
    }
    expect(unitsOf(cart, 'luxembourg')).toBe(MAX_UNITS_PER_TEA)
  })

  it('no baja de cero y borra el té al vaciarlo', () => {
    const cart = removeItem(addItem(EMPTY_CART, 'versailles'), 'versailles')
    expect(cart).toEqual({})
    expect(removeItem(cart, 'versailles')).toEqual({})
  })

  it('ordena los renglones como el catálogo', () => {
    const cart = addItem(addItem(EMPTY_CART, 'provence'), 'montmartre')
    expect(cartLines(cart).map((line) => line.tea.id)).toEqual(['montmartre', 'provence'])
  })

  it('no modifica el carrito original', () => {
    const cart = addItem(EMPTY_CART, 'montmartre')
    addItem(cart, 'montmartre')
    expect(unitsOf(cart, 'montmartre')).toBe(1)
  })
})

describe('envío', () => {
  it('no cobra envío con el carrito vacío', () => {
    expect(shippingCents(EMPTY_CART)).toBe(0)
  })

  it('cobra envío por debajo del mínimo', () => {
    expect(totalCents(addItem(EMPTY_CART, 'montmartre'))).toBeLessThan(FREE_SHIPPING_CENTS)
    expect(shippingCents(addItem(EMPTY_CART, 'montmartre'))).toBe(SHIPPING_CENTS)
  })

  it('el envío es gratis desde el mínimo', () => {
    let cart = EMPTY_CART
    for (let i = 0; i < 3; i++) {
      cart = addItem(cart, 'montmartre')
    }
    expect(totalCents(cart)).toBeGreaterThanOrEqual(FREE_SHIPPING_CENTS)
    expect(shippingCents(cart)).toBe(0)
  })
})
