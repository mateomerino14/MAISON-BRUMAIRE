import { useProgress } from '@react-three/drei'

const COMPLETE = 100

/** Cortina inicial mientras se descargan los modelos. */
export function Loader() {
  const { active, progress } = useProgress()
  const done = !active && progress >= COMPLETE
  return (
    <div className="loader" data-done={done} aria-hidden={done}>
      <p>Calentando el agua…</p>
      <span className="loader-bar" style={{ transform: `scaleX(${progress / COMPLETE})` }} />
    </div>
  )
}
