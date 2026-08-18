import { useMemo, useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { SliderRow } from '../../linear-algebra/components/Controls'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathText } from '../../linear-algebra/components/MathText'
import { Section } from '../../linear-algebra/components/Section'
import { fmt } from '../../linear-algebra/lib/math'
import type { Vec3 } from '../../linear-algebra/lib/types'
import { ConstraintRows } from '../components/ConstraintRows'
import { FrustumScene } from '../components/FrustumScene'
import { IntervalMapDiagram } from '../components/IntervalMapDiagram'
import { MatrixReadout } from '../components/MatrixReadout'
import { ProjectionPreview } from '../components/ProjectionPreview'
import {
  DEFAULT_BOUNDS,
  SAMPLE_CUBES,
  inNdc,
  orthographicMatrix,
  projectPoint,
  signedPlanes,
  stackedCubeEdges,
  stackedCubeVertices,
  type ViewBounds,
} from '../lib/projection'

const ORTH_TEX = String.raw`M_{\mathrm{orth}}=\begin{pmatrix}
\frac{2}{r-l}&0&0&-\frac{r+l}{r-l}\\
0&\frac{2}{t-b}&0&-\frac{t+b}{t-b}\\
0&0&\frac{2}{n-f}&-\frac{n+f}{n-f}\\
0&0&0&1
\end{pmatrix}`

