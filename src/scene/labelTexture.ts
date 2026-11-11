import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import type { Tea } from '../content/teas'
import { BRAND_NAME } from '../content/story'

const WIDTH = 2048
const HEIGHT = 480
const FRONT_X = WIDTH / 2
const GOLD = '#B08D57'
const RULE_INSET = 34
const RULE_WIDTH = 3
const BRAND_FONT = '500 30px "Instrument Sans", sans-serif'
const NAME_FONT = 'italic 400 78px "Bodoni Moda", serif'
const DETAIL_FONT = '400 28px "Instrument Sans", sans-serif'
const BRAND_Y = 150
const NAME_Y = 268
const DETAIL_Y = 352

/** Pinta la etiqueta de una lata: color del té, filetes dorados y nombre al frente. */
function paintLabel(context: CanvasRenderingContext2D, tea: Tea): void {
  context.fillStyle = tea.labelColor
  context.fillRect(0, 0, WIDTH, HEIGHT)
  context.fillStyle = GOLD
  context.fillRect(0, RULE_INSET, WIDTH, RULE_WIDTH)
  context.fillRect(0, HEIGHT - RULE_INSET - RULE_WIDTH, WIDTH, RULE_WIDTH)

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = tea.inkColor
  context.font = BRAND_FONT
  context.fillText(BRAND_NAME, FRONT_X, BRAND_Y)
  context.font = NAME_FONT
  context.fillText(tea.name, FRONT_X, NAME_Y)
  context.font = DETAIL_FONT
  context.fillText(`${tea.family}, ${tea.grams} g`, FRONT_X, DETAIL_Y)
}

/** Crea la textura de la etiqueta y la repinta cuando terminan de cargar las fuentes. */
export function createLabelTexture(tea: Tea): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  // glTF guarda la V invertida y el cilindro avanza contra el sentido de lectura.
  texture.flipY = false
  texture.wrapS = RepeatWrapping
  texture.repeat.x = -1
  texture.anisotropy = 8

  const context = canvas.getContext('2d')
  if (context === null) {
    return texture
  }
  paintLabel(context, tea)
  document.fonts.ready.then(() => {
    paintLabel(context, tea)
    texture.needsUpdate = true
  })
  return texture
}
