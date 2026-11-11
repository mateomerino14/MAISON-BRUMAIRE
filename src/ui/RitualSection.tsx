import { RITUAL_STEPS } from '../content/story'
import { Stop } from './Stop'

/** Pasos para preparar la taza mientras la tetera sirve. */
export function RitualSection() {
  return (
    <Stop id="ritual" className="ritual">
      <div className="ritual-text">
        <h2>El ritual</h2>
        <ol className="ritual-steps">
          {RITUAL_STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Stop>
  )
}