export function OrthographicProjection() {
  const [l, setL] = useState(DEFAULT_BOUNDS.l)
  const [r, setR] = useState(DEFAULT_BOUNDS.r)
  const [b, setB] = useState(DEFAULT_BOUNDS.b)
  const [t, setT] = useState(DEFAULT_BOUNDS.t)
  const [nearDistance, setNear] = useState(DEFAULT_BOUNDS.nearDistance)
  const [farDistance, setFar] = useState(DEFAULT_BOUNDS.farDistance)
  const [p, setP] = useState<Vec3>({ x: 0.4, y: 0.2, z: -3.5 })

  const bounds: ViewBounds = useMemo(
    () => ({ l, r, b, t, nearDistance, farDistance }),
    [l, r, b, t, nearDistance, farDistance],
  )
  const M = orthographicMatrix(bounds)
  const { n, f } = signedPlanes(bounds)
  const sx = 2 / (r - l)
  const tx = -(r + l) / (r - l)
  const sy = 2 / (t - b)
  const ty = -(t + b) / (t - b)
  const sz = 2 / (n - f)
  const tz = -(n + f) / (n - f)
  const projected = M ? projectPoint(M, p) : { ok: false as const, reason: 'not-projectable' as const }

  const reset = () => {
    setL(DEFAULT_BOUNDS.l)
    setR(DEFAULT_BOUNDS.r)
    setB(DEFAULT_BOUNDS.b)
    setT(DEFAULT_BOUNDS.t)
    setNear(DEFAULT_BOUNDS.nearDistance)
    setFar(DEFAULT_BOUNDS.farDistance)
    setP({ x: 0.4, y: 0.2, z: -3.5 })
  }

  return (
    <Section id="orthographic" title="Orthographic projection">
      <p className="body-text">
        Orthographic projection preserves x and y without shrinking them according to depth. A closer cube and a
        farther cube are therefore rendered at the same size. Mapping the view box onto{' '}
        <span className="math-sym">[−1, 1]³</span> uses one scale and one translation per axis. The axes are not mixed:
        output x uses only input x, output y uses only input y, and output z uses only input z.
      </p>
      <p className="body-text">
        To shorten the matrix, let <strong>n = −near</strong> and <strong>f = −far</strong>. They are signed z
        coordinates, not positive distances. Because the camera looks down −z, both are negative and n &gt; f.
      </p>
      <MathText tex={String.raw`n=-\mathrm{near}\qquad f=-\mathrm{far}\qquad n>f`} display />

      <div className="walkthrough">
        <div className="label-caps">One axis, then copy it three times</div>
        <p className="body-text">
          Take a number u that ranges from u₀ to u₁. We want a new number U that ranges linearly from −1 to +1. Shift by
          the midpoint so the interval is centered on 0, then divide by the half-width so the ends land on ±1.
        </p>
        <div className="label-caps">What the symbols mean</div>
        <ul className="symbol-list">
          <li><strong>u</strong> is the original x, y, or z coordinate.</li>
          <li><strong>u₀</strong> and <strong>u₁</strong> are the lower and upper endpoints of the input interval.</li>
          <li><strong>m</strong> is the interval midpoint; <strong>h</strong> is its half-width.</li>
          <li><strong>U</strong> is the normalized output coordinate, between −1 and +1.</li>
          <li><strong>s</strong> is the scale factor; <strong>c</strong> is the constant translation after scaling.</li>
        </ul>
        <p className="hint-text">
          We require u₁ ≠ u₀. If the endpoints are equal, the interval has zero width and cannot be stretched onto
          [−1, 1].
        </p>
        <IntervalMapDiagram u0={l} u1={r} leftLabel="l" rightLabel="r" />
        <p className="body-text">
          Averaging the endpoints finds the center. Half of their difference finds the distance from that center to
          either endpoint.
        </p>
        <MathText
          tex={String.raw`m=\dfrac{u_0+u_1}{2}\qquad h=\dfrac{u_1-u_0}{2}\qquad U=\dfrac{u-m}{h}`}
          display
        />
        <p className="body-text">
          Subtracting m moves the midpoint to 0; dividing by h makes each half of the interval one unit long. Thus u₀
          maps to −1, m maps to 0, and u₁ maps to +1.
        </p>
        <MathText
          tex={String.raw`u=u_0\Rightarrow U=-1\qquad u=m\Rightarrow U=0\qquad u=u_1\Rightarrow U=1`}
          display
        />
        <p className="body-text">Rewrite that as U = s u + c, which is exactly one row of a 4×4 matrix:</p>
        <MathText
          tex={String.raw`U=\dfrac{u-\frac{u_0+u_1}{2}}{\frac{u_1-u_0}{2}}
=\dfrac{2u-u_0-u_1}{u_1-u_0}
=\dfrac{2}{u_1-u_0}u-\dfrac{u_1+u_0}{u_1-u_0}`}
          display
        />
        <MathText
          tex={String.raw`\boxed{U=su+c}\qquad s=\dfrac{2}{u_1-u_0}\qquad c=-\dfrac{u_1+u_0}{u_1-u_0}`}
          display
        />
        <p className="hint-text">
          The scale s changes the interval’s size; the translation c moves its center to zero. The zeros in the
          matrix say x does not use y or z, and so on.
        </p>

        <div className="label-caps">Worked example: a centered interval</div>
        <p className="body-text">
          For u₀ = −1.20 and u₁ = 1.20, the midpoint is 0 and the half-width is 1.20:
        </p>
        <MathText
          tex={String.raw`m=\dfrac{-1.20+1.20}{2}=0\qquad
h=\dfrac{1.20-(-1.20)}{2}=1.20`}
          display
        />
        <MathText
          tex={String.raw`s=\dfrac{2}{2.40}=\dfrac{5}{6}\qquad c=0\qquad
\boxed{U=\dfrac{5}{6}u}`}
          display
        />
        <table className="example-table">
          <thead><tr><th>Input u</th><th>Calculation</th><th>Output U</th></tr></thead>
          <tbody>
            <tr><td>−1.20</td><td>(5/6)(−1.20)</td><td>−1</td></tr>
            <tr><td>−0.60</td><td>(5/6)(−0.60)</td><td>−0.5</td></tr>
            <tr><td>0</td><td>(5/6)(0)</td><td>0</td></tr>
            <tr><td>0.60</td><td>(5/6)(0.60)</td><td>0.5</td></tr>
            <tr><td>1.20</td><td>(5/6)(1.20)</td><td>1</td></tr>
          </tbody>
        </table>
        <p className="hint-text">Because this interval is already centered at zero, no translation is needed: c = 0.</p>

        <div className="label-caps">Worked example: translation required</div>
        <p className="body-text">For u₀ = 2 and u₁ = 6, the midpoint is 4 and the half-width is 2:</p>
        <MathText
          tex={String.raw`m=\dfrac{2+6}{2}=4\qquad h=\dfrac{6-2}{2}=2\qquad
U=\dfrac{u-4}{2}=\dfrac{1}{2}u-2`}
          display
        />
        <p className="body-text">
          Here s = 1/2 and c = −2. Substitution verifies the whole map: 2 → −1, 4 → 0, and 6 → +1.
        </p>
        <MathText
          tex={String.raw`u=2\Rightarrow U=-1\qquad u=4\Rightarrow U=0\qquad u=6\Rightarrow U=1`}
          display
        />
        <ol>
          <li>
            <strong>x, row 1.</strong> u₀ = l, u₁ = r. Scale 2/(r − l), translation −(r + l)/(r − l). Left wall → −1,
            right wall → +1.
          </li>
          <li>
            <strong>y, row 2.</strong> u₀ = b, u₁ = t. Scale 2/(t − b), translation −(t + b)/(t − b). Bottom → −1, top
            → +1.
          </li>
          <li>
            <strong>z, row 3.</strong> Near should become +1 and far should become −1. The near-plane coordinate n
            might be −2, while the far-plane coordinate f might be −8, so n &gt; f. Apply the same formula with u₀ = f
            and u₁ = n: scale 2/(n − f), translation −(n + f)/(n − f).
          </li>
          <li>
            <strong>Fourth-coordinate row.</strong> A 4×4 matrix carries one extra coordinate, initialized to 1 for a
            point. The row (0, 0, 0, 1) leaves it equal to 1. Perspective will introduce and use this coordinate later.
          </li>
        </ol>
      </div>
      <ConstraintRows
        title="How the four rows are earned"
        rows={[
          {
            row: '1',
            output: 'x NDC from x',
            rule: <>l → −1 and r → +1</>,
            entries: '[2/(r−l), 0, 0, −(r+l)/(r−l)]',
          },
          {
            row: '2',
            output: 'y NDC from y',
            rule: <>b → −1 and t → +1</>,
            entries: '[0, 2/(t−b), 0, −(t+b)/(t−b)]',
          },
          {
            row: '3',
            output: 'z NDC from z',
            rule: <>n → +1 and f → −1</>,
            entries: '[0, 0, 2/(n−f), −(n+f)/(n−f)]',
          },
          {
            row: '4',
            output: 'keep w equal to 1',
            rule: <>ordinary points enter with w = 1</>,
            entries: '[0, 0, 0, 1]',
          },
        ]}
      />
      <MathText
        tex={String.raw`z=n\;\Rightarrow\;\dfrac{2n-(n+f)}{n-f}=1\qquad z=f\;\Rightarrow\;\dfrac{2f-(n+f)}{n-f}=-1`}
        display
      />
      <p className="body-text">
        Assembling the four rows gives the orthographic matrix. Every entry above is now accounted for.
      </p>
      <MathText tex={ORTH_TEX} display />
      <p className="hint-text">
        Live values from the sliders (n = −near, f = −far). Watch the numeric matrix below change with l, r, b, t,
        near, and far.
      </p>
      <div className="mono-block muted" aria-live="polite">
        <div>
          x: scale {fmt(sx)} · translate {fmt(tx)}
        </div>
        <div>
          y: scale {fmt(sy)} · translate {fmt(ty)}
        </div>
        <div>
          z: scale {fmt(sz)} · translate {fmt(tz)} · n = {fmt(n)}, f = {fmt(f)}
        </div>
      </div>
      <PriorLectureLinks
        links={[
          { href: '/linear-algebra#translation3d', label: 'Review translation' },
          { href: '/linear-algebra#scale3d', label: 'scaling' },
          { href: '/linear-algebra#matrix3d', label: '3D matrices in Part I' },
        ]}
      />
      <p className="body-text">
        The square on the right is the canonical cube viewed along the camera’s −z direction: x points right and y
        points up. The depth coordinate z is stored too, but is not drawn as a third axis in this square.
      </p>
      <p className="body-text">
        The 3D pane is an observer standing beside the volume, so near and far sit left and right. The NDC pane is
        what the pin sees. The two panes show different views. Under orthographic projection, x and y ignore z, so the
        front and back of a cube land on one square. Teal (near) and orange (far) are the same size; they only shift
        if their x or y coordinates differ.
      </p>
      <Playground label="Playground: orthographic box, NDC, and a test point">
        <div className="projection-pair">
          <FrustumScene
            bounds={bounds}
            mode="orthographic"
            cubes={SAMPLE_CUBES.map((c, i) => ({ ...c, label: i === 0 ? 'closer object' : 'farther object' }))}
            points={[{ p, color: '#1a1a1a', label: 'P' }]}
            showPlaneLabels
            width={400}
            height={400}
            ariaLabel="Orthographic view volume"
          />
          <ProjectionPreview
            vertices={stackedCubeVertices()}
            edges={stackedCubeEdges()}
            groupColors={SAMPLE_CUBES.map((c) => c.color)}
            markers={[{ p, color: '#1a1a1a', label: 'P' }]}
            matrix={M}
            caption="Orthographic camera output in the NDC x–y plane"
            showStatus={false}
          />
        </div>
        <div className="controls-col wide orthographic-controls">
          <SliderRow label="l" value={l} min={-3} max={-0.2} step={0.1} onChange={setL} />
          <SliderRow label="r" value={r} min={0.2} max={3} step={0.1} onChange={setR} />
          <SliderRow label="b" value={b} min={-2.5} max={-0.2} step={0.1} onChange={setB} />
          <SliderRow label="t" value={t} min={0.2} max={2.5} step={0.1} onChange={setT} />
          <SliderRow label="near" value={nearDistance} min={0.6} max={5} step={0.1} onChange={(v) => setNear(Math.min(v, farDistance - 0.4))} />
          <SliderRow label="far" value={farDistance} min={3} max={14} step={0.1} onChange={(v) => setFar(Math.max(v, nearDistance + 0.4))} />
          <SliderRow label="Px" value={p.x} min={-4} max={4} step={0.1} onChange={(x) => setP({ ...p, x })} />
          <SliderRow label="Py" value={p.y} min={-4} max={4} step={0.1} onChange={(y) => setP({ ...p, y })} />
          <SliderRow label="Pz" value={p.z} min={-14} max={-0.2} step={0.1} onChange={(z) => setP({ ...p, z })} />
          <button type="button" className="mode-btn" onClick={reset}>
            Reset
          </button>
          <div className="mono-block muted" aria-live="polite">
            {projected.ok ? (
              <div>
                NDC ({fmt(projected.ndc.x)}, {fmt(projected.ndc.y)}, {fmt(projected.ndc.z)})
                {' · '}
                {inNdc(projected.ndc) ? 'inside' : <span className="outside-ndc">outside NDC</span>}
              </div>
            ) : (
              <div>not projectable</div>
            )}
          </div>
        </div>
      </Playground>
      <MatrixReadout matrix={M} label={<>M<sub>orth</sub></>} />
    </Section>
  )
}
