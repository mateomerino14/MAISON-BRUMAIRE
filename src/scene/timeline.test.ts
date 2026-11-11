import { describe, expect, it } from 'vitest'
import { COLLECTION_RISE, collectionReveal, CUP_FILL, cupFill, featureTinPresence, leafFlight, lidPose, TEAPOT_LIFT, TEAPOT_RETURN, teapotPose } from './timeline'

describe('teapotPose', () => {
  it('la tetera descansa antes y después del ritual', () => {
    expect(teapotPose(0).tilt).toBe(0)
    expect(teapotPose(TEAPOT_RETURN.to + 0.1).tilt).toBe(0)
  })

  it('sirve solo mientras está inclinada y la taza no está llena', () => {
    const middle = (TEAPOT_LIFT.to + CUP_FILL.to) / 2
    expect(teapotPose(middle).pouring).toBe(true)
    expect(teapotPose(CUP_FILL.to + 0.01).pouring).toBe(false)
  })
})

describe('cupFill', () => {
  it('la taza se llena dentro de su tramo', () => {
    expect(cupFill(CUP_FILL.from)).toBe(0)
    expect(cupFill(CUP_FILL.to)).toBe(1)
  })

  it('subir el scroll vacía la taza otra vez', () => {
    expect(cupFill(CUP_FILL.to)).toBeGreaterThan(cupFill((CUP_FILL.from + CUP_FILL.to) / 2))
    expect(cupFill(0)).toBe(0)
  })
})

describe('lata y hojas', () => {
  it('la tapa empieza cerrada', () => {
    expect(lidPose(0)).toEqual({ rise: 0, tilt: 0 })
  })

  it('las hojas avanzan de 0 a 1', () => {
    expect(leafFlight(0)).toBe(0)
    expect(leafFlight(6)).toBe(1)
  })
})

describe('collectionReveal', () => {
  it('las latas están ocultas antes de su tramo y visibles después', () => {
    expect(collectionReveal(COLLECTION_RISE.from, 0)).toBe(0)
    expect(collectionReveal(COLLECTION_RISE.to + 1, 3)).toBe(1)
  })

  it('cada lata llega un poco después que la anterior', () => {
    const middle = (COLLECTION_RISE.from + COLLECTION_RISE.to) / 2
    expect(collectionReveal(middle, 0)).toBeGreaterThan(collectionReveal(middle, 2))
  })
})

describe('featureTinPresence', () => {
  it('la lata no está en la portada, el ritual ni el cierre', () => {
    expect(featureTinPresence(0)).toBe(0)
    expect(featureTinPresence(5)).toBe(0)
    expect(featureTinPresence(6)).toBe(0)
  })

  it('la lata está completa en su sección y en la de las hojas', () => {
    expect(featureTinPresence(2)).toBe(1)
    expect(featureTinPresence(3)).toBe(1)
  })
})
