import { Scene3D } from '../../linear-algebra/components/Scene3D'
import { createArrow, createPoint, createSpriteLabel, SCENE_COLORS } from '../../linear-algebra/lib/scene3d'
import type { Vec3 } from '../../linear-algebra/lib/types'
import {
  createBoxAt,
  createCameraGizmo,
  createCanonicalCube,
  createNearFarPlanes,
  createTransformedBox,
  createViewVolumePlaneLabels,
  createViewVolumeWire,
} from '../lib/scene'
import type { ProjectionMode, ViewBounds } from '../lib/projection'

export type SampleCube = { center: Vec3; size: number; color: string }

type Props = {
  bounds: ViewBounds
  mode: ProjectionMode
  points?: { p: Vec3; color?: string; label?: string }[]
  cubes?: SampleCube[]
  transformedCubes?: { corners: Vec3[]; color: string }[]
  showVolume?: boolean
  showCanonical?: boolean
  showCamera?: boolean
  showGuides?: boolean
  showPlaneLabels?: boolean
  volumeColor?: string
  cameraDistance?: number
  orbitTarget?: Vec3
  cameraOffset?: Vec3
  fov?: number
  ariaLabel?: string
  width?: number
  height?: number
}

export function FrustumScene({
  bounds,
  mode,
  points = [],
  cubes = [],
  transformedCubes = [],
  showVolume = true,
  showCanonical = false,
  showCamera = true,
  showGuides = false,
  showPlaneLabels = false,
  volumeColor = '#4a6fa5',
  cameraDistance = 14,
  orbitTarget,
  cameraOffset,
  fov,
  ariaLabel = 'Observer view of the lesson camera and view volume',
  width = 320,
  height = 280,
}: Props) {
  return (
    <Scene3D
      responsive
      ariaLabel={ariaLabel}
      width={width}
      height={height}
      showGuides={showGuides}
      cameraDistance={cameraDistance}
      orbitTarget={orbitTarget}
      cameraOffset={cameraOffset}
      fov={fov}
      deps={[
        bounds,
        mode,
        points,
        cubes,
        transformedCubes,
        showVolume,
        showCanonical,
        showCamera,
        showPlaneLabels,
        volumeColor,
      ]}
      setup={({ root }) => {
        if (showCamera) root.add(createCameraGizmo())
        if (showVolume) {
          root.add(createViewVolumeWire(bounds, mode, volumeColor))
          root.add(createNearFarPlanes(bounds, mode))
          if (showPlaneLabels) root.add(createViewVolumePlaneLabels(bounds, mode))
        }
        if (showCanonical) root.add(createCanonicalCube())
        root.add(createArrow({ x: 0, y: 0, z: -2.2 }, SCENE_COLORS.axisZ, { shaftRadius: 0.02, headLength: 0.22 }))
        for (const c of cubes) root.add(createBoxAt(c.center, c.size, c.color))
        for (const box of transformedCubes) root.add(createTransformedBox(box.corners, box.color))
        for (const pt of points) {
          root.add(createPoint(pt.p, pt.color ?? SCENE_COLORS.a, 0.09))
          if (pt.label) {
            root.add(
              createSpriteLabel(pt.label, { x: pt.p.x, y: pt.p.y + 0.32, z: pt.p.z }, { color: pt.color, worldHeight: 0.3 }),
            )
          }
        }
      }}
    />
  )
}
