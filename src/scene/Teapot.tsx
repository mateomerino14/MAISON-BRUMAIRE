import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useMemo, useRef } from 'react'
import { Group, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { scrollState } from '../scroll/scrollState'
import { teaSurface } from './cupProfile'
import { CUP_POSITION, SPOUT_TIP, TEAPOT_PIVOT_HEIGHT, TEAPOT_POSITION } from './layout'
import { MODEL_URLS } from './models'
import { Steam } from './Steam'
import { cupFill, teapotPose } from './timeline'

const STREAM_RADIUS = 0.022
const STREAM_TAPER = 0.8
const STREAM_SEGMENTS = 12
const STREAM_ROUGHNESS = 0.1
const STREAM_OPACITY = 0.9
const MIN_STREAM_LENGTH = 0.01
const STREAM_COLOR = '#8A4B1C'
const IDLE_STEAM = 0.55

/** Tetera de porcelana que se levanta y sirve el té en la taza. */
export function Teapot() {
  const { scene } = useGLTF(MODEL_URLS.teapot)
  const pivot = useRef<Group>(null)
  const tip = useRef<Object3D>(null)
  const stream = useRef<Mesh>(null)
  const tipWorld = useMemo(() => new Vector3(), [])
  const streamMaterial = useMemo(
    () => new MeshStandardMaterial({ color: STREAM_COLOR, roughness: STREAM_ROUGHNESS, transparent: true, opacity: STREAM_OPACITY }),
    [],
  )

  useFrame(() => {
    if (pivot.current === null || tip.current === null || stream.current === null) {
      return
    }
    const pose = teapotPose(scrollState.smoothed)
    pivot.current.position.set(TEAPOT_POSITION[0] + pose.shift, TEAPOT_PIVOT_HEIGHT + pose.raise, TEAPOT_POSITION[2])
    pivot.current.rotation.z = -pose.tilt
    pivot.current.updateMatrixWorld()
    tip.current.getWorldPosition(tipWorld)

    stream.current.visible = pose.pouring
    if (pose.pouring) {
      const surfaceY = CUP_POSITION[1] + teaSurface(cupFill(scrollState.smoothed)).height
      const length = Math.max(tipWorld.y - surfaceY, MIN_STREAM_LENGTH)
      stream.current.position.set(tipWorld.x, surfaceY + length / 2, tipWorld.z)
      stream.current.scale.set(1, length, 1)
    }
  })

  const getSpout = useCallback((target: Vector3) => target.copy(tipWorld), [tipWorld])
  const getIdleSteam = useCallback(() => {
    if (teapotPose(scrollState.smoothed).tilt > 0) {
      return 0
    }
    return IDLE_STEAM
  }, [])

  return (
    <group>
      <group ref={pivot}>
        <primitive object={scene} position={[0, -TEAPOT_PIVOT_HEIGHT, 0]} />
        <object3D ref={tip} position={[SPOUT_TIP[0], SPOUT_TIP[1] - TEAPOT_PIVOT_HEIGHT, SPOUT_TIP[2]]} />
      </group>
      <mesh ref={stream} material={streamMaterial} visible={false}>
        <cylinderGeometry args={[STREAM_RADIUS, STREAM_RADIUS * STREAM_TAPER, 1, STREAM_SEGMENTS]} />
      </mesh>
      <Steam getOrigin={getSpout} getIntensity={getIdleSteam} />
    </group>
  )
}
