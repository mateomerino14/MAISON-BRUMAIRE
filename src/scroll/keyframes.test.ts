import { describe, expect, it } from 'vitest'
import { CAMERA_KEYFRAMES, clamp, remap, responsiveView, sampleCamera, smootherstep, type CameraKeyframe } from './keyframes'

const TWO_STOPS: CameraKeyframe[] = [
  { position: [0, 0, 0], target: [0, 0, -1], focus: [0, 0, -1], narrowZoom: 1 },
  { position: [10, 2, 0], target: [10, 0, -1], focus: [10, 0, -1], narrowZoom: 2 },
]

describe('sampleCamera', () => {
  it('devuelve la pose exacta en cada parada', () => {
    CAMERA_KEYFRAMES.forEach((keyframe, index) => {
      expect(sampleCamera(index)).toEqual(keyframe)
    })
  })

  it('pasa por el punto medio a mitad de camino', () => {
    const middle = sampleCamera(0.5, TWO_STOPS)
    expect(middle.position).toEqual([5, 1, 0])
    expect(middle.narrowZoom).toBeCloseTo(1.5)
  })

  it('no se sale del recorrido antes de la primera ni después de la última parada', () => {
    expect(sampleCamera(-3, TWO_STOPS)).toEqual(TWO_STOPS[0])
    expect(sampleCamera(8, TWO_STOPS)).toEqual(TWO_STOPS[1])
  })
})

describe('utilidades de interpolación', () => {
  it('smootherstep empieza en 0, termina en 1 y es simétrica', () => {
    expect(smootherstep(0)).toBe(0)
    expect(smootherstep(1)).toBe(1)
    expect(smootherstep(0.5)).toBeCloseTo(0.5)
  })

  it('remap recorta fuera del tramo', () => {
    expect(remap(1, 2, 4)).toBe(0)
    expect(remap(3, 2, 4)).toBe(0.5)
    expect(remap(9, 2, 4)).toBe(1)
  })

  it('clamp respeta los límites', () => {
    expect(clamp(5, 0, 1)).toBe(1)
    expect(clamp(-5, 0, 1)).toBe(0)
  })
})

describe('responsiveView', () => {
  it('no toca la cámara en pantallas anchas', () => {
    expect(responsiveView(16 / 9)).toEqual({ narrowness: 0, fov: 34, targetDrop: 0 })
  })

  it('en un celular vertical abre el ángulo y sube los objetos', () => {
    const phone = responsiveView(390 / 844)
    expect(phone.narrowness).toBeGreaterThan(0.9)
    expect(phone.fov).toBeGreaterThan(34)
    expect(phone.targetDrop).toBeGreaterThan(0)
  })
})
