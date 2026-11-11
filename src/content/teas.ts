/** Identificador de cada té del catálogo. */
export type TeaId = 'montmartre' | 'luxembourg' | 'versailles' | 'provence'

/** Ficha de un té tal como la muestra la tienda. */
export interface Tea {
  id: TeaId
  name: string
  family: string
  notes: string
  description: string
  grams: number
  priceCents: number
  labelColor: string
  inkColor: string
}

/** Catálogo ficticio de la casa, en el orden en que aparecen las latas. */
export const TEAS: readonly Tea[] = [
  {
    id: 'montmartre',
    name: 'Brume de Montmartre',
    family: 'Té negro',
    notes: 'Bergamota, lavanda y un fondo de malta',
    description: 'Nuestro Earl Grey de la casa: hojas enteras de Darjeeling con bergamota de Calabria.',
    grams: 100,
    priceCents: 1800,
    labelColor: '#2B4C9B',
    inkColor: '#F6F7F4',
  },
  {
    id: 'luxembourg',
    name: 'Jardin du Luxembourg',
    family: 'Té verde',
    notes: 'Pera, pétalos de rosa y hierba fresca',
    description: 'Sencha de Shizuoka con pétalos de rosa de Grasse, para las tardes de primavera.',
    grams: 100,
    priceCents: 2100,
    labelColor: '#6F8B6E',
    inkColor: '#F6F7F4',
  },
  {
    id: 'versailles',
    name: 'Nuit à Versailles',
    family: 'Té negro',
    notes: 'Vainilla, cacao y ciruela',
    description: 'Yunnan dorado con vainilla de Madagascar y cascarilla de cacao. Para después de cenar.',
    grams: 100,
    priceCents: 1900,
    labelColor: '#4A2338',
    inkColor: '#E9D9C0',
  },
  {
    id: 'provence',
    name: 'Matin de Provence',
    family: 'Té blanco',
    notes: 'Albaricoque, verbena y miel',
    description: 'Pai Mu Tan de Fujian con verbena de Provenza. Ligero, para la primera taza del día.',
    grams: 50,
    priceCents: 2400,
    labelColor: '#C9A45C',
    inkColor: '#1E2B33',
  },
]
