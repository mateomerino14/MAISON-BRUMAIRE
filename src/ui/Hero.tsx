import { BRAND_INTRO, BRAND_NAME, BRAND_TAGLINE } from '../content/story'
import { Stop } from './Stop'

/** Portada: el nombre de la casa sobre la tetera que humea. */
export function Hero() {
  return (
    <Stop id="inicio" className="hero">
      <h1 className="hero-title">{BRAND_NAME}</h1>
      <div className="hero-copy">
        <p className="hero-tagline">{BRAND_TAGLINE}</p>
        <p className="hero-intro">{BRAND_INTRO}</p>
      </div>
      <p className="scroll-hint">Baja para servir una taza</p>
    </Stop>
  )
}
