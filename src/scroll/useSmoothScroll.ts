import Lenis from 'lenis'
import { useEffect } from 'react'
import { clamp } from './keyframes'
import { measureProgress, scrollState } from './scrollState'

const STOP_SELECTOR = '[data-stop]'
const SMOOTH_DURATION = 1.2

/** Activa el scroll suave y mantiene actualizado el progreso en paradas. */
export function useSmoothScroll(): void {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | null = null
    if (!reducedMotion) {
      lenis = new Lenis({ autoRaf: true, duration: SMOOTH_DURATION })
    }

    const update = (): void => {
      const stops = document.querySelectorAll<HTMLElement>(STOP_SELECTOR)
      if (stops.length === 0) {
        return
      }
      const first = stops[0]
      const raw = measureProgress(window.scrollY, window.innerHeight, first.offsetTop, first.offsetHeight)
      scrollState.stopCount = stops.length
      scrollState.progress = clamp(raw, 0, stops.length - 1)
    }

    update()
    scrollState.smoothed = scrollState.progress
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      lenis?.destroy()
    }
  }, [])
}
