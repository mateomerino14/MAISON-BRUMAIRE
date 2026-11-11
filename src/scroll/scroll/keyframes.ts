/** Vector de tres componentes en coordenadas de la escena. */
export type Vec3 = readonly [number, number, number]

/** Pose de la cámara en una parada; focus es el centro del objeto, al que se apunta en pantallas angostas. */
export interface CameraKeyframe {
  position: Vec3
  target: Vec3
  focus: Vec3
}

/** Una pose por sección; el índice coincide con el número de parada del scroll. */
export const CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  { position: [1.0, 1.7, 7.4], target: [-0.9, 1.15, 0], focus: [0.8, 0.75, 0] },
  { position: [-3.9, 2.3, 5.0], target: [-1.1, 0.75, -0.6], focus: [0.3, 0.7, 0] },
  { position: [-0.2, 1.9, -1.4], target: [-4.4, 0.75, -2.4], focus: [-4.4, 0.8, -1.0] },
  { position: [-3.0, 2.6, 1.4], target: [-5.2, 3.5, -3.8], focus: [-5.2, 2.8, -3.8] },
  { position: [-6.6, 2.3, 0.2], target: [-6.6, 0.45, -7.0], focus: [-6.6, 0.55, -7.0] },
  { position: [1.4, 1.9, 6.6], target: [-0.5, 1.0, 0], focus: [0.9, 0.95, 0] },
  { position: [1.0, 4.6, 8.4], target: [0.9, 1.5, 0], focus: [0.9, 0.6, 0] },
]

/** Recorta un valor al intervalo [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Curva suave que arranca y frena sin saltos de velocidad. */
export function smootherstep(t: number): number {
  const x = clamp(t, 0, 1)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

/** Lleva un valor del intervalo [from, to] a [0, 1], recortado en los bordes. */
export function remap(value: number, from: number, to: number): number {
  return clamp((value - from) / (to - from), 0, 1)
}

/** Interpola dos vectores. */
export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

/** Calcula la pose de la cámara para un progreso medido en paradas (0 = primera sección). */
export function sampleCamera(progress: number, keyframes: readonly CameraKeyframe[] = CAMERA_KEYFRAMES): CameraKeyframe {
  const lastIndex = keyframes.length - 1
  const clamped = clamp(progress, 0, lastIndex)
  if (clamped === lastIndex) {
    return keyframes[lastIndex]
  }
  const index = Math.min(Math.floor(clamped), lastIndex - 1)
  const local = smootherstep(clamped - index)
  const from = keyframes[index]
  const to = keyframes[index + 1]
  return {
    position: lerpVec3(from.position, to.position, local),
    target: lerpVec3(from.target, to.target, local),
    focus: lerpVec3(from.focus, to.focus, local),
  }
}

/** Ajustes de cámara para la proporción de la pantalla. */
export interface ResponsiveView {
  narrowness: number
  fov: number
  distanceScale: number
  targetDrop: number
}

const WIDE_ASPECT = 1.2
const NARROW_ASPECT = 0.45
const WIDE_FOV = 34
const NARROW_FOV = 56
const NARROW_DISTANCE_SCALE = 1.35
const NARROW_TARGET_DROP = 0.45

/** En pantallas angostas abre el ángulo, aleja la cámara y sube los objetos sobre los textos. */
export function responsiveView(aspect: number): ResponsiveView {
  const narrowness = remap(aspect, WIDE_ASPECT, NARROW_ASPECT)
  return {
    narrowness,
    fov: WIDE_FOV + (NARROW_FOV - WIDE_FOV) * narrowness,
    distanceScale: 1 + (NARROW_DISTANCE_SCALE - 1) * narrowness,
    targetDrop: NARROW_TARGET_DROP * narrowness,
  }
}
