import { useMemo, useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { SliderRow } from '../../linear-algebra/components/Controls'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathParagraph, MathText } from '../../linear-algebra/components/MathText'
import { Section } from '../../linear-algebra/components/Section'
import { fmt } from '../../linear-algebra/lib/math'
import { MatrixReadout } from '../components/MatrixReadout'
import { ProjectionDiagram } from '../components/ProjectionDiagram'
import {
  DEFAULT_BOUNDS,
  apply4,
  divideByW,
  perspectiveDepthNdc,
  perspectiveWarp,
  signedPlanes,
  similarTriangleX,
  toHomogeneous,
} from '../lib/projection'

function DepthPlot({ near, far, z }: { near: number; far: number; z: number }) {
  const w = 320
  const h = 140
  const pad = 28
  const n = -near
  const f = -far
  const samples: { vz: number; ndc: number }[] = []
  for (let i = 0; i <= 40; i++) {
    const vz = n + ((f - n) * i) / 40
    const ndc = perspectiveDepthNdc(vz, { ...DEFAULT_BOUNDS, nearDistance: near, farDistance: far })
    if (ndc !== null) samples.push({ vz, ndc })
  }
  const xOf = (vz: number) => pad + ((vz - n) / (f - n)) * (w - 2 * pad)
  const yOf = (ndc: number) => pad + ((1 - ndc) / 2) * (h - 2 * pad)
  const d = samples.map((s, i) => `${i === 0 ? 'M' : 'L'}${xOf(s.vz).toFixed(1)},${yOf(s.ndc).toFixed(1)}`).join(' ')
  const zNdc = perspectiveDepthNdc(z, { ...DEFAULT_BOUNDS, nearDistance: near, farDistance: far })

  return (
    <svg className="depth-plot" viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label="NDC depth versus view-space z">
      <line x1={pad} y1={yOf(1)} x2={w - pad} y2={yOf(1)} className="ndc-axis" />
      <line x1={pad} y1={yOf(-1)} x2={w - pad} y2={yOf(-1)} className="ndc-axis" />
      <path d={d} className="depth-curve" fill="none" />
      {zNdc !== null && <circle cx={xOf(z)} cy={yOf(zNdc)} r={4} className="proj-dot" />}
      <text x={pad} y={h - 6} className="ndc-label">
        z = n
      </text>
      <text x={w - pad} y={h - 6} textAnchor="end" className="ndc-label">
        z = f
      </text>
      <text x={pad - 4} y={yOf(1) + 4} textAnchor="end" className="ndc-label">
        +1
      </text>
      <text x={pad - 4} y={yOf(-1) + 4} textAnchor="end" className="ndc-label">
        −1
      </text>
    </svg>
  )
}

