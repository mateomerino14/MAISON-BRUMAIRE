import { useCallback, useRef } from 'react'
import { MathUtils } from 'three'
import { TEAS, type Tea } from '../content/teas'
import { scrollState } from '../scroll/scrollState'
import { collectionSlot } from './layout'
import { selection } from './selection'
import { TeaTin, type TinParts } from './TeaTin'
import { collectionReveal } from './timeline'

const LIFT_HEIGHT = 0.28
const LIFT_SPEED = 6
const SPIN_SPEED = 0.6
const SUNKEN_DEPTH = 0.8
const MIN_SCALE = 0.001

interface CollectionTinProps {
  tea: Tea
  index: number
}

/** Lata del catálogo: emerge de la bruma con el scroll y se eleva cuando el visitante señala su té. */
function CollectionTin({ tea, index }: CollectionTinProps) {
  const lift = useRef(0)
  const animate = useCallback(
    ({ root }: TinParts, delta: number) => {
      let targetHeight = 0
      let targetSpin = 0
      if (selection.teaId === tea.id) {
        targetHeight = LIFT_HEIGHT
        targetSpin = root.rotation.y + SPIN_SPEED * delta
      }
      const reveal = collectionReveal(scrollState.smoothed, index)
      root.visible = reveal > 0
      root.scale.setScalar(Math.max(reveal, MIN_SCALE))
      lift.current = MathUtils.damp(lift.current, targetHeight, LIFT_SPEED, delta)
      root.position.y = lift.current - SUNKEN_DEPTH * (1 - reveal)
      root.rotation.y = MathUtils.damp(root.rotation.y, targetSpin, LIFT_SPEED, delta)
    },
    [tea.id, index],
  )

  return <TeaTin tea={tea} position={collectionSlot(index)} onFrame={animate} />
}

/** Fila con las cuatro latas de la colección. */
export function Collection() {
  return (
    <group>
      {TEAS.map((tea, index) => (
        <CollectionTin key={tea.id} tea={tea} index={index} />
      ))}
    </group>
  )
}
