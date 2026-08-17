import * as THREE from 'three'
import { createSpriteLabel, mat4ToThree, SCENE_COLORS, v3 } from '../../linear-algebra/lib/scene3d'
import type { Mat4 } from '../../linear-algebra/lib/math3'
import type { Vec3 } from '../../linear-algebra/lib/types'
import { CUBE_EDGES, viewVolumeCorners, type ProjectionMode, type ViewBounds } from './projection'

function lineMaterial(color: string, opacity = 1): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
  })
}

function edgesFromCorners(corners: Vec3[], color: string): THREE.LineSegments {
  const positions: number[] = []
  for (const [i, j] of CUBE_EDGES) {
    const a = corners[i]
    const b = corners[j]
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return new THREE.LineSegments(geo, lineMaterial(color))
}

export function createViewVolumeWire(bounds: ViewBounds, mode: ProjectionMode, color = '#4a6fa5'): THREE.LineSegments {
  return edgesFromCorners(viewVolumeCorners(bounds, mode), color)
}

function quadMesh(corners: [Vec3, Vec3, Vec3, Vec3], color: string, opacity: number): THREE.Mesh {
  const geo = new THREE.BufferGeometry().setFromPoints(corners.map(v3))
  geo.setIndex([0, 1, 2, 0, 2, 3])
  geo.computeVertexNormals()
  return new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
}

export function createNearFarPlanes(bounds: ViewBounds, mode: ProjectionMode): THREE.Group {
  const corners = viewVolumeCorners(bounds, mode)
  const g = new THREE.Group()
  g.add(quadMesh([corners[0], corners[1], corners[2], corners[3]], '#0f6e63', 0.12))
  g.add(quadMesh([corners[4], corners[5], corners[6], corners[7]], '#d9622b', 0.1))
  return g
}

function mid(a: Vec3, b: Vec3): Vec3 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 }
}

/** l r b t on the near rectangle (the film). */
export function createViewVolumePlaneLabels(bounds: ViewBounds, mode: ProjectionMode): THREE.Group {
  const c = viewVolumeCorners(bounds, mode)
  const pad = 0.28
  const l = mid(c[0], c[3])
  const r = mid(c[1], c[2])
  const b = mid(c[0], c[1])
  const t = mid(c[3], c[2])
  const nearCenter = mid(c[0], c[2])
  const farCenter = mid(c[4], c[6])
  l.x -= pad
  r.x += pad
  b.y -= pad
  t.y += pad
  nearCenter.y += 0.35
  farCenter.y += 0.35
  const g = new THREE.Group()
  g.add(createSpriteLabel('l', l, { worldHeight: 0.24 }))
  g.add(createSpriteLabel('r', r, { worldHeight: 0.24 }))
  g.add(createSpriteLabel('b', b, { worldHeight: 0.24 }))
  g.add(createSpriteLabel('t', t, { worldHeight: 0.24 }))
  g.add(createSpriteLabel('near plane · film', nearCenter, { color: '#0f6e63', worldHeight: 0.23 }))
  g.add(createSpriteLabel('far plane', farCenter, { color: '#d9622b', worldHeight: 0.23 }))
  return g
}

/** Small camera at the origin looking down −z, or posed by a camera-to-world matrix. */
export function createCameraGizmo(matrix?: Mat4): THREE.Group {
  const g = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.2, 0.36),
    new THREE.MeshBasicMaterial({ color: '#1a1a1a' }),
  )
  body.position.z = 0.08
  g.add(body)

  const lens = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.28, 10),
    new THREE.MeshBasicMaterial({ color: '#4a6fa5' }),
  )
  lens.rotation.x = -Math.PI / 2
  lens.position.z = -0.18
  g.add(lens)

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1.2)]),
    lineMaterial(SCENE_COLORS.axisZ),
  )
  g.add(axis)

  if (matrix) {
    g.matrixAutoUpdate = false
    g.matrix.copy(mat4ToThree(matrix))
  }
  return g
}

export function createCanonicalCube(color = '#9b978a'): THREE.LineSegments {
  const s = 1
  const corners: Vec3[] = [
    { x: -s, y: -s, z: -s },
    { x: s, y: -s, z: -s },
    { x: s, y: s, z: -s },
    { x: -s, y: s, z: -s },
    { x: -s, y: -s, z: s },
    { x: s, y: -s, z: s },
    { x: s, y: s, z: s },
    { x: -s, y: s, z: s },
  ]
  return edgesFromCorners(corners, color)
}

export function createCanonicalCubeLabels(): THREE.Group {
  const g = new THREE.Group()
  const labels: { text: string; p: Vec3 }[] = [
    { text: 'x = −1 · left', p: { x: -1.25, y: 0, z: 0 } },
    { text: 'x = +1 · right', p: { x: 1.25, y: 0, z: 0 } },
    { text: 'y = −1 · bottom', p: { x: 0, y: -1.22, z: 0 } },
    { text: 'y = +1 · top', p: { x: 0, y: 1.22, z: 0 } },
    { text: 'z = +1 · near', p: { x: 0, y: 0.45, z: 1.18 } },
    { text: 'z = −1 · far', p: { x: 0, y: -0.45, z: -1.18 } },
  ]
  for (const label of labels) g.add(createSpriteLabel(label.text, label.p, { worldHeight: 0.16 }))
  return g
}

export function createBoxAt(center: Vec3, size: number, color: string, opacity = 0.28): THREE.Group {
  const g = new THREE.Group()
  const boxGeo = new THREE.BoxGeometry(size, size, size)
  const mesh = new THREE.Mesh(
    boxGeo,
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }),
  )
  const edgeGeo = new THREE.EdgesGeometry(boxGeo)
  const edges = new THREE.LineSegments(edgeGeo, lineMaterial(color))
  g.add(mesh)
  g.add(edges)
  g.position.set(center.x, center.y, center.z)
  return g
}

export function createTransformedBox(corners: Vec3[], color: string): THREE.LineSegments {
  return edgesFromCorners(corners, color)
}

/** Unit cube [0,1]³, optionally posed by a 4×4 matrix. */
export function createUnitCube(color: string, matrix?: Mat4, dashed = false): THREE.Group {
  const g = new THREE.Group()
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: dashed ? 0.06 : 0.22,
      depthWrite: false,
    }),
  )
  mesh.position.set(0.5, 0.5, 0.5)
  g.add(mesh)

  const corners: Vec3[] = [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: 0, y: 1, z: 1 },
  ]
  const wire = edgesFromCorners(corners, color)
  if (dashed) {
    const old = wire.material
    wire.material = new THREE.LineDashedMaterial({ color, dashSize: 0.12, gapSize: 0.08 })
    if (!Array.isArray(old)) old.dispose()
    wire.computeLineDistances()
  }
  g.add(wire)

  if (matrix) {
    g.matrixAutoUpdate = false
    g.matrix.copy(mat4ToThree(matrix))
  }
  return g
}
