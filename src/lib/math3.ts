import { fmt } from './math'
import type { Vec3 } from './types'

export { fmt }

export function mag3(v: Vec3): number {
  return Math.hypot(v.x, v.y, v.z)
}

export function normalize3(v: Vec3): Vec3 {
  const m = mag3(v)
  if (m < 1e-9) return { x: 0, y: 0, z: 0 }
  return { x: v.x / m, y: v.y / m, z: v.z / m }
}

export function add3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

export function sub3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

export function scale3(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s }
}

export function dot3(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

export function cross3(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

/** Orthogonal projection of a onto b. */
export function project3(a: Vec3, b: Vec3): Vec3 {
  const denom = dot3(b, b)
  if (denom < 1e-12) return { x: 0, y: 0, z: 0 }
  return scale3(b, dot3(a, b) / denom)
}

export function reject3(a: Vec3, b: Vec3): Vec3 {
  return sub3(a, project3(a, b))
}

export function clamp(v: number, lim: number): number {
  return Math.max(-lim, Math.min(lim, v))
}

export type Mat3 = number[][]
export type Mat4 = number[][]

export function identity3(): Mat3 {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
}

export function identity4(): Mat4 {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]
}

export function mul3(A: Mat3, B: Mat3): Mat3 {
  const out: Mat3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      out[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j]
    }
  }
  return out
}

export function apply3(M: Mat3, p: Vec3): Vec3 {
  return {
    x: M[0][0] * p.x + M[0][1] * p.y + M[0][2] * p.z,
    y: M[1][0] * p.x + M[1][1] * p.y + M[1][2] * p.z,
    z: M[2][0] * p.x + M[2][1] * p.y + M[2][2] * p.z,
  }
}

export function det3(M: Mat3): number {
  return (
    M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
    M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
    M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
  )
}

export function mul4(A: Mat4, B: Mat4): Mat4 {
  const out: Mat4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[i][j] =
        A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j] + A[i][3] * B[3][j]
    }
  }
  return out
}

export function applyAffine4(M: Mat4, p: Vec3): Vec3 {
  return {
    x: M[0][0] * p.x + M[0][1] * p.y + M[0][2] * p.z + M[0][3],
    y: M[1][0] * p.x + M[1][1] * p.y + M[1][2] * p.z + M[1][3],
    z: M[2][0] * p.x + M[2][1] * p.y + M[2][2] * p.z + M[2][3],
  }
}

export function translate4(tx: number, ty: number, tz: number): Mat4 {
  return [
    [1, 0, 0, tx],
    [0, 1, 0, ty],
    [0, 0, 1, tz],
    [0, 0, 0, 1],
  ]
}

export function scale4(sx: number, sy: number, sz: number): Mat4 {
  return [
    [sx, 0, 0, 0],
    [0, sy, 0, 0],
    [0, 0, sz, 0],
    [0, 0, 0, 1],
  ]
}

export function rotateX4(thetaRad: number): Mat4 {
  const c = Math.cos(thetaRad)
  const s = Math.sin(thetaRad)
  return [
    [1, 0, 0, 0],
    [0, c, -s, 0],
    [0, s, c, 0],
    [0, 0, 0, 1],
  ]
}

export function rotateY4(thetaRad: number): Mat4 {
  const c = Math.cos(thetaRad)
  const s = Math.sin(thetaRad)
  return [
    [c, 0, s, 0],
    [0, 1, 0, 0],
    [-s, 0, c, 0],
    [0, 0, 0, 1],
  ]
}

export function rotateZ4(thetaRad: number): Mat4 {
  const c = Math.cos(thetaRad)
  const s = Math.sin(thetaRad)
  return [
    [c, -s, 0, 0],
    [s, c, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]
}

/** Shear in the xy plane: x' = x + kxy·y, y' = y + kyx·x (z unchanged). */
export function shear4(kxy: number, kxz: number, kyx: number, kyz: number, kzx: number, kzy: number): Mat4 {
  return [
    [1, kxy, kxz, 0],
    [kyx, 1, kyz, 0],
    [kzx, kzy, 1, 0],
    [0, 0, 0, 1],
  ]
}

export function rotationMatrix3(axis: 'x' | 'y' | 'z', thetaRad: number): Mat3 {
  const c = Math.cos(thetaRad)
  const s = Math.sin(thetaRad)
  if (axis === 'x') {
    return [
      [1, 0, 0],
      [0, c, -s],
      [0, s, c],
    ]
  }
  if (axis === 'y') {
    return [
      [c, 0, s],
      [0, 1, 0],
      [-s, 0, c],
    ]
  }
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ]
}

export function scaleMatrix3(sx: number, sy: number, sz: number): Mat3 {
  return [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, sz],
  ]
}

/** M = S · R · T as a 4×4 affine matrix (row-major). R is Z then Y then X Euler. */
export function computeCompositeM4(
  tx: number,
  ty: number,
  tz: number,
  rxDeg: number,
  ryDeg: number,
  rzDeg: number,
  sx: number,
  sy: number,
  sz: number,
): Mat4 {
  const T = translate4(tx, ty, tz)
  const Rx = rotateX4((rxDeg * Math.PI) / 180)
  const Ry = rotateY4((ryDeg * Math.PI) / 180)
  const Rz = rotateZ4((rzDeg * Math.PI) / 180)
  const R = mul4(mul4(Rz, Ry), Rx)
  const S = scale4(sx, sy, sz)
  return mul4(S, mul4(R, T))
}

/** Invert a 4×4 affine matrix (last row assumed [0,0,0,1]). */
export function invertAffine4(M: Mat4): Mat4 | null {
  const a = M[0][0]
  const b = M[0][1]
  const c = M[0][2]
  const d = M[1][0]
  const e = M[1][1]
  const f = M[1][2]
  const g = M[2][0]
  const h = M[2][1]
  const i = M[2][2]
  const tx = M[0][3]
  const ty = M[1][3]
  const tz = M[2][3]

  const det =
    a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
  if (Math.abs(det) < 1e-12) return null
  const inv = 1 / det

  const A = (e * i - f * h) * inv
  const B = (c * h - b * i) * inv
  const C = (b * f - c * e) * inv
  const D = (f * g - d * i) * inv
  const E = (a * i - c * g) * inv
  const F = (c * d - a * f) * inv
  const G = (d * h - e * g) * inv
  const H = (b * g - a * h) * inv
  const I = (a * e - b * d) * inv

  return [
    [A, B, C, -(A * tx + B * ty + C * tz)],
    [D, E, F, -(D * tx + E * ty + F * tz)],
    [G, H, I, -(G * tx + H * ty + I * tz)],
    [0, 0, 0, 1],
  ]
}

export function linearPart(M: Mat4): Mat3 {
  return [
    [M[0][0], M[0][1], M[0][2]],
    [M[1][0], M[1][1], M[1][2]],
    [M[2][0], M[2][1], M[2][2]],
  ]
}
