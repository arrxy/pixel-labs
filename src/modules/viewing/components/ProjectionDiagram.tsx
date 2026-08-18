import { useId } from 'react'
import { fmt } from '../../linear-algebra/lib/math'
import { similarTriangleX, signedPlanes, type ViewBounds } from '../lib/projection'

type Props = {
  bounds: ViewBounds
  x: number
  z: number
  onChange: (next: { x: number; z: number }) => void
  xMin?: number
  xMax?: number
  zMin?: number
  zMax?: number
}

const VB_W = 360
const VB_H = 240

export function ProjectionDiagram({
  bounds,
  x,
  z,
  onChange,
  xMin = -3,
  xMax = 3,
  zMin = -10,
  zMax = -0.4,
}: Props) {
  const { n, f } = signedPlanes(bounds)
  const xPrime = similarTriangleX(x, z, n)
  const gid = useId()

  const mapX = (camX: number) => {
    const t = (camX - xMin) / (xMax - xMin)
    return VB_H - 28 - t * (VB_H - 56)
  }
  const mapZ = (camZ: number) => {
    const t = (camZ - zMax) / (zMin - zMax)
    return 48 + t * (VB_W - 80)
  }

  const pointerToWorld = (clientX: number, clientY: number, svg: SVGSVGElement) => {
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const p = pt.matrixTransform(ctm.inverse())
    const camZ = zMax + ((p.x - 48) / (VB_W - 80)) * (zMin - zMax)
    const camX = xMax - ((p.y - 28) / (VB_H - 56)) * (xMax - xMin)
    onChange({
      x: Math.min(xMax, Math.max(xMin, camX)),
      z: Math.min(zMax, Math.max(zMin, camZ)),
    })
  }

  const cam = { x: mapZ(0), y: mapX(0) }
  const pPt = { x: mapZ(z), y: mapX(x) }
  const nearX = mapZ(n)
  const farX = mapZ(f)
  const pOnNear = xPrime === null ? null : { x: nearX, y: mapX(xPrime) }
  const rayEndZ = zMin
  const rayEndX = similarTriangleX(x, z, rayEndZ)

  return (
    <svg
      className="projection-diagram"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      role="img"
      aria-label="Side view of perspective projection in the x z plane"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        pointerToWorld(e.clientX, e.clientY, e.currentTarget)
      }}
      onPointerMove={(e) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
        pointerToWorld(e.clientX, e.clientY, e.currentTarget)
      }}
    >
      <defs>
        <marker id={`${gid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1a1a1a" />
        </marker>
        <clipPath id={`${gid}-plot-clip`}>
          <rect x="42" y="28" width={VB_W - 62} height={VB_H - 48} />
        </clipPath>
      </defs>
      <text x="48" y="18" className="ndc-label">
        x–z side view · camera at origin, looking −z
      </text>
      <line x1={cam.x} y1={28} x2={cam.x} y2={VB_H - 20} className="ndc-axis" />
      <line
        x1={cam.x}
        y1={cam.y}
        x2={mapZ(zMin)}
        y2={cam.y}
        className="ndc-axis"
        markerEnd={`url(#${gid}-arrow)`}
      />
      <text x={mapZ(zMin) - 4} y={cam.y - 8} className="ndc-label" textAnchor="end">
        −z
      </text>
      <text x={cam.x + 8} y={32} className="ndc-label">
        +x
      </text>
      <line x1={nearX} y1={32} x2={nearX} y2={VB_H - 24} className="plane-near" />
      <line x1={farX} y1={32} x2={farX} y2={VB_H - 24} className="plane-far" />
      <text x={nearX} y={VB_H - 8} textAnchor="middle" className="ndc-label">
        n
      </text>
      <text x={farX} y={VB_H - 8} textAnchor="middle" className="ndc-label">
        f
      </text>
      {rayEndX !== null && (
        <line
          x1={cam.x}
          y1={cam.y}
          x2={mapZ(rayEndZ)}
          y2={mapX(rayEndX)}
          className="proj-ray"
          clipPath={`url(#${gid}-plot-clip)`}
        />
      )}
      {pOnNear && (
        <>
          <path
            d={`M${cam.x},${cam.y} L${pPt.x},${cam.y} L${pPt.x},${pPt.y} Z`}
            className="triangle-fill large"
          />
          <path
            d={`M${cam.x},${cam.y} L${pOnNear.x},${cam.y} L${pOnNear.x},${pOnNear.y} Z`}
            className="triangle-fill small"
          />
          <line x1={pPt.x} y1={cam.y} x2={pPt.x} y2={pPt.y} className="proj-drop" />
          <line x1={pOnNear.x} y1={cam.y} x2={pOnNear.x} y2={pOnNear.y} className="proj-drop" />
          <circle cx={pOnNear.x} cy={pOnNear.y} r={5} className="proj-dot-b" />
          <text x={pPt.x + 7} y={(cam.y + pPt.y) / 2} className="diagram-label">
            |x|
          </text>
          <text x={pOnNear.x + 7} y={(cam.y + pOnNear.y) / 2} className="diagram-label">
            |x′|
          </text>
          <text x={(cam.x + pPt.x) / 2} y={cam.y + 18} textAnchor="middle" className="diagram-label">
            |z|
          </text>
          <text x={(cam.x + pOnNear.x) / 2} y={cam.y - 10} textAnchor="middle" className="diagram-label">
            |n|
          </text>
        </>
      )}
      <circle cx={cam.x} cy={cam.y} r={5} fill="#1a1a1a" />
      <circle cx={pPt.x} cy={pPt.y} r={7} className="proj-dot handle" />
      <text x={pPt.x + 10} y={pPt.y - 8} className="ndc-label">
        P
      </text>
      {pOnNear && (
        <text x={pOnNear.x + 8} y={pOnNear.y - 8} className="ndc-label">
          P′
        </text>
      )}
      <title>
        {xPrime === null
          ? `P = (${fmt(x)}, ${fmt(z)}) is not projectable`
          : `P = (${fmt(x)}, ${fmt(z)}) projects to x' = ${fmt(xPrime)} on the near plane`}
      </title>
    </svg>
  )
}
