import { useCallback } from 'react'
import { TEAS } from '../content/teas'
import { scrollState } from '../scroll/scrollState'
import { FEATURE_TIN_POSITION } from './layout'
import { TeaTin, type TinParts } from './TeaTin'
import { lidPose } from './timeline'

const FEATURE_ROTATION = 0.35
/** Centro de la tapa en el modelo; la tapa gira sobre este punto y no sobre la base. */
const LID_CENTER_HEIGHT = 1.08

/** Lata protagonista: abre la tapa para dejar salir las hojas. */
export function FeatureTin() {
  const animate = useCallback(({ lid }: TinParts) => {
    const pose = lidPose(scrollState.smoothed)
    lid.rotation.z = pose.tilt
    lid.position.x = LID_CENTER_HEIGHT * Math.sin(pose.tilt)
    lid.position.y = LID_CENTER_HEIGHT * (1 - Math.cos(pose.tilt)) + pose.rise
  }, [])

  return <TeaTin tea={TEAS[0]} position={FEATURE_TIN_POSITION} rotationY={FEATURE_ROTATION} onFrame={animate} />
}
