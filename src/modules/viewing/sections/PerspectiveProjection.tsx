import { useMemo, useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { SliderRow } from '../../linear-algebra/components/Controls'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathText } from '../../linear-algebra/components/MathText'
import { Section } from '../../linear-algebra/components/Section'
import { fmt } from '../../linear-algebra/lib/math'
import { ConstraintRows } from '../components/ConstraintRows'
import { MatrixReadout } from '../components/MatrixReadout'
import { ProjectionDiagram } from '../components/ProjectionDiagram'
import {
  DEFAULT_BOUNDS,
  apply4,
  divideByW,
  perspectiveDepthNdc,
  perspectiveMatrix,
  perspectiveWarp,
  signedPlanes,
  similarTriangleX,
  toHomogeneous,
} from '../lib/projection'

const WARP_TEX = String.raw`M_{\mathrm{warp}}=\begin{pmatrix}
n&0&0&0\\
0&n&0&0\\
0&0&n+f&-fn\\
0&0&1&0
\end{pmatrix}`

const PER_TEX = String.raw`M_{\mathrm{per}}=M_{\mathrm{orth}}M_{\mathrm{warp}}=\begin{pmatrix}
\frac{2n}{r-l}&0&-\frac{r+l}{r-l}&0\\
0&\frac{2n}{t-b}&-\frac{t+b}{t-b}&0\\
0&0&\frac{n+f}{n-f}&-\frac{2fn}{n-f}\\
0&0&1&0
\end{pmatrix}`

