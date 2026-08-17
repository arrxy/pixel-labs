import { cross3, dot3, mag3, mul4, normalize3, sub3, type Mat4 } from '../../linear-algebra/lib/math3'
import type { Vec3 } from '../../linear-algebra/lib/types'

export type ViewBounds = {
  l: number
  r: number
  b: number
  t: number
  /** Positive distance from the camera to the near plane. */
  nearDistance: number
  /** Positive distance from the camera to the far plane. */
  farDistance: number
}

export type Homogeneous = { x: number; y: number; z: number; w: number }

export type ProjectionMode = 'orthographic' | 'perspective'

export type PointClass = 'inside' | 'clipped' | 'behind'

export type Projected =
  | { ok: true; clip: Homogeneous; ndc: Vec3 }
  | { ok: false; reason: 'not-projectable' }

export const DEFAULT_BOUNDS: ViewBounds = {
  l: -1.2,
  r: 1.2,
  b: -0.9,
  t: 0.9,
  nearDistance: 2,
  farDistance: 8,
}

export const CUBE_EDGES: [number, number][] = [
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

export function signedPlanes(bounds: ViewBounds): { n: number; f: number } {
  return { n: -bounds.nearDistance, f: -bounds.farDistance }
}

export function isValidBounds(bounds: ViewBounds): boolean {
  return (
    bounds.r > bounds.l + 1e-9 &&
    bounds.t > bounds.b + 1e-9 &&
    bounds.nearDistance > 1e-6 &&
    bounds.farDistance > bounds.nearDistance + 1e-6
  )
}

export function boundsFromFov(
  nearDistance: number,
  farDistance: number,
  fovYDeg: number,
  aspect: number,
): ViewBounds {
  const t = nearDistance * Math.tan((fovYDeg * Math.PI) / 360)
  const r = t * aspect
  return { l: -r, r, b: -t, t, nearDistance, farDistance }
}

/** Maps the view box onto the canonical cube [-1,1]³. Near → +1, far → -1. */
export function orthographicMatrix(bounds: ViewBounds): Mat4 | null {
  if (!isValidBounds(bounds)) return null
  const { l, r, b, t } = bounds
  const { n, f } = signedPlanes(bounds)
  return [
    [2 / (r - l), 0, 0, -(r + l) / (r - l)],
    [0, 2 / (t - b), 0, -(t + b) / (t - b)],
    [0, 0, 2 / (n - f), -(n + f) / (n - f)],
    [0, 0, 0, 1],
  ]
}

/** Perspective warp: similar triangles plus a depth that keeps near and far. */
export function perspectiveWarp(bounds: ViewBounds): Mat4 | null {
  if (!isValidBounds(bounds)) return null
  const { n, f } = signedPlanes(bounds)
  return [
    [n, 0, 0, 0],
    [0, n, 0, 0],
    [0, 0, n + f, -f * n],
    [0, 0, 1, 0],
  ]
}

export function perspectiveMatrix(bounds: ViewBounds): Mat4 | null {
  const Morth = orthographicMatrix(bounds)
  const P = perspectiveWarp(bounds)
  if (!Morth || !P) return null
  return mul4(Morth, P)
}

export function projectionMatrix(bounds: ViewBounds, mode: ProjectionMode): Mat4 | null {
  return mode === 'orthographic' ? orthographicMatrix(bounds) : perspectiveMatrix(bounds)
}

export function apply4(M: Mat4, p: Homogeneous): Homogeneous {
  return {
    x: M[0][0] * p.x + M[0][1] * p.y + M[0][2] * p.z + M[0][3] * p.w,
    y: M[1][0] * p.x + M[1][1] * p.y + M[1][2] * p.z + M[1][3] * p.w,
    z: M[2][0] * p.x + M[2][1] * p.y + M[2][2] * p.z + M[2][3] * p.w,
    w: M[3][0] * p.x + M[3][1] * p.y + M[3][2] * p.z + M[3][3] * p.w,
  }
}

export function toHomogeneous(p: Vec3, w = 1): Homogeneous {
  return { x: p.x, y: p.y, z: p.z, w }
}

export function divideByW(clip: Homogeneous, eps = 1e-8): Vec3 | null {
  if (!Number.isFinite(clip.w) || Math.abs(clip.w) < eps) return null
  const inv = 1 / clip.w
  const ndc = { x: clip.x * inv, y: clip.y * inv, z: clip.z * inv }
  if (![ndc.x, ndc.y, ndc.z].every(Number.isFinite)) return null
  return ndc
}

export function projectPoint(M: Mat4, p: Vec3): Projected {
  const clip = apply4(M, toHomogeneous(p))
  const ndc = divideByW(clip)
  if (!ndc) return { ok: false, reason: 'not-projectable' }
  return { ok: true, clip, ndc }
}

export function inNdc(p: Vec3, eps = 1e-6): boolean {
  return (
    p.x >= -1 - eps &&
    p.x <= 1 + eps &&
    p.y >= -1 - eps &&
    p.y <= 1 + eps &&
    p.z >= -1 - eps &&
    p.z <= 1 + eps
  )
}

export function ndcToViewport(ndc: Vec3, width: number, height: number): { x: number; y: number } {
  return {
    x: ((ndc.x + 1) * width) / 2,
    y: ((1 - ndc.y) * height) / 2,
  }
}

export function lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
  const w = normalize3(sub3(eye, target))
  let u = cross3(up, w)
  if (mag3(u) < 1e-8) u = cross3({ x: 1, y: 0, z: 0 }, w)
  u = normalize3(u)
  const v = cross3(w, u)
  return [
    [u.x, u.y, u.z, -dot3(u, eye)],
    [v.x, v.y, v.z, -dot3(v, eye)],
    [w.x, w.y, w.z, -dot3(w, eye)],
    [0, 0, 0, 1],
  ]
}

