import { TEAS, type Tea } from '../content/teas'
import { selectTea } from '../scene/selection'
import { unitsOf } from '../shop/cart'
import { useCart } from '../shop/CartContext'
import { formatPrice } from '../shop/price'
import { Stop } from './Stop'

/** Ficha de un té con su botón para agregarlo al carrito. */
function TeaEntry({ tea }: { tea: Tea }) {
  const { cart, add } = useCart()
  const units = unitsOf(cart, tea.id)
  let buttonLabel = 'Agregar al carrito'
  if (units > 0) {
    buttonLabel = 'Agregar otra'
  }
  return (
    <li
      className="tea-entry"
      style={{ '--tea-color': tea.labelColor } as React.CSSProperties}
      onPointerEnter={() => selectTea(tea.id)}
      onPointerLeave={() => selectTea(null)}
      onFocus={() => selectTea(tea.id)}
      onBlur={() => selectTea(null)}
    >
      <h3>{tea.name}</h3>
      <p className="tea-family">
        {tea.family}, lata de {tea.grams} g
      </p>
      <p className="tea-notes">{tea.notes}</p>
      <p className="tea-description">{tea.description}</p>
      <div className="tea-buy">
        {units > 0 && (
          <p className="tea-in-cart" role="status">
            {units} en el carrito
          </p>
        )}
        <span className="tea-price">{formatPrice(tea.priceCents)}</span>
        <button type="button" onClick={() => add(tea.id)}>
          {buttonLabel}
        </button>
      </div>
    </li>
  )
}

/** Catálogo de las cuatro mezclas, debajo de la fila de latas. */
export function CollectionSection() {
  return (
    <Stop id="coleccion" className="collection">
      <h2 className="collection-title">La colección de otoño</h2>
      <ul className="tea-list">
        {TEAS.map((tea) => (
          <TeaEntry key={tea.id} tea={tea} />
        ))}
      </ul>
    </Stop>
  )
}