export function PerspectiveProjection() {
  const [x, setX] = useState(1.1)
  const [z, setZ] = useState(-4)
  const [alpha, setAlpha] = useState(1)
  const [nearDistance, setNear] = useState(DEFAULT_BOUNDS.nearDistance)
  const [farDistance, setFar] = useState(DEFAULT_BOUNDS.farDistance)

  const bounds = useMemo(
    () => ({ ...DEFAULT_BOUNDS, nearDistance, farDistance }),
    [nearDistance, farDistance],
  )
  const { n, f } = signedPlanes(bounds)
  const P = perspectiveWarp(bounds)
  const xPrime = similarTriangleX(x, z, n)
  const clip = P ? apply4(P, toHomogeneous({ x, y: 0, z })) : null
  const scaled = P ? apply4(P, { x: alpha * x, y: 0, z: alpha * z, w: alpha }) : null
  const ndc = clip ? divideByW(clip) : null
  const ndcScaled = scaled ? divideByW(scaled) : null

  const reset = () => {
    setX(1.1)
    setZ(-4)
    setAlpha(1)
    setNear(DEFAULT_BOUNDS.nearDistance)
    setFar(DEFAULT_BOUNDS.farDistance)
  }

  return (
    <Section id="perspective" title="Perspective projection">
      <MathParagraph>
        {`Rays meet at the camera. By similar triangles a point $(x,z)$ hits the near plane at $x'=n x/z$. Homogeneous coordinates turn that divide into a matrix: copy $z$ into $w$, then divide.`}
      </MathParagraph>
      <MathText tex={String.raw`x'=\frac{n x}{z}\qquad y'=\frac{n y}{z}`} display />
      <Playground label="Playground: drag P in the x–z plane">
        <ProjectionDiagram bounds={bounds} x={x} z={z} onChange={({ x: nx, z: nz }) => { setX(nx); setZ(nz) }} />
        <div className="controls-col wide">
          <SliderRow label="x" value={x} min={-3} max={3} step={0.05} onChange={setX} />
          <SliderRow label="z" value={z} min={-10} max={-0.5} step={0.05} onChange={setZ} />
          <SliderRow label="near" value={nearDistance} min={0.8} max={5} step={0.1} onChange={(v) => setNear(Math.min(v, farDistance - 0.4))} />
          <SliderRow label="far" value={farDistance} min={3} max={14} step={0.1} onChange={(v) => setFar(Math.max(v, nearDistance + 0.4))} />
          <button type="button" className="mode-btn" onClick={reset}>
            Reset
          </button>
          <div className="mono-block muted" aria-live="polite">
            <div>
              P = ({fmt(x)}, 0, {fmt(z)})
            </div>
            <div>{xPrime === null ? 'not projectable' : `x′ = ${fmt(xPrime)} on z = n`}</div>
          </div>
        </div>
      </Playground>

      <h3 id="homogeneous" className="section-subtitle">
        Homogeneous coordinates
      </h3>
      <MathParagraph>
        {`$(x,y,z,1)$ and $\\alpha(x,y,z,1)$ are the same point after dividing by $w$. That is how a matrix can encode the perspective divide.`}
      </MathParagraph>
      <MathText
        tex={String.raw`\begin{pmatrix}x\\y\\z\\1\end{pmatrix}\sim\begin{pmatrix}\alpha x\\\alpha y\\\alpha z\\\alpha\end{pmatrix}`}
        display
      />
      <PriorLectureLinks links={[{ href: '/linear-algebra#homogeneous3d', label: 'Review homogeneous coordinates in Part I' }]} />
      <Playground label="Playground: scale α, same image point">
        <div className="controls-col wide">
          <SliderRow label="α" value={alpha} min={0.25} max={3} step={0.05} onChange={setAlpha} />
          <div className="mono-block muted" aria-live="polite">
            <div>
              clip = ({clip ? fmt(clip.x) : '—'}, {clip ? fmt(clip.y) : '—'}, {clip ? fmt(clip.z) : '—'}, {clip ? fmt(clip.w) : '—'})
            </div>
            <div>
              α·clip → ({scaled ? fmt(scaled.x) : '—'}, {scaled ? fmt(scaled.y) : '—'}, {scaled ? fmt(scaled.z) : '—'}, {scaled ? fmt(scaled.w) : '—'})
            </div>
            <div>
              after ÷w:{' '}
              {ndc && ndcScaled
                ? `(${fmt(ndc.x)}, ${fmt(ndc.z)})  =  (${fmt(ndcScaled.x)}, ${fmt(ndcScaled.z)})`
                : 'not projectable'}
            </div>
          </div>
        </div>
      </Playground>

      <MathParagraph>
        {`Depth is the remaining row: $z'=(n+f)-fn/z$. Near and far stay put; everything in between bunches toward the far plane.`}
      </MathParagraph>
      <MathText
        tex={String.raw`z=n\Rightarrow z'=n\qquad z=f\Rightarrow z'=f\qquad z'=(n+f)-\frac{fn}{z}`}
        display
      />
      <Playground label="Playground: nonlinear depth">
        <DepthPlot near={nearDistance} far={farDistance} z={z} />
        <div className="mono-block muted" aria-live="polite">
          n = {fmt(n)}, f = {fmt(f)}. The curve is not a straight line, but the endpoints are fixed.
        </div>
      </Playground>
      <MatrixReadout
        matrix={P}
        label="P (perspective warp)"
        tex={String.raw`P=\begin{pmatrix}n&0&0&0\\0&n&0&0\\0&0&n+f&-fn\\0&0&1&0\end{pmatrix}`}
      />
    </Section>
  )
}