export function cubeCorners(center: Vec3, size: number): Vec3[] {
  const h = size / 2
  return [
    { x: center.x - h, y: center.y - h, z: center.z - h },
    { x: center.x + h, y: center.y - h, z: center.z - h },
    { x: center.x + h, y: center.y + h, z: center.z - h },
    { x: center.x - h, y: center.y + h, z: center.z - h },
    { x: center.x - h, y: center.y - h, z: center.z + h },
    { x: center.x + h, y: center.y - h, z: center.z + h },
    { x: center.x + h, y: center.y + h, z: center.z + h },
    { x: center.x - h, y: center.y + h, z: center.z + h },
  ]
}

export function viewVolumeCorners(bounds: ViewBounds, mode: ProjectionMode): Vec3[] {
  const { l, r, b, t } = bounds
  const { n, f } = signedPlanes(bounds)
  const s = mode === 'perspective' ? bounds.farDistance / bounds.nearDistance : 1
  return [
    { x: l, y: b, z: n },
    { x: r, y: b, z: n },
    { x: r, y: t, z: n },
    { x: l, y: t, z: n },
    { x: l * s, y: b * s, z: f },
    { x: r * s, y: b * s, z: f },
    { x: r * s, y: t * s, z: f },
    { x: l * s, y: t * s, z: f },
  ]
}

export function classifyViewPoint(p: Vec3, bounds: ViewBounds, mode: ProjectionMode): PointClass {
  if (p.z >= -1e-6) return 'behind'
  if (!isValidBounds(bounds)) return 'clipped'
  const { l, r, b, t } = bounds
  const { n, f } = signedPlanes(bounds)
  if (p.z > n || p.z < f) return 'clipped'
  let xL = l
  let xR = r
  let yB = b
  let yT = t
  if (mode === 'perspective') {
    const s = p.z / n
    xL = l * s
    xR = r * s
    yB = b * s
    yT = t * s
  }
  if (p.x < xL || p.x > xR || p.y < yB || p.y > yT) return 'clipped'
  return 'inside'
}

/** NDC z after the full perspective matrix, as a function of view-space z. */
export function perspectiveDepthNdc(z: number, bounds: ViewBounds): number | null {
  const M = perspectiveMatrix(bounds)
  if (!M) return null
  const projected = projectPoint(M, { x: 0, y: 0, z })
  return projected.ok ? projected.ndc.z : null
}

export function similarTriangleX(x: number, z: number, n: number): number | null {
  if (Math.abs(z) < 1e-8) return null
  return (n * x) / z
}

export const SAMPLE_CUBES: { center: Vec3; size: number; color: string }[] = [
  { center: { x: 0, y: 0, z: -3.2 }, size: 0.85, color: '#0f6e63' },
  { center: { x: 0.4, y: 0.2, z: -6.5 }, size: 0.85, color: '#d9622b' },
]

export function stackedCubeVertices(
  cubes: { center: Vec3; size: number }[] = SAMPLE_CUBES,
): Vec3[] {
  return cubes.flatMap((c) => cubeCorners(c.center, c.size))
}

export function stackedCubeEdges(count = 2): [number, number][] {
  const out: [number, number][] = []
  for (let c = 0; c < count; c++) {
    const o = c * 8
    for (const [i, j] of CUBE_EDGES) out.push([i + o, j + o])
  }
  return out
}
