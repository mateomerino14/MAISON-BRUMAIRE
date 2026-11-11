import { PORTFOLIO_NOTICE } from '../content/story'
import { useCart } from '../shop/CartContext'
import { Stop } from './Stop'

/** Cierre del recorrido con los accesos a la colección y al carrito. */
export function ClosingSection() {
  const { open } = useCart()
  return (
    <Stop id="cierre" className="closing">
      <div className="closing-text">
        <h2>Tu taza está servida.</h2>
        <div className="closing-actions">
          <a className="button-primary" href="#coleccion">
            Ver la colección
          </a>
          <button type="button" className="button-quiet" onClick={open}>
            Abrir el carrito
          </button>
        </div>
      </div>
      <footer className="site-footer">
        <p>{PORTFOLIO_NOTICE}</p>
        <p>
          Diseño y desarrollo:{' '}
          <a href="https://github.com/mateomerino14" rel="noreferrer">
            Mateo Merino
          </a>
        </p>
      </footer>
    </Stop>
  )
}
