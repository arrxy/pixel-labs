import * as THREE from 'three'
import type { Mat4, Mat3 } from './math3'
import type { Vec3 } from './types'
import { DEFAULT_COLORS } from './types'

export const SCENE_COLORS = {
  a: DEFAULT_COLORS.a,
  b: DEFAULT_COLORS.b,
  muted: '#c9c6ba',
  grid: '#e4e2da',
  axisX: '#b85c45',
  axisY: '#0f6e63',
  axisZ: '#4a6fa5',
  ink: DEFAULT_COLORS.ink,
}

export function v3(v: Vec3): THREE.Vector3 {
  return new THREE.Vector3(v.x, v.y, v.z)
}

export function mat4ToThree(M: Mat4): THREE.Matrix4 {
  // THREE is column-major; our Mat4 is row-major.
  return new THREE.Matrix4().set(
    M[0][0],
    M[0][1],
    M[0][2],
    M[0][3],
    M[1][0],
    M[1][1],
    M[1][2],
    M[1][3],
    M[2][0],
    M[2][1],
    M[2][2],
    M[2][3],
    M[3][0],
    M[3][1],
    M[3][2],
    M[3][3],
  )
}

export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.LineSegments) {
      child.geometry?.dispose()
      const mat = child.material
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose()
    }
  })
}

function makeMaterial(color: string, opacity = 1): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    depthTest: true,
  })
}

/** Arrow from origin (or `from`) along vector `dir`. */
export function createArrow(
  dir: Vec3,
  color: string,
  opts?: { from?: Vec3; headLength?: number; shaftRadius?: number },
): THREE.Group {
  const group = new THREE.Group()
  const from = opts?.from ?? { x: 0, y: 0, z: 0 }
  const length = Math.hypot(dir.x, dir.y, dir.z)
  if (length < 1e-6) return group

  const headLength = opts?.headLength ?? Math.min(0.35, length * 0.22)
  const shaftLen = Math.max(0, length - headLength)
  const shaftRadius = opts?.shaftRadius ?? 0.035
  const headRadius = shaftRadius * 2.4

  if (shaftLen > 1e-6) {
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLen, 8),
      makeMaterial(color),
    )
    shaft.position.y = shaftLen / 2
    group.add(shaft)
  }

  const head = new THREE.Mesh(new THREE.ConeGeometry(headRadius, headLength, 10), makeMaterial(color))
  head.position.y = shaftLen + headLength / 2
  group.add(head)

  const quat = new THREE.Quaternion()
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dir.x, dir.y, dir.z).normalize())
  group.quaternion.copy(quat)
  group.position.set(from.x, from.y, from.z)
  return group
}

export function createAxes(size = 4): THREE.Group {
  const g = new THREE.Group()
  const tick = size * 0.08
  const mk = (dir: Vec3, color: string) => createArrow(dir, color, { headLength: tick, shaftRadius: 0.02 })
  g.add(mk({ x: size, y: 0, z: 0 }, SCENE_COLORS.axisX))
  g.add(mk({ x: 0, y: size, z: 0 }, SCENE_COLORS.axisY))
  g.add(mk({ x: 0, y: 0, z: size }, SCENE_COLORS.axisZ))
  return g
}

export function createGrid(size = 8, divisions = 8): THREE.GridHelper {
  const grid = new THREE.GridHelper(size, divisions, SCENE_COLORS.grid, SCENE_COLORS.grid)
  grid.material.transparent = true
  if (!Array.isArray(grid.material)) {
    grid.material.opacity = 0.85
  }
  return grid
}

export function createDashedLine(a: Vec3, b: Vec3, color: string): THREE.Line {
  const geo = new THREE.BufferGeometry().setFromPoints([v3(a), v3(b)])
  const mat = new THREE.LineDashedMaterial({ color, dashSize: 0.15, gapSize: 0.1, linewidth: 1 })
  const line = new THREE.Line(geo, mat)
  line.computeLineDistances()
  return line
}

export function createLine(a: Vec3, b: Vec3, color: string): THREE.Line {
  const geo = new THREE.BufferGeometry().setFromPoints([v3(a), v3(b)])
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color }))
}

export function createParallelogram(a: Vec3, b: Vec3, color: string, opacity = 0.25): THREE.Mesh {
  const o = new THREE.Vector3(0, 0, 0)
  const va = v3(a)
  const vb = v3(b)
  const vc = va.clone().add(vb)
  const geo = new THREE.BufferGeometry().setFromPoints([o, va, vc, vb])
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

export function createWireBox(
  sx: number,
  sy: number,
  sz: number,
  color: string,
  matrix?: Mat4,
): THREE.LineSegments {
  const geo = new THREE.BoxGeometry(sx, sy, sz)
  const edges = new THREE.EdgesGeometry(geo)
  geo.dispose()
  const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color }))
  if (matrix) {
    lines.matrixAutoUpdate = false
    lines.matrix.copy(mat4ToThree(matrix))
  }
  // BoxGeometry is centered; shift so origin is at a corner like the 2D table.
  return lines
}

/** Unit cube [0,1]³ wireframe, optionally transformed. */
export function createUnitCubeWire(color: string, matrix?: Mat4, dashed = false): THREE.Object3D {
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
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ]
  const transform = (p: Vec3): THREE.Vector3 => {
    if (!matrix) return v3(p)
    return new THREE.Vector3(
      matrix[0][0] * p.x + matrix[0][1] * p.y + matrix[0][2] * p.z + matrix[0][3],
      matrix[1][0] * p.x + matrix[1][1] * p.y + matrix[1][2] * p.z + matrix[1][3],
      matrix[2][0] * p.x + matrix[2][1] * p.y + matrix[2][2] * p.z + matrix[2][3],
    )
  }
  const positions: number[] = []
  for (const [i, j] of edges) {
    const a = transform(corners[i])
    const b = transform(corners[j])
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  if (dashed) {
    const mat = new THREE.LineDashedMaterial({ color, dashSize: 0.12, gapSize: 0.08 })
    const line = new THREE.LineSegments(geo, mat)
    line.computeLineDistances()
    return line
  }
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color }))
}

export function createFilledBox(sx: number, sy: number, sz: number, color: string, opacity = 0.2): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  )
}

export function createSphere(radius: number, color: string, opacity = 0.12): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 16),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      wireframe: false,
    }),
  )
}

export function createSphereWire(radius: number, color: string): THREE.LineSegments {
  const geo = new THREE.SphereGeometry(radius, 16, 12)
  const edges = new THREE.WireframeGeometry(geo)
  geo.dispose()
  return new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 }))
}

/** Basis arrows from columns of a 3×3 matrix. */
export function createBasis(M: Mat3, scale = 1.2): THREE.Group {
  const g = new THREE.Group()
  g.add(createArrow({ x: M[0][0] * scale, y: M[1][0] * scale, z: M[2][0] * scale }, SCENE_COLORS.b))
  g.add(createArrow({ x: M[0][1] * scale, y: M[1][1] * scale, z: M[2][1] * scale }, '#9b978a'))
  g.add(createArrow({ x: M[0][2] * scale, y: M[1][2] * scale, z: M[2][2] * scale }, SCENE_COLORS.axisZ))
  return g
}

export function createPoint(p: Vec3, color: string, radius = 0.08): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 8), makeMaterial(color))
  m.position.set(p.x, p.y, p.z)
  return m
}
