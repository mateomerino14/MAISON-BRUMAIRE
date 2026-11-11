import { lerpVec3, remap, smootherstep, type Vec3 } from '../scroll/keyframes'

/** Valores aleatorios fijos de una hoja, para que cada una vuele distinto. */
export interface LeafSeed {
  angle: number
  radius: number
  height: number
  speed: number
  spin: number
  size: number
  delay: number
}

/** Posición, giro y escala de una hoja en un instante. */
export interface LeafTransform {
  position: Vec3
  rotation: Vec3
  scale: number
}

const GATHER_END = 0.45
const APPEAR_END = 0.12
const FADE_START = 0.82
const MAX_DELAY = 0.15
const ORBIT_TURNS = 5
const ORBIT_SPEED = 0.25
const SPREAD_GROWTH = 0.8
const TWIST_SPEED = 0.1

/** Rangos de las semillas: cada valor sale de min + aleatorio × rango. */
const SEED_RADIUS = { min: 0.6, range: 1.8 } as const
const SEED_HEIGHT_RANGE = 2.2
const SEED_SPEED = { min: 0.5, range: 1 } as const
const SEED_SPIN_RANGE = 4
const SEED_SIZE = { min: 0.12, range: 0.1 } as const

/** Generador pseudoaleatorio reproducible (mulberry32); sus constantes son las del algoritmo publicado. */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Crea las semillas de todas las hojas a partir de una semilla fija. */
export function createLeafSeeds(count: number, seed: number): LeafSeed[] {
  const random = createRandom(seed)
  return Array.from({ length: count }, () => ({
    angle: random() * Math.PI * 2,
    radius: SEED_RADIUS.min + random() * SEED_RADIUS.range,
    height: (random() - 0.5) * SEED_HEIGHT_RANGE,
    speed: SEED_SPEED.min + random() * SEED_SPEED.range,
    spin: (random() - 0.5) * SEED_SPIN_RANGE,
    size: SEED_SIZE.min + random() * SEED_SIZE.range,
    delay: random() * MAX_DELAY,
  }))
}

/** Ubica una hoja: sale de la lata, gira en espiral alrededor del centro y se pierde en la bruma. */
export function leafTransform(seed: LeafSeed, flight: number, time: number, mouth: Vec3, center: Vec3): LeafTransform {
  const local = remap(flight, seed.delay, 1)
  const gather = smootherstep(remap(local, 0, GATHER_END))
  const appear = smootherstep(remap(local, 0, APPEAR_END))
  const fade = 1 - smootherstep(remap(local, FADE_START, 1))
  const base = lerpVec3(mouth, center, gather)
  const radius = seed.radius * gather * (1 + local * SPREAD_GROWTH)
  const angle = seed.angle + local * ORBIT_TURNS * seed.speed + time * ORBIT_SPEED * seed.speed
  const position: Vec3 = [
    base[0] + Math.cos(angle) * radius,
    base[1] + seed.height * gather,
    base[2] + Math.sin(angle) * radius,
  ]
  const twist = seed.spin * (local + time * TWIST_SPEED)
  return {
    position,
    rotation: [twist, angle, twist * 0.5],
    scale: seed.size * appear * fade,
  }
}
