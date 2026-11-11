import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { sampleCamera } from '../scroll/keyframes'
import { CameraRig } from './CameraRig'
import { Collection } from './Collection'
import { FeatureTin } from './FeatureTin'
import { FOG_COLOR, FOG_FAR, FOG_NEAR } from './layout'
import { Leaves } from './Leaves'
import { preloadModels } from './models'
import { TeaCup } from './TeaCup'
import { Teapot } from './Teapot'

const CAMERA_FOV = 34
const CAMERA_NEAR = 0.1
const CAMERA_FAR = 60
const MAX_PIXEL_RATIO = 1.75

const AMBIENT_INTENSITY = 0.35
const KEY_LIGHT = { position: [4, 7, 5], intensity: 1.4, color: '#FFF4E6' } as const
const ENVIRONMENT_RESOLUTION = 256

/** Panel de luz que se refleja en la porcelana. */
interface LightformerSetup {
  position: [number, number, number]
  scale: number | [number, number, number]
  intensity: number
  color: string
}

const SOFTBOX: LightformerSetup = { position: [0, 6, 2], scale: [8, 3, 1], intensity: 3, color: '#FFF1DE' }
const LEFT_STRIP: LightformerSetup = { position: [-6, 2, 1], scale: [2, 6, 1], intensity: 1.6, color: '#DCE6F2' }
const RIGHT_STRIP: LightformerSetup = { position: [6, 2, -2], scale: [2, 6, 1], intensity: 1.2, color: '#DCE6F2' }
const GOLD_RING: LightformerSetup = { position: [0, 1, -8], scale: 4, intensity: 0.8, color: '#B08D57' }

const SHADOW = {
  position: [-3.5, 0.002, -3.5],
  scale: 22,
  resolution: 1024,
  far: 2.2,
  blur: 2.6,
  opacity: 0.32,
  color: '#1E2B33',
} as const
const START_POSE = sampleCamera(0)

preloadModels()

/** Luz de estudio: un softbox cálido arriba y dos franjas frías que dibujan los reflejos de la porcelana. */
function StudioLight() {
  return (
    <>
      <ambientLight intensity={AMBIENT_INTENSITY} />
      <directionalLight {...KEY_LIGHT} />
      <Environment resolution={ENVIRONMENT_RESOLUTION} frames={1}>
        <Lightformer form="rect" {...SOFTBOX} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" {...LEFT_STRIP} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" {...RIGHT_STRIP} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" {...GOLD_RING} />
      </Environment>
    </>
  )
}

/** Lienzo fijo detrás de la página con toda la escena 3D. */
export function Experience() {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={[1, MAX_PIXEL_RATIO]}
        camera={{ fov: CAMERA_FOV, near: CAMERA_NEAR, far: CAMERA_FAR, position: [...START_POSE.position] }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <color attach="background" args={[FOG_COLOR]} />
        <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
        <CameraRig />
        <StudioLight />
        <Suspense fallback={null}>
          <Teapot />
          <TeaCup />
          <FeatureTin />
          <Leaves />
          <Collection />
        </Suspense>
        <ContactShadows {...SHADOW} />
      </Canvas>
    </div>
  )
}
