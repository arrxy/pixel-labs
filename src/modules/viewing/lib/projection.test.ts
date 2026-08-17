import { add3, applyAffine4, mul4, scale3 } from '../../linear-algebra/lib/math3'
import { describe, expect, it } from 'vitest'
import {
  apply4,
  classifyViewPoint,
  divideByW,
  lookAt,
  lookAtBasis,
  ndcToViewport,
  orthographicMatrix,
  perspectiveDepthNdc,
  perspectiveMatrix,
  perspectiveWarp,
  projectPoint,
  similarTriangleX,
  toHomogeneous,
  viewVolumeCorners,
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
  it('maps every view-box corner onto the matching NDC corner', () => {
    const M = orthographicMatrix(bounds)
    expect(M).not.toBeNull()
    const expected = [
      { p: { x: -2, y: -1, z: -1 }, ndc: { x: -1, y: -1, z: 1 } },
      { p: { x: 2, y: -1, z: -1 }, ndc: { x: 1, y: -1, z: 1 } },
      { p: { x: 2, y: 1, z: -1 }, ndc: { x: 1, y: 1, z: 1 } },
      { p: { x: -2, y: 1, z: -1 }, ndc: { x: -1, y: 1, z: 1 } },
      { p: { x: -2, y: -1, z: -3 }, ndc: { x: -1, y: -1, z: -1 } },
      { p: { x: 2, y: -1, z: -3 }, ndc: { x: 1, y: -1, z: -1 } },
      { p: { x: 2, y: 1, z: -3 }, ndc: { x: 1, y: 1, z: -1 } },
      { p: { x: -2, y: 1, z: -3 }, ndc: { x: -1, y: 1, z: -1 } },
    ]
    for (const sample of expected) {
      const hit = projectPoint(M!, sample.p)
      expect(hit.ok).toBe(true)
      if (!hit.ok) return
      approx(hit.ndc.x, sample.ndc.x)
      approx(hit.ndc.y, sample.ndc.y)
      approx(hit.ndc.z, sample.ndc.z)
    }
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

  it('builds each advertised warp output before the divide', () => {
    const Mwarp = perspectiveWarp(bounds)!
    const output = apply4(Mwarp, toHomogeneous({ x: 0.5, y: -0.25, z: -2 }))
    approx(output.x, -0.5)
    approx(output.y, 0.25)
    approx(output.z, 5)
    approx(output.w, -2)
  })

  it('keeps NDC unchanged when all homogeneous input coordinates share a scale', () => {
    const M = perspectiveMatrix(bounds)!
    const ordinary = apply4(M, { x: 0.4, y: -0.2, z: -2, w: 1 })
    const scaled = apply4(M, { x: 0.8, y: -0.4, z: -4, w: 2 })
    const a = divideByW(ordinary)!
    const b = divideByW(scaled)!
    approx(a.x, b.x)
    approx(a.y, b.y)
    approx(a.z, b.z)
  })

  it('maps every frustum corner onto the matching NDC corner', () => {
    const M = perspectiveMatrix(bounds)!
    const corners = viewVolumeCorners(bounds, 'perspective')
    const expected = [
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
    ]
    corners.forEach((corner, index) => {
      const hit = projectPoint(M, corner)
      expect(hit.ok).toBe(true)
      if (!hit.ok) return
      approx(hit.ndc.x, expected[index].x)
      approx(hit.ndc.y, expected[index].y)
      approx(hit.ndc.z, expected[index].z)
    })
  })

  it('sends near to NDC +1 and far to NDC −1', () => {
    approx(perspectiveDepthNdc(-1, bounds)!, 1)
    approx(perspectiveDepthNdc(-3, bounds)!, -1)
  })
})

describe('similar triangles', () => {
  it('reproduces x′ = n x / z for a visible point', () => {
    approx(similarTriangleX(1.2, -4, -2)!, 0.6)
    approx(similarTriangleX(-0.8, -2, -2)!, -0.8)
  })
})

describe('view-volume classification', () => {
  it('labels inside, outside, and behind points', () => {
    expect(classifyViewPoint({ x: 0, y: 0, z: -2 }, bounds, 'orthographic')).toBe('inside')
    expect(classifyViewPoint({ x: 3, y: 0, z: -2 }, bounds, 'orthographic')).toBe('clipped')
    expect(classifyViewPoint({ x: 0, y: 0, z: 1 }, bounds, 'orthographic')).toBe('behind')
    expect(classifyViewPoint({ x: 3, y: 0, z: -3 }, bounds, 'perspective')).toBe('inside')
    expect(classifyViewPoint({ x: 3, y: 0, z: -3 }, bounds, 'orthographic')).toBe('clipped')
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
  it('maps NDC corners to pixels and reverses y', () => {
    const tl = ndcToViewport({ x: -1, y: 1, z: 0 }, 100, 50)
    const br = ndcToViewport({ x: 1, y: -1, z: 0 }, 100, 50)
    approx(tl.x, 0)
    approx(tl.y, 0)
    approx(br.x, 100)
    approx(br.y, 50)
    const center = ndcToViewport({ x: 0, y: 0, z: 0 }, 100, 50)
    approx(center.x, 50)
    approx(center.y, 25)
    const top = ndcToViewport({ x: 0, y: 1, z: 0 }, 320, 240)
    const bottom = ndcToViewport({ x: 0, y: -1, z: 0 }, 320, 240)
    approx(top.y, 0)
    approx(bottom.y, 240)
    expect(top.y).toBeLessThan(bottom.y)
  })

  it('refuses to divide when w is ~0', () => {
    expect(divideByW({ x: 1, y: 1, z: 1, w: 0 })).toBeNull()
    const P = perspectiveWarp(bounds)!
    const atCamera = projectPoint(P, { x: 1, y: 0, z: 0 })
    expect(atCamera.ok).toBe(false)
  })
})

describe('lookAt camera basis', () => {
  const eye = { x: 2, y: 1, z: 4 }
  const target = { x: 0, y: 0, z: 0 }
  const up = { x: 0, y: 1, z: 0 }

  it('maps the eye to the camera-space origin', () => {
    const Mview = lookAt(eye, target, up)
    const mappedEye = apply4(Mview, toHomogeneous(eye))
    approx(mappedEye.x, 0)
    approx(mappedEye.y, 0)
    approx(mappedEye.z, 0)
    approx(mappedEye.w, 1)
  })

  it('returns perpendicular unit camera axes', () => {
    const { u, v, w } = lookAtBasis(eye, target, up)
    approx(Math.hypot(u.x, u.y, u.z), 1)
    approx(Math.hypot(v.x, v.y, v.z), 1)
    approx(Math.hypot(w.x, w.y, w.z), 1)
    approx(u.x * v.x + u.y * v.y + u.z * v.z, 0)
    approx(v.x * w.x + v.y * w.y + v.z * w.z, 0)
    approx(w.x * u.x + w.y * u.y + w.z * u.z, 0)
  })

  it('maps the target onto the camera −z axis', () => {
    const mapped = applyAffine4(lookAt(eye, target, up), target)
    approx(mapped.x, 0)
    approx(mapped.y, 0)
    expect(mapped.z).toBeLessThan(0)
  })

  it('maps a step along each camera axis onto the matching camera axis', () => {
    const { u, v, w } = lookAtBasis(eye, target, up)
    const Mview = lookAt(eye, target, up)
    const alongU = applyAffine4(Mview, add3(eye, scale3(u, 2)))
    const alongV = applyAffine4(Mview, add3(eye, scale3(v, 3)))
    const alongW = applyAffine4(Mview, add3(eye, scale3(w, 4)))
    approx(alongU.x, 2)
    approx(alongU.y, 0)
    approx(alongU.z, 0)
    approx(alongV.x, 0)
    approx(alongV.y, 3)
    approx(alongV.z, 0)
    approx(alongW.x, 0)
    approx(alongW.y, 0)
    approx(alongW.z, 4)
  })
})
