import type { Vec2 } from './types'

export function fmt(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2)
}

export function mag(v: Vec2): number {
  return Math.hypot(v.x, v.y)
}

export function normalize(v: Vec2): Vec2 {
  const m = mag(v)
  if (m < 1e-9) return { x: 0, y: 0 }
  return { x: v.x / m, y: v.y / m }
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y
}

export function cross2d(a: Vec2, b: Vec2): number {
  return a.x * b.y - a.y * b.x
}

/** Orthogonal projection of a onto b. */
export function project(a: Vec2, b: Vec2): Vec2 {
  const denom = dot(b, b)
  if (denom < 1e-12) return { x: 0, y: 0 }
  const s = dot(a, b) / denom
  return { x: b.x * s, y: b.y * s }
}

export function reject(a: Vec2, b: Vec2): Vec2 {
  const p = project(a, b)
  return { x: a.x - p.x, y: a.y - p.y }
}

export function clamp(v: number, lim: number): number {
  return Math.max(-lim, Math.min(lim, v))
}

export function rotate(v: Vec2, thetaRad: number): Vec2 {
  const c = Math.cos(thetaRad)
  const s = Math.sin(thetaRad)
  return { x: c * v.x - s * v.y, y: s * v.x + c * v.y }
}

export function mul2(A: number[][], B: number[][]): number[][] {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ]
}

export function apply2(M: number[][], p: Vec2): Vec2 {
  return {
    x: M[0][0] * p.x + M[0][1] * p.y,
    y: M[1][0] * p.x + M[1][1] * p.y,
  }
}

export function det2(M: number[][]): number {
  return M[0][0] * M[1][1] - M[0][1] * M[1][0]
}

export function shearMatrix(kx: number, ky: number): number[][] {
  return [
    [1, kx],
    [ky, 1],
  ]
}

export function rotationMatrix(thetaRad: number): number[][] {
  const c = Math.cos(thetaRad)
  const s = Math.sin(thetaRad)
  return [
    [c, -s],
    [s, c],
  ]
}

export function scaleMatrix(sx: number, sy: number): number[][] {
  return [
    [sx, 0],
    [0, sy],
  ]
}

/** Invert a 3×3 affine matrix (last row assumed [0,0,1]). */
export function invertAffine(M: number[][]): number[][] | null {
  const a = M[0][0]
  const b = M[0][1]
  const c = M[0][2]
  const d = M[1][0]
  const e = M[1][1]
  const f = M[1][2]
  const det = a * e - b * d
  if (Math.abs(det) < 1e-12) return null
  const inv = 1 / det
  return [
    [e * inv, -b * inv, (b * f - c * e) * inv],
    [-d * inv, a * inv, (c * d - a * f) * inv],
    [0, 0, 1],
  ]
}

/** M = S · R(θ) · T as a 3×3 affine matrix (row-major rows). */
export function computeCompositeM(
  tx: number,
  ty: number,
  thetaDeg: number,
  sx: number,
  sy: number,
): number[][] {
  const th = (thetaDeg * Math.PI) / 180
  const cos = Math.cos(th)
  const sin = Math.sin(th)
  const rt = [
    [cos, -sin, cos * tx - sin * ty],
    [sin, cos, sin * tx + cos * ty],
    [0, 0, 1],
  ]
  return [
    [sx * rt[0][0], sx * rt[0][1], sx * rt[0][2]],
    [sy * rt[1][0], sy * rt[1][1], sy * rt[1][2]],
    [0, 0, 1],
  ]
}

export function applyAffine(M: number[][], p: Vec2): Vec2 {
  return {
    x: M[0][0] * p.x + M[0][1] * p.y + M[0][2],
    y: M[1][0] * p.x + M[1][1] * p.y + M[1][2],
  }
}
