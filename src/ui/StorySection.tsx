import type { StoryStop } from '../content/story'
import { Stop } from './Stop'

/** Bloque de texto que acompaña una parada de la escena. */
export function StorySection({ stop }: { stop: StoryStop }) {
  return (
    <Stop id={stop.id} className={`story story-${stop.side}`}>
      <div className="story-text">
        <h2>{stop.title}</h2>
        <p>{stop.body}</p>
      </div>
    </Stop>
  )
}
