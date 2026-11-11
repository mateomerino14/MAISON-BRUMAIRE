import { describe, expect, it } from 'vitest'
import { EMPTY_HEIGHT, FULL_HEIGHT, innerRadiusAt, teaSurface } from './cupProfile'

describe('teaSurface', () => {
  it('va de la altura vacía a la llena', () => {
    expect(teaSurface(0).height).toBe(EMPTY_HEIGHT)
    expect(teaSurface(1).height).toBeCloseTo(FULL_HEIGHT)
  })

  it('la superficie se ensancha al subir, como la taza', () => {
    expect(teaSurface(1).radius).toBeGreaterThan(teaSurface(0.5).radius)
    expect(teaSurface(0.5).radius).toBeGreaterThan(teaSurface(0).radius)
  })

  it('el té nunca atraviesa la pared de la taza', () => {
    expect(innerRadiusAt(FULL_HEIGHT)).toBeLessThan(0.45)
  })
})
