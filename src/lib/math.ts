import type { Vec2 } from './types'

export function fmt(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2)
}

export function mag(v: Vec2): number {
  return Math.hypot(v.x, v.y)
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y
}

export function cross2d(a: Vec2, b: Vec2): number {
  return a.x * b.y - a.y * b.x
}

export function clamp(v: number, lim: number): number {
  return Math.max(-lim, Math.min(lim, v))
}

export function rotate(v: Vec2, thetaRad: number): Vec2 {
  const c = Math.cos(thetaRad)
  const s = Math.sin(thetaRad)
  return { x: c * v.x - s * v.y, y: s * v.x + c * v.y }
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
