import { Scene3D } from '../../linear-algebra/components/Scene3D'
import { add3, invertAffine4, scale3 } from '../../linear-algebra/lib/math3'
import {
  createArrow,
  createDashedLine,
  createPoint,
  createSpriteLabel,
  SCENE_COLORS,
} from '../../linear-algebra/lib/scene3d'
import type { Vec3 } from '../../linear-algebra/lib/types'
import { createCameraGizmo } from '../lib/scene'
import { lookAt, lookAtBasis } from '../lib/projection'

type Props = {
  eye: Vec3
  target: Vec3
  up: Vec3
}

export function LookAtBasisScene({ eye, target, up }: Props) {
  const basis = lookAtBasis(eye, target, up)
  const Mview = lookAt(eye, target, up)
  const cameraPose = invertAffine4(Mview)
  const axisLength = 1.35
  const rightEnd = add3(eye, scale3(basis.u, axisLength))
  const upEnd = add3(eye, scale3(basis.v, axisLength))
  const backEnd = add3(eye, scale3(basis.w, axisLength))
  const forwardEnd = add3(eye, scale3(basis.w, -axisLength))

  return (
    <Scene3D
      responsive
      width={520}
      height={340}
      cameraDistance={9}
      orbitTarget={{ x: 0, y: 0.6, z: 0 }}
      ariaLabel="Camera eye, target, and labeled right up backward basis vectors"
      deps={[eye, target, up]}
      setup={({ root }) => {
        if (cameraPose) root.add(createCameraGizmo(cameraPose))
        root.add(createPoint(eye, '#1a1a1a', 0.08))
        root.add(createPoint(target, SCENE_COLORS.b, 0.09))
        root.add(createDashedLine(eye, target, SCENE_COLORS.b))
        root.add(createArrow(scale3(basis.u, axisLength), SCENE_COLORS.axisX, { from: eye }))
        root.add(createArrow(scale3(basis.v, axisLength), SCENE_COLORS.axisY, { from: eye }))
        root.add(createArrow(scale3(basis.w, axisLength), SCENE_COLORS.axisZ, { from: eye }))
        root.add(createDashedLine(eye, forwardEnd, SCENE_COLORS.axisZ))
        root.add(createSpriteLabel('eye', add3(eye, { x: 0, y: 0.25, z: 0 }), { worldHeight: 0.24 }))
        root.add(createSpriteLabel('target', add3(target, { x: 0, y: 0.25, z: 0 }), {
          color: SCENE_COLORS.b,
          worldHeight: 0.24,
        }))
        root.add(createSpriteLabel('u · right', rightEnd, { color: SCENE_COLORS.axisX, worldHeight: 0.24 }))
        root.add(createSpriteLabel('v · up', upEnd, { color: SCENE_COLORS.axisY, worldHeight: 0.24 }))
        root.add(createSpriteLabel('w · back', backEnd, { color: SCENE_COLORS.axisZ, worldHeight: 0.24 }))
        root.add(createSpriteLabel('looks along −w', forwardEnd, {
          color: SCENE_COLORS.axisZ,
          worldHeight: 0.22,
        }))
      }}
    />
  )
}
