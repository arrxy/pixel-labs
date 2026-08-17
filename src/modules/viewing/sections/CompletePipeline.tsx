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
import { PipelineStepper } from '../components/PipelineStepper'
import { ProjectionPreview } from '../components/ProjectionPreview'
import {
  DEFAULT_BOUNDS,
  SAMPLE_CUBES,
  apply4,
  divideByW,
  ndcToViewport,
  orthographicMatrix,
  perspectiveMatrix,
  perspectiveWarp,
  stackedCubeEdges,
  stackedCubeVertices,
  toHomogeneous,
} from '../lib/projection'

type Stage = 'view' | 'clip' | 'ndc' | 'screen'

const STAGES: { id: Stage; label: string }[] = [
  { id: 'view', label: 'View point' },
  { id: 'clip', label: 'Clip (pre-÷w)' },
  { id: 'ndc', label: 'NDC (after ÷w)' },
  { id: 'screen', label: 'Screen pixels' },
]

const PER_TEX = String.raw`M_{\mathrm{per}}=M_{\mathrm{orth}}M_{\mathrm{warp}}=\begin{pmatrix}
\frac{2n}{r-l}&0&-\frac{r+l}{r-l}&0\\
0&\frac{2n}{t-b}&-\frac{t+b}{t-b}&0\\
0&0&\frac{n+f}{n-f}&-\frac{2fn}{n-f}\\
0&0&1&0
\end{pmatrix}`

export function CompletePipeline() {
  const [p, setP] = useState<Vec3>({ x: 0.5, y: 0.25, z: -4 })
  const [stage, setStage] = useState<Stage>('view')
  const [width, setWidth] = useState(320)
  const [height, setHeight] = useState(240)

  const bounds = DEFAULT_BOUNDS
  const Morth = orthographicMatrix(bounds)
  const Mwarp = perspectiveWarp(bounds)
  const Mper = perspectiveMatrix(bounds)
  const clip = Mper ? apply4(Mper, toHomogeneous(p)) : null
  const ndc = clip ? divideByW(clip) : null
  const screen = ndc ? ndcToViewport(ndc, width, height) : null

  const readout = useMemo(() => {
    if (stage === 'view') return `view (${fmt(p.x)}, ${fmt(p.y)}, ${fmt(p.z)}, 1)`
    if (!clip) return 'invalid bounds'
    if (stage === 'clip') return `clip (${fmt(clip.x)}, ${fmt(clip.y)}, ${fmt(clip.z)}, ${fmt(clip.w)})`
    if (!ndc) return 'not projectable (w ≈ 0)'
    if (stage === 'ndc') return `NDC (${fmt(ndc.x)}, ${fmt(ndc.y)}, ${fmt(ndc.z)})`
    if (!screen) return 'not projectable'
    return `screen (${fmt(screen.x)}, ${fmt(screen.y)}) px`
  }, [stage, p, clip, ndc, screen])

  const reset = () => {
    setP({ x: 0.5, y: 0.25, z: -4 })
    setStage('view')
    setWidth(320)
    setHeight(240)
  }

  return (
    <Section id="full-pipeline" title="The full projection" noBorder>
      <p className="body-text">
        The full perspective projection applies the perspective warp <span className="math-sym">M<sub>warp</sub></span>{' '}
        first, then the orthographic map <span className="math-sym">M<sub>orth</sub></span>. Their product is the full
        projection matrix <span className="math-sym">M<sub>per</sub></span>.
      </p>
      <MathText tex={String.raw`M_{\mathrm{per}}=M_{\mathrm{orth}}M_{\mathrm{warp}}`} display />
      <p className="body-text">
        <strong>Clip space</strong> is the four-coordinate result immediately after{' '}
        <span className="math-sym">M<sub>per</sub></span>, before dividing by w. “Clip” here names a coordinate stage;
        it is different from “clipped,” which meant a point was rejected for being outside the view volume.
      </p>
      <p className="body-text">
        Dividing clip coordinates by w produces <strong>NDC</strong>. A <strong>viewport</strong> is the rectangular
        region of the screen where that NDC image is drawn. Its width W and height H are measured in pixels.
      </p>
      <MathText
        tex={String.raw`x_{\mathrm{screen}}=\frac{(x_{\mathrm{ndc}}+1)W}{2}\qquad y_{\mathrm{screen}}=\frac{(1-y_{\mathrm{ndc}})H}{2}`}
        display
      />
      <p className="hint-text">
        The x formula changes [−1, 1] into [0, W]. The y formula also flips the direction because screen y usually
        increases downward.
      </p>
      <PriorLectureLinks links={[{ href: '/linear-algebra#together3d', label: 'Review matrix composition in Part I' }]} />
      <Playground label="Playground: one vertex through the pipeline">
        <FrustumScene
          bounds={bounds}
          mode="perspective"
          cubes={SAMPLE_CUBES}
          points={[{ p, color: '#1a1a1a' }]}
          ariaLabel="Perspective frustum with a tracked vertex"
        />
        <ProjectionPreview
          vertices={stackedCubeVertices()}
          edges={stackedCubeEdges()}
          groupColors={SAMPLE_CUBES.map((c) => c.color)}
          markers={[{ p, color: '#1a1a1a', label: 'P' }]}
          matrix={Mper}
          caption="Final perspective projection in NDC xy"
        />
        <div className="controls-col wide">
          <PipelineStepper stages={STAGES} active={stage} onChange={setStage} />
          <Vec3Inputs value={p} onChange={setP} prefix="P" color="var(--ink)" />
          <SliderRow label="viewport W" value={width} min={80} max={640} step={10} onChange={setWidth} />
          <SliderRow label="viewport H" value={height} min={80} max={480} step={10} onChange={setHeight} />
          <button type="button" className="mode-btn" onClick={reset}>
            Reset
          </button>
          <div className="mono-block muted" aria-live="polite">
            {readout}
          </div>
        </div>
      </Playground>
      <MatrixReadout matrix={Mper} label="Mper = Morth Mwarp" tex={PER_TEX} />
      <p className="hint-text">
        {Morth && Mwarp
          ? 'The numeric matrix above is exactly Morth times Mwarp, then the viewport formulas map the NDC square to pixels.'
          : 'Choose valid near/far distances to build the matrix.'}
      </p>
    </Section>
  )
}
