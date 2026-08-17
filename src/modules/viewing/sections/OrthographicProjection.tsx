import { useMemo, useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { SliderRow } from '../../linear-algebra/components/Controls'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathParagraph, MathText } from '../../linear-algebra/components/MathText'
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
      <MathParagraph>
        {`Parallel rays hit the near plane. Depth does not change apparent size: a cube at $z=n$ and a cube at $z=f$ draw the same on screen. Mapping the view box onto $[-1,1]^3$ is just scale and translation.`}
      </MathParagraph>
      <MathText tex={ORTH_TEX} display />
      <PriorLectureLinks links={[{ href: '/linear-algebra#matrix3d', label: 'Review 3D matrices in Part I' }]} />
      <Playground label="Playground: orthographic box, NDC, and a test point">
        <FrustumScene
          bounds={bounds}
          mode="orthographic"
          cubes={SAMPLE_CUBES}
          points={[{ p, color: '#1a1a1a' }]}
          ariaLabel="Orthographic view volume"
        />
        <ProjectionPreview
          vertices={stackedCubeVertices()}
          edges={stackedCubeEdges()}
          matrix={M}
          caption="Orthographic camera output"
        />
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
                {inNdc(projected.ndc) ? ' · inside' : ' · clipped'}
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
