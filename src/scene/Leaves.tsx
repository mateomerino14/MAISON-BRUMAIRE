import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BufferGeometry, DoubleSide, InstancedMesh, Material, Mesh, MeshStandardMaterial, Object3D } from 'three'
import type { Vec3 } from '../scroll/keyframes'
import { scrollState } from '../scroll/scrollState'
import { FEATURE_TIN_POSITION, LEAVES_SWIRL_CENTER, TIN_MOUTH_HEIGHT } from './layout'
import { createLeafSeeds, leafTransform } from './leafMotion'
import { MODEL_URLS } from './models'
import { leafFlight } from './timeline'

const LEAF_COUNT = 160
const LEAF_SEED = 1793
const TIN_MOUTH: Vec3 = [FEATURE_TIN_POSITION[0], FEATURE_TIN_POSITION[1] + TIN_MOUTH_HEIGHT, FEATURE_TIN_POSITION[2]]

/** Busca la malla de la hoja dentro del modelo exportado. */
function findLeafMesh(root: Object3D): { geometry: BufferGeometry; material: Material } {
  let found: Mesh | null = null
  root.traverse((child) => {
    if (found === null && child instanceof Mesh) {
      found = child
    }
  })
  if (found === null) {
    throw new Error('leaf.glb no contiene ninguna malla')
  }
  const mesh: Mesh = found
  const material = (mesh.material as MeshStandardMaterial).clone()
  material.side = DoubleSide
  return { geometry: mesh.geometry, material }
}

/** Nube de hojas de té que salen de la lata y giran en espiral. */
export function Leaves() {
  const { scene } = useGLTF(MODEL_URLS.leaf)
  const leaf = useMemo(() => findLeafMesh(scene), [scene])
  const seeds = useMemo(() => createLeafSeeds(LEAF_COUNT, LEAF_SEED), [])
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useFrame((state) => {
    if (mesh.current === null) {
      return
    }
    const flight = leafFlight(scrollState.smoothed)
    mesh.current.visible = flight > 0 && flight < 1
    if (!mesh.current.visible) {
      return
    }
    const time = state.clock.elapsedTime
    seeds.forEach((seed, index) => {
      const transform = leafTransform(seed, flight, time, TIN_MOUTH, LEAVES_SWIRL_CENTER)
      dummy.position.set(...transform.position)
      dummy.rotation.set(...transform.rotation)
      dummy.scale.setScalar(transform.scale)
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={mesh} args={[leaf.geometry, leaf.material, LEAF_COUNT]} frustumCulled={false} />
}
