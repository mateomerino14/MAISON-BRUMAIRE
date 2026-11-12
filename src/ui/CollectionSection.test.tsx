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

  it('sellar la nota vacía el carrito y avisa que es una demostración', () => {
    renderShop()
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[1])
    fireEvent.click(screen.getByRole('button', { name: /Abrir el carrito/ }))
    const drawer = screen.getByRole('dialog', { name: 'Carrito' })
    expect(within(drawer).getByText('Jardin du Luxembourg')).toBeInTheDocument()
    fireEvent.click(within(drawer).getByRole('button', { name: 'Sellar y confirmar el pedido' }))
    expect(within(drawer).getByRole('status')).toHaveTextContent('No se cobró nada')
    expect(within(drawer).getByText('Pedido confirmado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir el carrito, 0 latas' })).toBeInTheDocument()
  })
})
