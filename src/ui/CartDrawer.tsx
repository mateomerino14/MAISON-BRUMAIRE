import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { TeaId } from '../content/teas'
import { cartLines, shippingCents, totalCents, type CartLine } from '../shop/cart'
import { useCart } from '../shop/CartContext'
import { formatPrice } from '../shop/price'

const ORDER_NUMBER = 'N.º 1793-0042, París'
const WRITE_START_SECONDS = 0.55
const WRITE_STAGGER_SECONDS = 0.35
const META_DELAY_SECONDS = 0.4
const FOOTER_DELAY_SECONDS = 0.15

/** Pedido sellado: se guarda para mostrarlo bajo el sello aunque el carrito quede vacío. */
interface SealedOrder {
  lines: CartLine[]
  subtotalCents: number
  shippingCents: number
}

interface SlipLineProps {
  line: CartLine
  index: number
  editable: boolean
  onAdd: (id: TeaId) => void
  onRemove: (id: TeaId) => void
}

/** Retraso de una animación de la nota según el renglón en que aparece. */
function slipDelay(index: number, extraSeconds: number): CSSProperties {
  return { animationDelay: `${WRITE_START_SECONDS + index * WRITE_STAGGER_SECONDS + extraSeconds}s` }
}

/** Cantidad de latas en singular o plural. */
function unitsLabel(units: number): string {
  if (units === 1) {
    return '1 lata'
  }
  return `${units} latas`
}

/** Renglón de la nota: se escribe de izquierda a derecha con puntos guía hasta el precio. */
function SlipLine({ line, index, editable, onAdd, onRemove }: SlipLineProps) {
  return (
    <li>
      <div className="slip-line-main" style={slipDelay(index, 0)}>
        <span className="slip-line-name">{line.tea.name}</span>
        <span className="slip-leader" aria-hidden="true" />
        <span className="slip-line-price">{formatPrice(line.subtotalCents)}</span>
      </div>
      <div className="slip-line-meta" style={slipDelay(index, META_DELAY_SECONDS)}>
        {editable && (
          <button
            type="button"
            className="slip-step"
            onClick={() => onRemove(line.tea.id)}
            aria-label={`Quitar una lata de ${line.tea.name}`}
          >
            −
          </button>
        )}
        <span className="slip-units" aria-live="polite">
          {unitsLabel(line.units)}
        </span>
        {editable && (
          <button
            type="button"
            className="slip-step"
            onClick={() => onAdd(line.tea.id)}
            aria-label={`Agregar una lata de ${line.tea.name}`}
          >
            +
          </button>
        )}
        <span>a {formatPrice(line.tea.priceCents)} la lata</span>
      </div>
    </li>
  )
}

/** Carrito con forma de nota de pedido en papel pautado, que se confirma con un sello de lacre. */
export function CartDrawer() {
  const { cart, isOpen, add, remove, clear, close } = useCart()
  const [sealed, setSealed] = useState<SealedOrder | null>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const lines = cartLines(cart)

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

  // El sello se muestra hasta que el visitante vuelve a llenar el carrito.
  let sealedOrder: SealedOrder | null = null
  if (sealed !== null && lines.length === 0) {
    sealedOrder = sealed
  }
  let shownLines = lines
  let subtotal = totalCents(cart)
  let shipping = shippingCents(cart)
  if (sealedOrder !== null) {
    shownLines = sealedOrder.lines
    subtotal = sealedOrder.subtotalCents
    shipping = sealedOrder.shippingCents
  }
  const isSealed = sealedOrder !== null
  const isBlank = shownLines.length === 0
  let shippingLabel = formatPrice(shipping)
  if (shipping === 0) {
    shippingLabel = 'Gratis'
  }

  const seal = (): void => {
    if (lines.length === 0) {
      return
    }
    setSealed({ lines, subtotalCents: totalCents(cart), shippingCents: shippingCents(cart) })
    clear()
  }

  return (
    <>
      {isOpen && <div className="drawer-backdrop" onClick={close} />}
      <aside className="order-slip" data-open={isOpen} aria-hidden={!isOpen} aria-label="Carrito" role="dialog">
        <div className="slip-head">
          <div>
            <h2>Bon de commande</h2>
            <p className="slip-number">{ORDER_NUMBER}</p>
          </div>
          <button type="button" ref={closeButton} className="button-quiet" onClick={close}>
            Cerrar
          </button>
        </div>

        {isOpen && (
          <div className="slip-body" data-lenis-prevent>
            {isBlank && <p className="slip-blank">La nota está en blanco. Elige un té de la colección.</p>}

            {!isBlank && (
              <ul className="slip-lines">
                {shownLines.map((line, index) => (
                  <SlipLine
                    key={line.tea.id}
                    line={line}
                    index={index}
                    editable={!isSealed}
                    onAdd={add}
                    onRemove={remove}
                  />
                ))}
              </ul>
            )}

            {isSealed && (
              <p className="slip-stamp" aria-hidden="true">
                Commande confirmée
              </p>
            )}

            {!isBlank && (
              <div className="slip-foot" style={slipDelay(shownLines.length, FOOTER_DELAY_SECONDS)}>
                <div className="slip-row">
                  <span>Envío</span>
                  <span>{shippingLabel}</span>
                </div>
                <div className="slip-total">
                  <span>Total</span>
                  <span className="slip-total-amount">{formatPrice(subtotal + shipping)}</span>
                </div>
                <div className="slip-seal">
                  <div className="seal-wrap">
                    {isSealed && <span className="seal-ink" aria-hidden="true" />}
                    <button
                      type="button"
                      className="seal-button"
                      onClick={seal}
                      disabled={isSealed}
                      aria-label="Sellar y confirmar el pedido"
                    >
                      MB
                    </button>
                  </div>
                  {!isSealed && (
                    <div>
                      <p className="seal-title">Sellar el pedido</p>
                      <p className="seal-note">Toca el lacre para confirmar. Es una demostración: no se cobra nada.</p>
                    </div>
                  )}
                  {isSealed && (
                    <div role="status">
                      <p className="seal-title">Pedido sellado</p>
                      <p className="seal-note">
                        No se cobró nada.{' '}
                        <button type="button" className="link-button" onClick={() => setSealed(null)}>
                          Empezar otra nota
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
