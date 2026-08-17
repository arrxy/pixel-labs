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
  { id: 'view', label: 'View' },
  { id: 'clip', label: 'Clip' },
  { id: 'ndc', label: 'NDC' },
  { id: 'screen', label: 'Screen' },
]

const PER_TEX = String.raw`M_{\mathrm{per}}=M_{\mathrm{orth}}P=\begin{pmatrix}
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
  const Pwarp = perspectiveWarp(bounds)
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
      <MathParagraph>
        {`Perspective projection is the warp $P$ followed by the same orthographic map. Then divide by $w$ and scale into pixels.`}
      </MathParagraph>
      <MathText tex={String.raw`M_{\mathrm{per}}=M_{\mathrm{orth}}P`} display />
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
          matrix={Mper}
          caption="Final perspective projection"
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
      <MatrixReadout matrix={Mper} label="Mper = Morth P" tex={PER_TEX} />
      <MathText
        tex={String.raw`x_{\mathrm{screen}}=\frac{(x_{\mathrm{ndc}}+1)W}{2}\qquad y_{\mathrm{screen}}=\frac{(1-y_{\mathrm{ndc}})H}{2}`}
        display
      />
      <p className="hint-text">
        {Morth && Pwarp
          ? 'The numeric matrix above is exactly Morth times P, then the viewport formulas map the NDC square to pixels.'
          : 'Choose valid near/far distances to build the matrix.'}
      </p>
    </Section>
  )
}
