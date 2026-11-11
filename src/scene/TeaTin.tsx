import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D } from 'three'
import type { Tea } from '../content/teas'
import type { Vec3 } from '../scroll/keyframes'
import { createLabelTexture } from './labelTexture'
import { MODEL_URLS } from './models'

/** Piezas de una lata que se pueden animar desde fuera. */
export interface TinParts {
  root: Group
  lid: Object3D
}

interface TeaTinProps {
  tea: Tea
  position: Vec3
  rotationY?: number
  /** Se llama en cada cuadro para animar la lata. */
  onFrame?: (parts: TinParts, delta: number) => void
}

/** Lata de té con la etiqueta de su mezcla. */
export function TeaTin({ tea, position, rotationY = 0, onFrame }: TeaTinProps) {
  const { scene } = useGLTF(MODEL_URLS.tin)
  const root = useRef<Group>(null)
  const model = useMemo(() => scene.clone(true), [scene])
  const lid = useMemo(() => model.getObjectByName('TinLid'), [model])

  useEffect(() => {
    const label = model.getObjectByName('Label')
    if (!(label instanceof Mesh)) {
      return
    }
    const texture = createLabelTexture(tea)
    const material = new MeshStandardMaterial({ map: texture, roughness: 0.42, metalness: 0.15, side: DoubleSide })
    label.material = material
    return () => {
      texture.dispose()
      material.dispose()
    }
  }, [model, tea])

  useFrame((_, delta) => {
    if (onFrame === undefined || root.current === null || lid === undefined) {
      return
    }
    onFrame({ root: root.current, lid }, delta)
  })

  return (
    <group ref={root} position={position} rotation-y={rotationY}>
      <primitive object={model} />
    </group>
  )
}
