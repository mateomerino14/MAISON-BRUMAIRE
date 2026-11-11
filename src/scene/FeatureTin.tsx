import { useCallback } from 'react'
import { TEAS } from '../content/teas'
import { scrollState } from '../scroll/scrollState'
import { FEATURE_TIN_POSITION } from './layout'
import { TeaTin, type TinParts } from './TeaTin'
import { featureTinPresence, lidPose } from './timeline'

const FEATURE_ROTATION = 0.35
/** Centro de la tapa en el modelo; la tapa gira sobre este punto y no sobre la base. */
const LID_CENTER_HEIGHT = 1.08
const SUNKEN_DEPTH = 0.8
const MIN_SCALE = 0.001

/** Lata protagonista: surge antes de su sección, abre la tapa para soltar las hojas y se hunde en la bruma. */
export function FeatureTin() {
  const animate = useCallback(({ root, lid }: TinParts) => {
    const progress = scrollState.smoothed
    const presence = featureTinPresence(progress)
    root.visible = presence > 0
    root.scale.setScalar(Math.max(presence, MIN_SCALE))
    root.position.y = FEATURE_TIN_POSITION[1] - SUNKEN_DEPTH * (1 - presence)

    const pose = lidPose(progress)
    lid.rotation.z = pose.tilt
    lid.position.x = LID_CENTER_HEIGHT * Math.sin(pose.tilt)
    lid.position.y = LID_CENTER_HEIGHT * (1 - Math.cos(pose.tilt)) + pose.rise
  }, [])

  return <TeaTin tea={TEAS[0]} position={FEATURE_TIN_POSITION} rotationY={FEATURE_ROTATION} onFrame={animate} />
}
