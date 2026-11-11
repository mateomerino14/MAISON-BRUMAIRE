/** Progreso compartido entre el DOM y la escena, fuera del estado de React. */
export interface ScrollState {
  progress: number
  smoothed: number
}

export const scrollState: ScrollState = {
  progress: 0,
  smoothed: 0,
}

const FOLLOW_SPEED = 4

/** Acerca el progreso suavizado al real según el tiempo transcurrido. */
export function followProgress(state: ScrollState, deltaSeconds: number): number {
  const factor = 1 - Math.exp(-FOLLOW_SPEED * deltaSeconds)
  state.smoothed += (state.progress - state.smoothed) * factor
  return state.smoothed
}

/** Convierte la posición del scroll en paradas: vale n cuando la sección n está centrada. */
export function measureProgress(scrollY: number, viewportHeight: number, firstTop: number, sectionHeight: number): number {
  if (sectionHeight <= 0) {
    return 0
  }
  return (scrollY + viewportHeight / 2 - firstTop) / sectionHeight - 0.5
}
