import { STORY_STOPS } from './content/story'
import { Experience } from './scene/Experience'
import { useSmoothScroll } from './scroll/useSmoothScroll'
import { Hero } from './ui/Hero'
import { StorySection } from './ui/StorySection'

/** Página completa: escena 3D detrás y recorrido de secciones delante. */
export default function App() {
  useSmoothScroll()
  return (
    <>
      <Experience />
      <main>
        <Hero />
        {STORY_STOPS.map((stop) => (
          <StorySection key={stop.id} stop={stop} />
        ))}
      </main>
    </>
  )
}
