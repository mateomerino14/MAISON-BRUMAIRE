import { useGLTF } from '@react-three/drei'

const MODELS_PATH = `${import.meta.env.BASE_URL}models/`

/** Rutas de los modelos exportados por tools/blender/models.py. */
export const MODEL_URLS = {
  teapot: `${MODELS_PATH}teapot.glb`,
  tin: `${MODELS_PATH}tin.glb`,
  cup: `${MODELS_PATH}cup.glb`,
  leaf: `${MODELS_PATH}leaf.glb`,
} as const

/** Empieza a descargar todos los modelos antes de que se monten las piezas. */
export function preloadModels(): void {
  Object.values(MODEL_URLS).forEach((url) => useGLTF.preload(url))
}
