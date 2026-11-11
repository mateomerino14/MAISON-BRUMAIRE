import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import type { Object3D, Vector3 } from 'three'
import { scrollState } from '../scroll/scrollState'
import { MODEL_TEA_HEIGHT, MODEL_TEA_RADIUS, teaSurface } from './cupProfile'
import { CUP_POSITION } from './layout'
import { MODEL_URLS } from './models'
import { Steam } from './Steam'
import { cupFill } from './timeline'

const CUP_ROTATION = -0.5
const STEAM_START_FILL = 0.35

/** Taza con plato; el disco de té sube según avanza el ritual. */
export function TeaCup() {
  const { scene } = useGLTF(MODEL_URLS.cup)
  const tea = useRef<Object3D | undefined>(undefined)

  useEffect(() => {
    tea.current = scene.getObjectByName('Tea')
  }, [scene])

  useFrame(() => {
    const disc = tea.current
    if (disc === undefined) {
      return
    }
    const fill = cupFill(scrollState.smoothed)
    const surface = teaSurface(fill)
    disc.visible = fill > 0
    disc.position.y = surface.height - MODEL_TEA_HEIGHT
    const ratio = surface.radius / MODEL_TEA_RADIUS
    disc.scale.set(ratio, 1, ratio)
  })

  const getSurface = useCallback((target: Vector3) => {
    const surface = teaSurface(cupFill(scrollState.smoothed))
    target.set(CUP_POSITION[0], CUP_POSITION[1] + surface.height, CUP_POSITION[2])
  }, [])
  const getSteam = useCallback(() => {
    const fill = cupFill(scrollState.smoothed)
    if (fill < STEAM_START_FILL) {
      return 0
    }
    return fill
  }, [])

  return (
    <group>
      <primitive object={scene} position={CUP_POSITION} rotation-y={CUP_ROTATION} />
      <Steam getOrigin={getSurface} getIntensity={getSteam} />
    </group>
  )
}
