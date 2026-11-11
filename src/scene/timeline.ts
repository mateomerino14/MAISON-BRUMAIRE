import { remap, smootherstep } from '../scroll/keyframes'

/** Tramos del recorrido, medidos en paradas del scroll. */
export const LID_OPEN = { from: 1.4, to: 2.1 } as const
export const LEAVES_FLIGHT = { from: 1.8, to: 3.9 } as const
export const TEAPOT_LIFT = { from: 4.35, to: 4.8 } as const
export const TEAPOT_RETURN = { from: 5.25, to: 5.7 } as const
export const CUP_FILL = { from: 4.6, to: 5.2 } as const
export const COLLECTION_RISE = { from: 3.15, to: 3.9 } as const
export const FEATURE_TIN_ENTER = { from: 0.7, to: 1.3 } as const
export const FEATURE_TIN_LEAVE = { from: 3.3, to: 3.8 } as const

const LID_RISE = 0.32
const LID_TILT = 0.38
const TEAPOT_RAISE = 0.9
const TEAPOT_SHIFT = 0.35
const TEAPOT_TILT = 0.68
const POURING_THRESHOLD = 0.92
const COLLECTION_STAGGER = 0.12

/** Pose de la tapa de la lata destacada. */
export interface LidPose {
  rise: number
  tilt: number
}

/** Pose de la tetera mientras sirve. */
export interface TeapotPose {
  raise: number
  shift: number
  tilt: number
  pouring: boolean
}

/** Abre la tapa de la lata a medida que se acerca su sección. */
export function lidPose(progress: number): LidPose {
  const t = smootherstep(remap(progress, LID_OPEN.from, LID_OPEN.to))
  return { rise: t * LID_RISE, tilt: t * LID_TILT }
}

/** Avance del vuelo de las hojas, de 0 (dentro de la lata) a 1 (dispersas en la bruma). */
export function leafFlight(progress: number): number {
  return remap(progress, LEAVES_FLIGHT.from, LEAVES_FLIGHT.to)
}

/** Levanta, inclina y devuelve la tetera alrededor de la sección del ritual. */
export function teapotPose(progress: number): TeapotPose {
  const up = smootherstep(remap(progress, TEAPOT_LIFT.from, TEAPOT_LIFT.to))
  const down = smootherstep(remap(progress, TEAPOT_RETURN.from, TEAPOT_RETURN.to))
  const amount = up * (1 - down)
  const filling = progress < CUP_FILL.to
  return {
    raise: amount * TEAPOT_RAISE,
    shift: amount * TEAPOT_SHIFT,
    tilt: amount * TEAPOT_TILT,
    pouring: amount > POURING_THRESHOLD && filling,
  }
}

/** Nivel del té en la taza, de 0 (vacía) a 1 (llena). */
export function cupFill(progress: number): number {
  return smootherstep(remap(progress, CUP_FILL.from, CUP_FILL.to))
}

/** Cuánto emergió de la bruma cada lata de la colección; las de la derecha llegan después. */
export function collectionReveal(progress: number, index: number): number {
  const delay = index * COLLECTION_STAGGER
  return smootherstep(remap(progress, COLLECTION_RISE.from + delay, COLLECTION_RISE.to + delay))
}

/** Presencia de la lata protagonista: solo está en escena entre la tetera y la colección. */
export function featureTinPresence(progress: number): number {
  const enter = smootherstep(remap(progress, FEATURE_TIN_ENTER.from, FEATURE_TIN_ENTER.to))
  const leave = smootherstep(remap(progress, FEATURE_TIN_LEAVE.from, FEATURE_TIN_LEAVE.to))
  return enter * (1 - leave)
}
