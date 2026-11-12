import { useFrame } from '@react-three/fiber'
import { Fog, PerspectiveCamera } from 'three'
import { lerpVec3, responsiveView, sampleCamera } from '../scroll/keyframes'
import { followProgress, scrollState } from '../scroll/scrollState'
import { FOG_FAR, FOG_NEAR } from './layout'

const PARALLAX_X = 0.25
const PARALLAX_Y = 0.15

/** Mueve la cámara según el scroll, con un leve paralaje que sigue al puntero. */
export function CameraRig() {
  useFrame((state, delta) => {
    const progress = followProgress(scrollState, delta)
    const pose = sampleCamera(progress)
    const view = responsiveView(state.size.width / state.size.height)
    // En pantallas angostas el texto va abajo: la cámara apunta al centro del objeto.
    const [tx, ty, tz] = lerpVec3(pose.target, pose.focus, view.narrowness)
    const zoom = 1 + (pose.narrowZoom - 1) * view.narrowness
    const [px, py, pz] = pose.position
    const camera = state.camera

    if (camera instanceof PerspectiveCamera && camera.fov !== view.fov) {
      camera.fov = view.fov
      camera.updateProjectionMatrix()
    }
    if (state.scene.fog instanceof Fog) {
      state.scene.fog.near = FOG_NEAR * zoom
      state.scene.fog.far = FOG_FAR * zoom
    }

    camera.position.set(
      tx + (px - tx) * zoom + state.pointer.x * PARALLAX_X,
      ty + (py - ty) * zoom + state.pointer.y * PARALLAX_Y,
      tz + (pz - tz) * zoom,
    )
    camera.lookAt(tx, ty - view.targetDrop, tz)
  })
  return null
}