function DepthPlot({ near, far, z }: { near: number; far: number; z: number }) {
  const width = 420
  const height = 180
  const pad = 38
  const n = -near
  const f = -far
  const samples: { viewZ: number; ndcZ: number }[] = []
  for (let i = 0; i <= 60; i++) {
    const viewZ = n + ((f - n) * i) / 60
    const ndcZ = perspectiveDepthNdc(viewZ, { ...DEFAULT_BOUNDS, nearDistance: near, farDistance: far })
    if (ndcZ !== null) samples.push({ viewZ, ndcZ })
  }
  const xOf = (viewZ: number) => pad + ((viewZ - n) / (f - n)) * (width - 2 * pad)
  const yOf = (ndcZ: number) => pad + ((1 - ndcZ) / 2) * (height - 2 * pad)
  const path = samples
    .map((sample, index) => `${index === 0 ? 'M' : 'L'}${xOf(sample.viewZ).toFixed(1)},${yOf(sample.ndcZ).toFixed(1)}`)
    .join(' ')
  const pointNdc = perspectiveDepthNdc(z, { ...DEFAULT_BOUNDS, nearDistance: near, farDistance: far })

  return (
    <svg
      className="depth-plot"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label="Final NDC depth versus camera-space z, with near and far endpoints labeled"
    >
      <text x={pad} y="18" className="diagram-title">
        camera-space z → final NDC z
      </text>
      <line x1={pad} y1={yOf(1)} x2={width - pad} y2={yOf(1)} className="ndc-axis" />
      <line x1={pad} y1={yOf(-1)} x2={width - pad} y2={yOf(-1)} className="ndc-axis" />
      <path d={path} className="depth-curve" fill="none" />
      {pointNdc !== null && z <= n && z >= f ? (
        <circle cx={xOf(z)} cy={yOf(pointNdc)} r={5} className="proj-dot" />
      ) : null}
      <text x={pad} y={height - 8} className="ndc-label">
        near: z = n
      </text>
      <text x={width - pad} y={height - 8} textAnchor="end" className="ndc-label">
        far: z = f
      </text>
      <text x={pad - 6} y={yOf(1) + 4} textAnchor="end" className="ndc-label">
        +1
      </text>
      <text x={pad - 6} y={yOf(-1) + 4} textAnchor="end" className="ndc-label">
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
  const Mper = perspectiveMatrix(bounds)
  const xPrime = similarTriangleX(x, z, n)
  const clip = Mper ? apply4(Mper, toHomogeneous({ x, y: 0, z })) : null
  const scaledClip = Mper ? apply4(Mper, { x: alpha * x, y: 0, z: alpha * z, w: alpha }) : null
  const ndc = clip ? divideByW(clip) : null
  const scaledNdc = scaledClip ? divideByW(scaledClip) : null

  const reset = () => {
    setX(1.1)
    setZ(-4)
    setAlpha(1.6)
    setNear(DEFAULT_BOUNDS.nearDistance)
    setFar(DEFAULT_BOUNDS.farDistance)
  }

  return (
    <Section id="perspective" title="Perspective, derived from a camera ray">
      <p className="body-text">
        Perspective makes distant objects look smaller. We will first derive the geometric rule, then show how a 4×4
        matrix and one division reproduce it.
      </p>
      <div className="legend-box">
        <div className="label-caps">Symbols in the diagram</div>
        <ul className="legend-list">
          <li>
            <strong>P = (x, y, z)</strong> is the original point in camera space.
          </li>
          <li>
            <strong>P′ = (x′, y′, n)</strong> is where the ray from the camera through P meets the near plane.
          </li>
          <li>
            <strong>x and y</strong> locate P horizontally and vertically. <strong>z</strong> is its signed depth and
            is negative in front of the camera.
          </li>
          <li>
            <strong>n = −near</strong> is the signed z coordinate of the near plane, introduced in the orthographic
            section.
          </li>
        </ul>
      </div>

      <div className="walkthrough">
        <div className="label-caps">Similar-triangle derivation</div>
        <p className="body-text">
          The camera is at the origin. P and P′ lie on the same straight ray. In the x–z side view, the small triangle
          has side lengths |x′| and |n|; the larger one has matching lengths |x| and |z|. Similar triangles have equal
          ratios:
        </p>
        <MathText tex={String.raw`\frac{|x'|}{|n|}=\frac{|x|}{|z|}`} display />
        <p className="body-text">
          Lengths alone do not say whether P is left or right of the center. Restoring the signed x coordinates gives
          x′/n = x/z. Multiply both sides by n:
        </p>
        <MathText tex={String.raw`x'=\frac{nx}{z}`} display />
        <p className="body-text">
          Looking from above gives the same argument for y. Therefore the film point is:
        </p>
        <MathText tex={String.raw`P'=\left(\frac{nx}{z},\frac{ny}{z},n\right)`} display />
        <p className="hint-text">
          For a visible point, n and z are both negative, so n/z is positive. As |z| grows, n/z gets smaller and the
          image moves toward the film’s center.
        </p>
      </div>

      <Playground label="Playground: drag P and watch the similar triangles">
        <ProjectionDiagram
          bounds={bounds}
          x={x}
          z={z}
          onChange={({ x: nextX, z: nextZ }) => {
            setX(nextX)
            setZ(nextZ)
          }}
        />
        <div className="controls-col wide">
          <SliderRow label="P horizontal x" value={x} min={-3} max={3} step={0.05} onChange={setX} />
          <SliderRow label="P depth z" value={z} min={-10} max={-0.5} step={0.05} onChange={setZ} />
          <SliderRow
            label="near distance"
            value={nearDistance}
            min={0.8}
            max={5}
            step={0.1}
            onChange={(value) => setNear(Math.min(value, farDistance - 0.4))}
          />
          <SliderRow
            label="far distance"
            value={farDistance}
            min={3}
            max={14}
            step={0.1}
            onChange={(value) => setFar(Math.max(value, nearDistance + 0.4))}
          />
          <button type="button" className="mode-btn" onClick={reset}>
            Reset
          </button>
          <div className="mono-block muted" aria-live="polite">
            <div>P = ({fmt(x)}, 0, {fmt(z)})</div>
            <div>{xPrime === null ? 'z is too close to 0' : `x′ = n·x/z = ${fmt(xPrime)}`}</div>
          </div>
        </div>
      </Playground>

      <h3 id="homogeneous" className="section-subtitle">
        Why a fourth coordinate w is useful
      </h3>
      <p className="body-text">
        Part I represented an ordinary 3D point as (x, y, z, 1). The fourth number is called <strong>w</strong>. It is
        a scale coordinate, not another spatial direction. Part I kept w equal to 1; perspective deliberately changes
        it.
      </p>
      <p className="body-text">
        A four-number homogeneous point becomes an ordinary three-number point by dividing its first three numbers by
        w. This operation is the <strong>perspective divide</strong>:
      </p>
      <MathText
        tex={String.raw`(x_h,y_h,z_h,w)\longrightarrow\left(\frac{x_h}{w},\frac{y_h}{w},\frac{z_h}{w}\right),\qquad w\ne0`}
        display
      />
      <p className="body-text">
        Multiplying all four numbers by the same nonzero α does not change the three ratios. The two four-number
        tuples below therefore represent the same ordinary point:
      </p>
      <MathText
        tex={String.raw`(x_h,y_h,z_h,w)\sim(\alpha x_h,\alpha y_h,\alpha z_h,\alpha w)`}
        display
      />
      <PriorLectureLinks
        links={[
          {
            href: '/linear-algebra#homogeneous3d',
            label: 'Part I introduced affine homogeneous points with w = 1',
          },
        ]}
      />

      <h3 id="perspective-warp" className="section-subtitle">
        Build the perspective-warp matrix row by row
      </h3>
      <p className="body-text">
        Call the matrix <span className="math-sym">M<sub>warp</sub></span>. Its input is the column vector (x, y, z,
        1). We choose each row by stating exactly what its output must do.
      </p>
      <div className="walkthrough">
        <div className="label-caps">Rows 1, 2, and 4 · create the perspective fractions</div>
        <p className="body-text">
          We need x′ = nx/z after the divide. Make the first output nx and make the fourth output w = z. Dividing the
          first by the fourth then gives nx/z. The same choice gives ny/z vertically.
        </p>
        <MathText
          tex={String.raw`x_h=nx\qquad y_h=ny\qquad w=z\qquad\Longrightarrow\qquad \frac{x_h}{w}=\frac{nx}{z},\quad\frac{y_h}{w}=\frac{ny}{z}`}
          display
        />
      </div>
      <div className="walkthrough">
        <div className="label-caps">Row 3 · keep the near and far depths fixed</div>
        <p className="body-text">
          Let the third row produce z<sub>h</sub> = Az + B. After division by w = z, the ordinary depth is A + B/z.
          We require the near input z = n to remain n and the far input z = f to remain f:
        </p>
        <MathText
          tex={String.raw`A+\frac{B}{n}=n\qquad A+\frac{B}{f}=f`}
          display
        />
        <p className="body-text">
          Subtract the second equation from the first. Solving gives B = −fn. Substituting that into either equation
          gives A = n + f.
        </p>
        <MathText
          tex={String.raw`B=-fn\qquad A=n+f\qquad z_h=(n+f)z-fn`}
          display
        />
      </div>
      <ConstraintRows
        title="Every row follows one stated requirement"
        rows={[
          {
            row: '1',
            output: 'xh = nx',
            rule: <>xh/w must become nx/z</>,
            entries: '[n, 0, 0, 0]',
          },
          {
            row: '2',
            output: 'yh = ny',
            rule: <>yh/w must become ny/z</>,
            entries: '[0, n, 0, 0]',
          },
          {
            row: '3',
            output: 'zh = (n+f)z − fn',
            rule: <>near stays n; far stays f after ÷w</>,
            entries: '[0, 0, n+f, −fn]',
          },
          {
            row: '4',
            output: 'w = z',
            rule: <>the divide must use the point’s depth</>,
            entries: '[0, 0, 1, 0]',
          },
        ]}
      />
      <MatrixReadout matrix={Mwarp} label={<>M<sub>warp</sub> · derived rows</>} tex={WARP_TEX} />

      <div className="walkthrough">
        <div className="label-caps">Finish the map to NDC</div>
        <p className="body-text">
          M<sub>warp</sub> changes the frustum into an orthographic-shaped box while keeping the near and far planes in
          place. The already-derived M<sub>orth</sub> then maps that box to the NDC cube. Part I’s right-to-left
          composition rule says the combined matrix is:
        </p>
        <MathText tex={String.raw`M_{\mathrm{per}}=M_{\mathrm{orth}}M_{\mathrm{warp}}`} display />
        <p className="body-text">
          Multiplying the two matrices row by column gives the full perspective matrix below. Its four-number output,
          before dividing by w, is called the point’s <strong>clip coordinates</strong>. Dividing clip coordinates by
          w gives NDC.
        </p>
      </div>
      <MatrixReadout matrix={Mper} label={<>M<sub>per</sub> · full perspective projection</>} tex={PER_TEX} />

      <Playground label="Playground: α changes clip numbers, not the NDC point">
        <div className="controls-col wide">
          <SliderRow label="homogeneous scale α" value={alpha} min={0.25} max={3} step={0.05} onChange={setAlpha} />
          <div className="mono-block muted" aria-live="polite">
            <div>input point = ({fmt(x)}, 0, {fmt(z)}, 1)</div>
            <div>
              clip = ({clip ? fmt(clip.x) : '—'}, {clip ? fmt(clip.y) : '—'}, {clip ? fmt(clip.z) : '—'},{' '}
              {clip ? fmt(clip.w) : '—'})
            </div>
            <div>
              α-scaled clip = ({scaledClip ? fmt(scaledClip.x) : '—'}, {scaledClip ? fmt(scaledClip.y) : '—'},{' '}
              {scaledClip ? fmt(scaledClip.z) : '—'}, {scaledClip ? fmt(scaledClip.w) : '—'})
            </div>
            <div>
              after ÷w: {ndc && scaledNdc
                ? `(${fmt(ndc.x)}, ${fmt(ndc.y)}, ${fmt(ndc.z)}) = (${fmt(scaledNdc.x)}, ${fmt(scaledNdc.y)}, ${fmt(scaledNdc.z)})`
                : 'w is too close to 0'}
            </div>
          </div>
          <p className="hint-text">
            The default α is 1.6. Every clip coordinate becomes 1.6 times larger, including w, so each ratio after ÷w
            stays unchanged.
          </p>
        </div>
      </Playground>

      <div className="walkthrough">
        <div className="label-caps">Why perspective depth is not evenly spaced</div>
        <p className="body-text">
          Row 3 of M<sub>warp</sub>, followed by the divide by w = z, produces (n + f) − fn/z. Applying M
          <sub>orth</sub> afterward sends near to +1 and far to −1. The 1/z term means equal changes in camera-space
          depth do not create equal changes in NDC depth.
        </p>
        <MathText
          tex={String.raw`z_{\mathrm{after\ warp}}=(n+f)-\frac{fn}{z}\qquad z=n\Rightarrow n\qquad z=f\Rightarrow f`}
          display
        />
      </div>
      <Playground label="Diagram: nonlinear depth after the full perspective projection">
        <DepthPlot near={nearDistance} far={farDistance} z={z} />
        <div className="mono-block muted" aria-live="polite">
          near z = {fmt(n)} → NDC +1 · far z = {fmt(f)} → NDC −1 · current z = {fmt(z)} → NDC{' '}
          {perspectiveDepthNdc(z, bounds) === null ? 'not projectable' : fmt(perspectiveDepthNdc(z, bounds)!)}
        </div>
      </Playground>
    </Section>
  )
}
