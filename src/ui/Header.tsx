import { BRAND_NAME } from '../content/story'
import { countUnits } from '../shop/cart'
import { useCart } from '../shop/CartContext'

/** Barra superior con el nombre de la casa y el acceso al carrito. */
export function Header() {
  const { cart, open } = useCart()
  const units = countUnits(cart)
  return (
    <header className="site-header">
      <a className="wordmark" href="#inicio">
        {BRAND_NAME}
      </a>
      <button type="button" className="cart-button" onClick={open} aria-label={`Abrir el carrito, ${units} latas`}>
        Carrito
        <span className="cart-count">{units}</span>
      </button>
    </header>
  )
}
