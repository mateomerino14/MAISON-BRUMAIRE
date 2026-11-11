/** Superficie del té dentro de la taza, en coordenadas del modelo. */
export interface TeaSurface {
  height: number
  radius: number
}

/** Pared interior de la taza (altura, radio), copiada del perfil de tools/blender/models.py. */
const INNER_WALL: readonly (readonly [number, number])[] = [
  [0.12, 0.0],
  [0.18, 0.29],
  [0.33, 0.385],
  [0.49, 0.43],
]

export const EMPTY_HEIGHT = 0.15
export const FULL_HEIGHT = 0.44
/** Altura y radio con que el disco de té sale de Blender. */
export const MODEL_TEA_HEIGHT = 0.46
export const MODEL_TEA_RADIUS = 0.42

/** Radio interior de la taza a una altura dada, interpolando el perfil. */
export function innerRadiusAt(height: number): number {
  const first = INNER_WALL[0]
  if (height <= first[0]) {
    return first[1]
  }
  for (let i = 1; i < INNER_WALL.length; i++) {
    const [h1, r1] = INNER_WALL[i]
    if (height <= h1) {
      const [h0, r0] = INNER_WALL[i - 1]
      return r0 + ((height - h0) / (h1 - h0)) * (r1 - r0)
    }
  }
  return INNER_WALL[INNER_WALL.length - 1][1]
}

/** Altura y radio de la superficie del té para un nivel de llenado entre 0 y 1. */
export function teaSurface(fill: number): TeaSurface {
  const height = EMPTY_HEIGHT + (FULL_HEIGHT - EMPTY_HEIGHT) * fill
  return { height, radius: innerRadiusAt(height) }
}
