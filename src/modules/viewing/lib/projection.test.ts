import { mul4 } from '../../linear-algebra/lib/math3'
import { describe, expect, it } from 'vitest'
import {
  apply4,
  divideByW,
  ndcToViewport,
  orthographicMatrix,
  perspectiveMatrix,
  perspectiveWarp,
  projectPoint,
  similarTriangleX,
  toHomogeneous,
  type ViewBounds,
} from './projection'

const bounds: ViewBounds = {
  l: -2,
  r: 2,
  b: -1,
  t: 1,
  nearDistance: 1,
  farDistance: 3,
}

function approx(a: number, b: number, eps = 1e-9) {
  expect(Math.abs(a - b)).toBeLessThan(eps)
}

describe('orthographicMatrix', () => {
  it('maps view-box corners onto the canonical cube', () => {
    const M = orthographicMatrix(bounds)
    expect(M).not.toBeNull()
    const nearLeftBottom = projectPoint(M!, { x: -2, y: -1, z: -1 })
    const farRightTop = projectPoint(M!, { x: 2, y: 1, z: -3 })
    expect(nearLeftBottom.ok).toBe(true)
    expect(farRightTop.ok).toBe(true)
    if (!nearLeftBottom.ok || !farRightTop.ok) return
    approx(nearLeftBottom.ndc.x, -1)
    approx(nearLeftBottom.ndc.y, -1)
    approx(nearLeftBottom.ndc.z, 1)
    approx(farRightTop.ndc.x, 1)
    approx(farRightTop.ndc.y, 1)
    approx(farRightTop.ndc.z, -1)
  })

  it('returns null for degenerate bounds', () => {
    expect(orthographicMatrix({ ...bounds, r: bounds.l })).toBeNull()
    expect(orthographicMatrix({ ...bounds, farDistance: bounds.nearDistance })).toBeNull()
  })
})

describe('perspectiveWarp', () => {
  it('keeps near and far on the z axis', () => {
    const P = perspectiveWarp(bounds)
    expect(P).not.toBeNull()
    const near = divideByW(apply4(P!, toHomogeneous({ x: 0, y: 0, z: -1 })))
    const far = divideByW(apply4(P!, toHomogeneous({ x: 0, y: 0, z: -3 })))
    expect(near).not.toBeNull()
    expect(far).not.toBeNull()
    approx(near!.z, -1)
    approx(far!.z, -3)
  })

  it('maps near to +1 and far to -1 after Morth P', () => {
    const M = perspectiveMatrix(bounds)
    expect(M).not.toBeNull()
    const near = projectPoint(M!, { x: 0, y: 0, z: -1 })
    const far = projectPoint(M!, { x: 0, y: 0, z: -3 })
    expect(near.ok && far.ok).toBe(true)
    if (!near.ok || !far.ok) return
    approx(near.ndc.z, 1)
    approx(far.ndc.z, -1)
  })

  it('gives the same x and y to points on one camera ray', () => {
    const M = perspectiveMatrix(bounds)
    expect(M).not.toBeNull()
    const a = projectPoint(M!, { x: 0.5, y: 0.25, z: -1 })
    const b = projectPoint(M!, { x: 1.5, y: 0.75, z: -3 })
    expect(a.ok && b.ok).toBe(true)
    if (!a.ok || !b.ok) return
    approx(a.ndc.x, b.ndc.x, 1e-8)
    approx(a.ndc.y, b.ndc.y, 1e-8)
    approx(similarTriangleX(0.5, -1, -1)!, 0.5)
  })
})

describe('composition', () => {
  it('applies Morth P the same as the product matrix', () => {
    const Morth = orthographicMatrix(bounds)!
    const P = perspectiveWarp(bounds)!
    const composed = perspectiveMatrix(bounds)!
    const p = { x: 0.3, y: -0.2, z: -2.2 }
    const sequential = apply4(Morth, apply4(P, toHomogeneous(p)))
    const once = apply4(composed, toHomogeneous(p))
    const product = mul4(Morth, P)
    approx(sequential.x, once.x)
    approx(sequential.y, once.y)
    approx(sequential.z, once.z)
    approx(sequential.w, once.w)
    approx(product[0][0], composed[0][0])
    approx(product[2][3], composed[2][3])
  })
})

describe('viewport and homogeneous divide', () => {
  it('maps NDC corners to pixels', () => {
    const tl = ndcToViewport({ x: -1, y: 1, z: 0 }, 100, 50)
    const br = ndcToViewport({ x: 1, y: -1, z: 0 }, 100, 50)
    approx(tl.x, 0)
    approx(tl.y, 0)
    approx(br.x, 100)
    approx(br.y, 50)
  })

  it('refuses to divide when w is ~0', () => {
    expect(divideByW({ x: 1, y: 1, z: 1, w: 0 })).toBeNull()
    const P = perspectiveWarp(bounds)!
    const atCamera = projectPoint(P, { x: 1, y: 0, z: 0 })
    expect(atCamera.ok).toBe(false)
  })
})
