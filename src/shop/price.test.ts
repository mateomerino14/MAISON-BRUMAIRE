import { describe, expect, it } from 'vitest'
import { formatPrice } from './price'

describe('formatPrice', () => {
  it('muestra los céntimos como euros con coma decimal', () => {
    expect(formatPrice(1800).replace(/\s/g, ' ')).toBe('18,00 €')
    expect(formatPrice(2450).replace(/\s/g, ' ')).toBe('24,50 €')
  })
})
