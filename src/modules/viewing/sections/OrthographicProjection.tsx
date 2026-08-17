import { useMemo, useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { SliderRow } from '../../linear-algebra/components/Controls'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathText } from '../../linear-algebra/components/MathText'
import { Vec3Inputs } from '../../linear-algebra/components/Vec3Inputs'
import { Section } from '../../linear-algebra/components/Section'
import { fmt } from '../../linear-algebra/lib/math'
import type { Vec3 } from '../../linear-algebra/lib/types'
import { FrustumScene } from '../components/FrustumScene'
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
        Parallel rays hit the near plane. Depth does not change apparent size: a cube at the near plane and a cube at
        the far plane draw at the same size. Mapping the view box onto{' '}
        <span className="math-sym">[−1, 1]³</span> uses one scale and one translation per axis. The axes are not mixed:
        output x uses only input x, output y uses only input y, and output z uses only input z.
      </p>
      <p className="body-text">
        To shorten the matrix, let <strong>n = −near</strong> and <strong>f = −far</strong>. They are signed z
        coordinates, not positive distances. Because the camera looks down −z, both are negative and n &gt; f.
      </p>
      <MathText tex={String.raw`n=-\mathrm{near}\qquad f=-\mathrm{far}\qquad n>f`} display />
      <MathText tex={ORTH_TEX} display />

      <div className="walkthrough">
        <div className="label-caps">One axis, then copy it three times</div>
        <p className="body-text">
          Take a number u that runs from u₀ to u₁. We want a new number U that runs from −1 to +1, linearly. Shift by
          the midpoint so the interval is centered on 0, then divide by the half-width so the ends land on ±1.
        </p>
        <MathText
          tex={String.raw`m=\dfrac{u_0+u_1}{2}\qquad h=\dfrac{u_1-u_0}{2}\qquad U=\dfrac{u-m}{h}`}
          display
        />
        <p className="body-text">Rewrite that as U = s u + c, which is exactly one row of a 4×4 matrix:</p>
        <MathText
          tex={String.raw`s=\dfrac{2}{u_1-u_0}\qquad c=-\dfrac{u_1+u_0}{u_1-u_0}`}
          display
        />
        <p className="hint-text">
          Check: u = u₀ gives U = −1. u = u₁ gives U = +1. The zeros in the matrix say x does not use y or z, and so
          on.
        </p>
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
            <strong>z, row 3.</strong> Near should become +1, far −1. n is the near plane (e.g. −2), f the far plane
            (e.g. −8), so n &gt; f. Same recipe with u₀ = f, u₁ = n: scale 2/(n − f), translation −(n + f)/(n − f).
          </li>
          <li>
            <strong>Fourth-coordinate row.</strong> A 4×4 matrix carries one extra coordinate, initialized to 1 for a
            point. The row (0, 0, 0, 1) leaves it equal to 1. Perspective will introduce and use this coordinate later.
          </li>
        </ol>
      </div>
      <MathText
        tex={String.raw`z=n\;\Rightarrow\;\dfrac{2n-(n+f)}{n-f}=1\qquad z=f\;\Rightarrow\;\dfrac{2f-(n+f)}{n-f}=-1`}
        display
      />
      <p className="hint-text">
        Live values from the sliders (n = −near, f = −far). Watch the matrix below change with l, r, b, t, near, far.
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
          { href: '/linear-algebra#translation3d', label: 'Review translation in Part I' },
          { href: '/linear-algebra#scale3d', label: 'scale' },
          { href: '/linear-algebra#matrix3d', label: '3D matrices' },
        ]}
      />
      <p className="body-text">
        <strong>NDC</strong> (Normalized Device Coordinates) is the canonical cube{' '}
        <span className="math-sym">[−1, 1]³</span> after <span className="math-sym">M</span>
        <sub>orth</sub>. The square on the right is that cube looking down the camera’s −z — x right, y up. That is
        the film. z is depth (near → +1, far → −1) and is not drawn as a third axis there.
      </p>
      <p className="body-text">
        The 3D pane is an observer standing beside the volume, so near and far sit left and right. The NDC pane is
        what the pin sees. They will not look like the same picture. Under orthographic, x and y ignore z, so the
        front and back of a cube land on one square. Teal (near) and orange (far) are the same size; they only shift
        if their x, y differ.
      </p>
      <Playground label="Playground: orthographic box, NDC, and a test point">
        <div className="projection-pair">
          <FrustumScene
            bounds={bounds}
            mode="orthographic"
            cubes={SAMPLE_CUBES.map((c, i) => ({ ...c, label: i === 0 ? 'near' : 'far' }))}
            points={[{ p, color: '#1a1a1a', label: 'P' }]}
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
            caption="Orthographic camera output in NDC xy"
          />
        </div>
        <div className="controls-col wide">
          <SliderRow label="l" value={l} min={-3} max={-0.2} step={0.1} onChange={setL} />
          <SliderRow label="r" value={r} min={0.2} max={3} step={0.1} onChange={setR} />
          <SliderRow label="b" value={b} min={-2.5} max={-0.2} step={0.1} onChange={setB} />
          <SliderRow label="t" value={t} min={0.2} max={2.5} step={0.1} onChange={setT} />
          <SliderRow label="near" value={nearDistance} min={0.6} max={5} step={0.1} onChange={(v) => setNear(Math.min(v, farDistance - 0.4))} />
          <SliderRow label="far" value={farDistance} min={3} max={14} step={0.1} onChange={(v) => setFar(Math.max(v, nearDistance + 0.4))} />
          <Vec3Inputs value={p} onChange={setP} prefix="P" color="var(--ink)" />
          <button type="button" className="mode-btn" onClick={reset}>
            Reset
          </button>
          <div className="mono-block muted" aria-live="polite">
            {projected.ok ? (
              <div>
                NDC ({fmt(projected.ndc.x)}, {fmt(projected.ndc.y)}, {fmt(projected.ndc.z)})
                {inNdc(projected.ndc) ? ' · inside' : ' · outside NDC'}
              </div>
            ) : (
              <div>not projectable</div>
            )}
          </div>
        </div>
      </Playground>
      <MatrixReadout matrix={M} label="Morth" />
    </Section>
  )
}
