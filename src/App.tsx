import { STORY_STOPS } from './content/story'
import { Experience } from './scene/Experience'
import { useSmoothScroll } from './scroll/useSmoothScroll'
import { CartProvider } from './shop/CartContext'
import { CartDrawer } from './ui/CartDrawer'
import { ClosingSection } from './ui/ClosingSection'
import { CollectionSection } from './ui/CollectionSection'
import { Header } from './ui/Header'
import { Hero } from './ui/Hero'
import { Loader } from './ui/Loader'
import { RitualSection } from './ui/RitualSection'
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
        <RitualSection />
        <ClosingSection />
      </main>
      <CartDrawer />
    </CartProvider>
  )
}
