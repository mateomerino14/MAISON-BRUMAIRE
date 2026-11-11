const CENTS_PER_EURO = 100

const euroFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

/** Muestra un importe en céntimos como euros, por ejemplo «18,00 €». */
export function formatPrice(cents: number): string {
  return euroFormatter.format(cents / CENTS_PER_EURO)
}
