import { STORY_STOPS } from './content/story'
import { Experience } from './scene/Experience'
import { useSmoothScroll } from './scroll/useSmoothScroll'
import { CartProvider } from './shop/CartContext'
import { CollectionSection } from './ui/CollectionSection'
import { Header } from './ui/Header'
import { Hero } from './ui/Hero'
import { Loader } from './ui/Loader'
import { StorySection } from './ui/StorySection'

/** Página completa: escena 3D detrás y recorrido de secciones delante. */
export default function App() {
  useSmoothScroll()
  return (
    <CartProvider>
      <Experience />
      <Loader />
      <Header />
      <main>
        <Hero />
        {STORY_STOPS.map((stop) => (
          <StorySection key={stop.id} stop={stop} />
        ))}
        <CollectionSection />
      </main>
    </CartProvider>
  )
}
