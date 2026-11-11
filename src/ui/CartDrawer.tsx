import { useEffect, useRef, useState } from 'react'
import { cartLines, totalCents } from '../shop/cart'
import { useCart } from '../shop/CartContext'
import { formatPrice } from '../shop/price'

/** Panel lateral con el carrito y la confirmación de demostración. */
export function CartDrawer() {
  const { cart, isOpen, add, remove, clear, close } = useCart()
  const [confirmed, setConfirmed] = useState(false)
  const closeButton = useRef<HTMLButtonElement>(null)
  const lines = cartLines(cart)
  // La confirmación se oculta sola en cuanto el visitante vuelve a llenar el carrito.
  const showConfirmation = confirmed && lines.length === 0

  useEffect(() => {
    if (!isOpen) {
      return
    }
    closeButton.current?.focus()
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const confirm = (): void => {
    clear()
    setConfirmed(true)
  }

  return (
    <>
      {isOpen && <div className="drawer-backdrop" onClick={close} />}
      <aside className="cart-drawer" data-open={isOpen} aria-hidden={!isOpen} aria-label="Carrito" role="dialog">
        <div className="drawer-head">
          <h2>Tu carrito</h2>
          <button type="button" ref={closeButton} className="button-quiet" onClick={close}>
            Cerrar
          </button>
        </div>

        {showConfirmation && (
          <p className="drawer-message" role="status">
            Pedido confirmado. Es una tienda de demostración: no se cobró nada.
          </p>
        )}
        {!showConfirmation && lines.length === 0 && (
          <p className="drawer-message">Todavía no elegiste ningún té. Agrégalos desde la colección.</p>
        )}

        {lines.length > 0 && (
          <>
            <ul className="cart-lines">
              {lines.map((line) => (
                <li key={line.tea.id} className="cart-line">
                  <span className="cart-swatch" style={{ background: line.tea.labelColor }} />
                  <div>
                    <p className="cart-line-name">{line.tea.name}</p>
                    <p className="cart-line-price">{formatPrice(line.subtotalCents)}</p>
                  </div>
                  <div className="stepper">
                    <button type="button" onClick={() => remove(line.tea.id)} aria-label={`Quitar una lata de ${line.tea.name}`}>
                      −
                    </button>
                    <span aria-live="polite">{line.units}</span>
                    <button type="button" onClick={() => add(line.tea.id)} aria-label={`Agregar una lata de ${line.tea.name}`}>
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer-total">
              <span>Total</span>
              <span>{formatPrice(totalCents(cart))}</span>
            </div>
            <button type="button" className="button-primary drawer-confirm" onClick={confirm}>
              Confirmar pedido
            </button>
            <p className="drawer-note">Demostración: al confirmar no se cobra nada.</p>
          </>
        )}
      </aside>
    </>
  )
}
