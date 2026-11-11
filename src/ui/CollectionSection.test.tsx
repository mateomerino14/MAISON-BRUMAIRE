import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CartProvider } from '../shop/CartContext'
import { CartDrawer } from './CartDrawer'
import { CollectionSection } from './CollectionSection'
import { Header } from './Header'

/** Monta la colección con el encabezado y el carrito, como en la página. */
function renderShop() {
  return render(
    <CartProvider>
      <Header />
      <CollectionSection />
      <CartDrawer />
    </CartProvider>,
  )
}

describe('colección y carrito', () => {
  it('muestra las cuatro mezclas con su precio', () => {
    renderShop()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByRole('heading', { name: 'Brume de Montmartre' })).toBeInTheDocument()
  })

  it('agregar un té actualiza el botón y el contador del encabezado', () => {
    renderShop()
    const [firstButton] = screen.getAllByRole('button', { name: 'Agregar al carrito' })
    fireEvent.click(firstButton)
    expect(screen.getByRole('button', { name: 'Agregar otra' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 en el carrito')
    expect(screen.getByRole('button', { name: 'Abrir el carrito, 1 latas' })).toBeInTheDocument()
  })

  it('confirmar el pedido vacía el carrito y avisa que es una demostración', () => {
    renderShop()
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[1])
    fireEvent.click(screen.getByRole('button', { name: /Abrir el carrito/ }))
    const drawer = screen.getByRole('dialog', { name: 'Carrito' })
    fireEvent.click(within(drawer).getByRole('button', { name: 'Confirmar pedido' }))
    expect(within(drawer).getByRole('status')).toHaveTextContent('no se cobró nada')
    expect(screen.getByRole('button', { name: 'Abrir el carrito, 0 latas' })).toBeInTheDocument()
  })
})
