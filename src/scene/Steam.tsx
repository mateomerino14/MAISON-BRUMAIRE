import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CanvasTexture, Sprite, SpriteMaterial, Vector3 } from 'three'

const PUFF_COUNT = 14
const TEXTURE_SIZE = 128
const RISE_HEIGHT = 1.1
const LIFE_SECONDS = 3.2
const MAX_OPACITY = 0.32
const START_SCALE = 0.12
const END_SCALE = 0.55
const DRIFT = 0.12
const SWAY_SPEED = 1.3
const SWAY_PHASE_STEP = 2.1
const SWAY_DEPTH_RATIO = 0.5

interface SteamProps {
  /** Escribe en target el punto de donde sale el vapor. */
  getOrigin: (target: Vector3) => void
  /** Intensidad entre 0 y 1; con 0 no se ve vapor. */
  getIntensity: () => number
}

/** Dibuja una mancha difusa que sirve de textura para cada bocanada. */
function createPuffTexture(): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE_SIZE
  canvas.height = TEXTURE_SIZE
  const context = canvas.getContext('2d')
  if (context !== null) {
    const half = TEXTURE_SIZE / 2
    const gradient = context.createRadialGradient(half, half, 0, half, half, half)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
  }
  return new CanvasTexture(canvas)
}

/** Columna de vapor hecha de sprites que suben, crecen y se desvanecen. */
export function Steam({ getOrigin, getIntensity }: SteamProps) {
  const sprites = useRef<(Sprite | null)[]>([])
  const origin = useMemo(() => new Vector3(), [])
  const texture = useMemo(() => createPuffTexture(), [])
  const materials = useMemo(
    () =>
      Array.from(
        { length: PUFF_COUNT },
        () => new SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0, fog: false }),
      ),
    [texture],
  )

  useFrame((state) => {
    getOrigin(origin)
    const intensity = getIntensity()
    const time = state.clock.elapsedTime
    sprites.current.forEach((sprite, index) => {
      if (sprite === null) {
        return
      }
      const life = ((time / LIFE_SECONDS + index / PUFF_COUNT) % 1 + 1) % 1
      const sway = Math.sin(time * SWAY_SPEED + index * SWAY_PHASE_STEP) * DRIFT * life
      sprite.position.set(origin.x + sway, origin.y + life * RISE_HEIGHT, origin.z + sway * SWAY_DEPTH_RATIO)
      sprite.scale.setScalar(START_SCALE + (END_SCALE - START_SCALE) * life)
      materials[index].opacity = Math.sin(Math.PI * life) * MAX_OPACITY * intensity
    })
  })

  return (
    <group>
      {materials.map((material, index) => (
        <sprite
          key={index}
          material={material}
          ref={(sprite) => {
            sprites.current[index] = sprite
          }}
        />
      ))}
    </group>
  )
}
