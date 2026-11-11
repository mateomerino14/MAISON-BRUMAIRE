import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { sampleCamera } from '../scroll/keyframes'
import { CameraRig } from './CameraRig'
import { FOG_COLOR, FOG_FAR, FOG_NEAR } from './layout'
import { preloadModels } from './models'
import { TeaCup } from './TeaCup'
import { Teapot } from './Teapot'

const CAMERA_FOV = 34
const MAX_PIXEL_RATIO = 1.75
const SHADOW_COLOR = '#1E2B33'
const START_POSE = sampleCamera(0)

preloadModels()

/** Luz de estudio: un softbox cálido arriba y dos franjas frías que dibujan los reflejos de la porcelana. */
function StudioLight() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 5]} intensity={1.4} color="#FFF4E6" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#FFF1DE" position={[0, 6, 2]} scale={[8, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} color="#DCE6F2" position={[-6, 2, 1]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} color="#DCE6F2" position={[6, 2, -2]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={0.8} color="#B08D57" position={[0, 1, -8]} scale={4} />
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
        camera={{ fov: CAMERA_FOV, near: 0.1, far: 60, position: [...START_POSE.position] }}
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
        </Suspense>
        <ContactShadows position={[-3.5, 0.002, -3.5]} scale={22} resolution={1024} far={2.2} blur={2.6} opacity={0.32} color={SHADOW_COLOR} />
      </Canvas>
    </div>
  )
}
