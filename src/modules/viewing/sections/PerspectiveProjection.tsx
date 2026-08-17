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
  const [alpha, setAlpha] = useState(1.6)
  const [nearDistance, setNear] = useState(DEFAULT_BOUNDS.nearDistance)
  const [farDistance, setFar] = useState(DEFAULT_BOUNDS.farDistance)

  const bounds = useMemo(
    () => ({ ...DEFAULT_BOUNDS, nearDistance, farDistance }),
    [nearDistance, farDistance],
  )
  const { n, f } = signedPlanes(bounds)
  const Mwarp = perspectiveWarp(bounds)
  const xPrime = similarTriangleX(x, z, n)
  const warped = Mwarp ? apply4(Mwarp, toHomogeneous({ x, y: 0, z })) : null
  const scaledWarped = Mwarp ? apply4(Mwarp, { x: alpha * x, y: 0, z: alpha * z, w: alpha }) : null
  const divided = warped ? divideByW(warped) : null
  const dividedScaled = scaledWarped ? divideByW(scaledWarped) : null

  const reset = () => {
    setX(1.1)
    setZ(-4)
    setAlpha(1.6)
    setNear(DEFAULT_BOUNDS.nearDistance)
    setFar(DEFAULT_BOUNDS.farDistance)
  }

  return (
    <Section id="perspective" title="Perspective projection">
      <MathParagraph>
        {`Rays meet at the camera. By similar triangles a point $(x,z)$ hits the near plane at $x'=n x/z$`}
      </MathParagraph>
      <p className="body-text">
        <strong>P</strong> is the original 3D point in camera space: P = (x, y, z).
      </p>
      <div className="legend-box">
        <ul className="legend-list">
          <li>
            <strong>x, y</strong> are P’s horizontal and vertical coordinates.
          </li>
          <li>
            <strong>z</strong> is P’s depth. It is negative because the camera looks along −z.
          </li>
          <li>
            <strong>P′</strong> is where the ray from the camera through P intersects the near plane:
            P′ = (x′, y′, n).
          </li>
          <li>
            <strong>x′, y′</strong> are P’s projected coordinates on that near plane.
          </li>
          <li>
            <strong>n</strong> is the signed near-plane position. The UI’s positive near distance becomes n = −near.
          </li>
        </ul>
      </div>

      <div className="walkthrough">
        <div className="label-caps">Derivation</div>
        <p className="body-text">
          The camera is at the origin. P and P′ lie on the same ray, so the horizontal triangles are similar:
        </p>
        <MathText tex={String.raw`\frac{x'}{n}=\frac{x}{z}`} display />
        <p className="body-text">Multiplying both sides by n gives:</p>
        <MathText tex={String.raw`x'=\frac{n x}{z}`} display />
        <p className="body-text">The same argument in the vertical direction gives:</p>
        <MathText tex={String.raw`y'=\frac{n y}{z}`} display />
        <p className="hint-text">
          Both n and z are negative for a visible point, so their signs cancel. As |z| grows, x′ and y′ shrink:
          farther objects look smaller.
        </p>
      </div>
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
      <p className="body-text">
        <strong>w</strong> is an extra scale coordinate added to x, y, and z. It is not another spatial direction.
        To recover the ordinary 3D point, divide the first three coordinates by w:
      </p>
      <MathText
        tex={String.raw`(x_h,y_h,z_h,w)\longrightarrow\left(\frac{x_h}{w},\frac{y_h}{w},\frac{z_h}{w}\right),\qquad w\ne0`}
        display
      />
      <p className="body-text">
        An ordinary point starts as (x, y, z, 1), so dividing by w = 1 changes nothing. Multiplying all four
        coordinates by the same nonzero α also changes nothing after division:
      </p>
      <MathText
        tex={String.raw`\begin{pmatrix}x\\y\\z\\1\end{pmatrix}\sim\begin{pmatrix}\alpha x\\\alpha y\\\alpha z\\\alpha\end{pmatrix}`}
        display
      />
      <p className="hint-text">
        Call the perspective-warp matrix <span className="math-sym">M</span>
        <sub>warp</sub>. It makes the output w equal to the input z. Dividing by w then produces nx/z and ny/z.
      </p>
      <PriorLectureLinks links={[{ href: '/linear-algebra#homogeneous3d', label: 'Review homogeneous coordinates in Part I' }]} />
      <Playground label="Playground: scale α, same image point">
        <div className="controls-col wide">
          <SliderRow label="α" value={alpha} min={0.25} max={3} step={0.05} onChange={setAlpha} />
          <div className="mono-block muted" aria-live="polite">
            <div>
              after Mwarp, before ÷w = ({warped ? fmt(warped.x) : '—'}, {warped ? fmt(warped.y) : '—'},{' '}
              {warped ? fmt(warped.z) : '—'}, {warped ? fmt(warped.w) : '—'})
            </div>
            <div>
              α·output → ({scaledWarped ? fmt(scaledWarped.x) : '—'},{' '}
              {scaledWarped ? fmt(scaledWarped.y) : '—'}, {scaledWarped ? fmt(scaledWarped.z) : '—'},{' '}
              {scaledWarped ? fmt(scaledWarped.w) : '—'})
            </div>
            <div>
              after ÷w, x and z:{' '}
              {divided && dividedScaled
                ? `(${fmt(divided.x)}, ${fmt(divided.z)})  =  (${fmt(dividedScaled.x)}, ${fmt(dividedScaled.z)})`
                : 'not projectable'}
            </div>
          </div>
        </div>
      </Playground>
      <div className="walkthrough">
        <div className="label-caps">What the α playground shows</div>
        <p className="body-text">
          At the default α = 1.6, this playground demonstrates that homogeneous coordinates represent a point using
          ratios, not one unique four-number tuple. After Mwarp, the first output is:
        </p>
        <MathText tex={String.raw`(-2.20,\ 0,\ 24,\ -4)`} display />
        <p className="body-text">
          Here w = −4. Divide the first three coordinates by w to recover the ordinary 3D coordinates:
        </p>
        <MathText
          tex={String.raw`\left(\frac{-2.20}{-4},\frac{0}{-4},\frac{24}{-4}\right)=(0.55,\ 0,\ -6)`}
          display
        />
        <p className="body-text">Multiplying all four output coordinates by α = 1.6 gives:</p>
        <MathText
          tex={String.raw`1.6(-2.20,\ 0,\ 24,\ -4)=(-3.52,\ 0,\ 38.40,\ -6.40)`}
          display
        />
        <p className="body-text">Dividing by the new w = −6.40 gives the same ordinary point:</p>
        <MathText
          tex={String.raw`\left(\frac{-3.52}{-6.40},\frac{0}{-6.40},\frac{38.40}{-6.40}\right)=(0.55,\ 0,\ -6)`}
          display
        />
        <p className="hint-text">
          The α slider does not move or resize the object. It only changes the homogeneous representation; the
          ratios stay the same.
        </p>
      </div>
      <p className="hint-text">
        This is the result of Mwarp only, not NDC yet. The orthographic map from the previous section is still needed
        to place the result inside [−1, 1]³.
      </p>

      <MathParagraph>
        {`After $M_{\\mathrm{warp}}$ and the divide by $w$, depth is $z'=(n+f)-fn/z$. Near and far stay put. Applying the orthographic map next turns them into NDC depths $+1$ and $-1$; the values between them are not evenly spaced.`}
      </MathParagraph>
      <MathText
        tex={String.raw`z=n\Rightarrow z'=n\qquad z=f\Rightarrow z'=f\qquad z'=(n+f)-\frac{fn}{z}`}
        display
      />
      <Playground label="Playground: nonlinear depth">
        <DepthPlot near={nearDistance} far={farDistance} z={z} />
        <div className="mono-block muted" aria-live="polite">
          n = {fmt(n)}, f = {fmt(f)} · NDC z after Morth · Mwarp: near → +1, far → −1. The curve is not a straight
          line.
        </div>
      </Playground>
      <MatrixReadout
        matrix={Mwarp}
        label="Mwarp (perspective warp)"
        tex={String.raw`M_{\mathrm{warp}}=\begin{pmatrix}n&0&0&0\\0&n&0&0\\0&0&n+f&-fn\\0&0&1&0\end{pmatrix}`}
      />
    </Section>
  )
}
