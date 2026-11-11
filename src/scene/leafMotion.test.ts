import { describe, expect, it } from 'vitest'
import type { Vec3 } from '../scroll/keyframes'
import { createLeafSeeds, createRandom, leafTransform } from './leafMotion'

const MOUTH: Vec3 = [0, 1, 0]
const CENTER: Vec3 = [4, 3, -2]

describe('createRandom', () => {
  it('repite la misma secuencia con la misma semilla', () => {
    const a = createRandom(7)
    const b = createRandom(7)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })
})

describe('leafTransform', () => {
  const [seed] = createLeafSeeds(1, 42)

  it('las hojas son invisibles dentro de la lata y al final del vuelo', () => {
    expect(leafTransform(seed, 0, 0, MOUTH, CENTER).scale).toBe(0)
    expect(leafTransform(seed, 1, 0, MOUTH, CENTER).scale).toBe(0)
  })

  it('a mitad de vuelo la hoja se ve y orbita cerca del centro del remolino', () => {
    const transform = leafTransform(seed, 0.6, 0, MOUTH, CENTER)
    expect(transform.scale).toBeGreaterThan(0)
    const dx = transform.position[0] - CENTER[0]
    const dz = transform.position[2] - CENTER[2]
    expect(Math.hypot(dx, dz)).toBeLessThan(seed.radius * 2)
  })
})
