import type { Vec3 } from '../scroll/keyframes'

/** Posiciones fijas de las piezas en la escena, en metros. */
export const TEAPOT_POSITION: Vec3 = [0, 0, 0]
export const CUP_POSITION: Vec3 = [1.75, 0, 0.1]
export const FEATURE_TIN_POSITION: Vec3 = [-4.4, 0, -1.0]
export const LEAVES_SWIRL_CENTER: Vec3 = [-5.2, 2.6, -3.8]

const COLLECTION_ROW_Z = -7
const COLLECTION_START_X = -8.85
const COLLECTION_SPACING = 1.5

/** Altura de la boca de la lata, desde donde salen las hojas. */
export const TIN_MOUTH_HEIGHT = 1.0

/** Pivote sobre el que gira la tetera al servir. */
export const TEAPOT_PIVOT_HEIGHT = 0.6

/** Punta del pico de la tetera en coordenadas del modelo. */
export const SPOUT_TIP: Vec3 = [1.4, 1.02, 0]

export const FOG_COLOR = '#C9D3D2'
export const FOG_NEAR = 5.5
export const FOG_FAR = 14

/** Posición de cada lata de la colección según su orden en el catálogo. */
export function collectionSlot(index: number): Vec3 {
  return [COLLECTION_START_X + index * COLLECTION_SPACING, 0, COLLECTION_ROW_Z]
}
