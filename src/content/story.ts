/** Párrafo de una parada del recorrido. */
export interface StoryStop {
  id: string
  title: string
  body: string
  side: 'left' | 'right'
}

/** Paso del ritual de preparación. */
export interface RitualStep {
  title: string
  body: string
}

export const BRAND_NAME = 'Maison Brumaire'
export const BRAND_TAGLINE = 'Tés de París, servidos desde la bruma.'
export const BRAND_INTRO =
  'Desde 1793 mezclamos hojas enteras en un taller junto al Sena. Baja despacio: la casa te sirve una taza.'

/** Paradas de texto que acompañan a la tetera, la lata y las hojas. */
export const STORY_STOPS: readonly StoryStop[] = [
  {
    id: 'teapot',
    title: 'Porcelana de Limoges, filete de oro',
    body: 'Cada tetera se tornea a mano y se cuece dos veces. La porcelana fina guarda el calor sin robarle aroma al té.',
    side: 'left',
  },
  {
    id: 'tin',
    title: 'Una lata que cierra como un cofre',
    body: 'La doble tapa de latón deja fuera la luz y la humedad. Las hojas llegan a tu taza como salieron del taller.',
    side: 'right',
  },
  {
    id: 'leaves',
    title: 'Hojas enteras, nunca polvo',
    body: 'Compramos a jardines de Darjeeling, Yunnan, Shizuoka y Fujian, y mezclamos en lotes pequeños cada temporada.',
    side: 'left',
  },
]

/** Pasos para preparar una taza, en orden. */
export const RITUAL_STEPS: readonly RitualStep[] = [
  { title: 'Calienta el agua', body: '85 °C para verdes y blancos, 95 °C para negros.' },
  { title: 'Mide las hojas', body: 'Una cucharadita, unos 3 gramos, por taza.' },
  { title: 'Espera', body: 'Tres minutos. Retira las hojas y sirve.' },
]

export const PORTFOLIO_NOTICE =
  'Maison Brumaire es una marca ficticia creada para un proyecto de portafolio. No se venden productos ni se procesan pagos.'
