import { useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathText } from '../../linear-algebra/components/MathText'
import { Vec3Inputs } from '../../linear-algebra/components/Vec3Inputs'
import { Section } from '../../linear-algebra/components/Section'
import { fmt } from '../../linear-algebra/lib/math'
import { applyAffine4, translate4 } from '../../linear-algebra/lib/math3'
import type { Vec3 } from '../../linear-algebra/lib/types'
import { FrustumScene } from '../components/FrustumScene'
import { MatrixReadout } from '../components/MatrixReadout'
import { ProjectionPreview } from '../components/ProjectionPreview'
import { ViewportDiagram } from '../components/ViewportDiagram'
import {
  DEFAULT_BOUNDS,
  SAMPLE_CUBES,
  apply4,
  divideByW,
  lookAt,
  ndcToViewport,
  orthographicMatrix,
  perspectiveMatrix,
  perspectiveWarp,
  stackedCubeEdges,
  stackedCubeVertices,
  toHomogeneous,
} from '../lib/projection'

const MMODEL = translate4(0.2, 0.1, -3.5)
const CAMERA_EYE = { x: 1.2, y: 0.8, z: 2 }
const CAMERA_TARGET = { x: 0, y: 0, z: -4 }
const MVIEW = lookAt(CAMERA_EYE, CAMERA_TARGET, { x: 0, y: 1, z: 0 })
const VIEWPORT_WIDTH = 320
const VIEWPORT_HEIGHT = 240

const PER_TEX = String.raw`M_{\mathrm{per}}=M_{\mathrm{orth}}M_{\mathrm{warp}}=\begin{pmatrix}
\frac{2n}{r-l}&0&-\frac{r+l}{r-l}&0\\
0&\frac{2n}{t-b}&-\frac{t+b}{t-b}&0\\
0&0&\frac{n+f}{n-f}&-\frac{2fn}{n-f}\\
0&0&1&0
\end{pmatrix}`

function tuple3(point: Vec3): string {
  return `(${fmt(point.x)}, ${fmt(point.y)}, ${fmt(point.z)})`
}

export function CompletePipeline() {
  const [modelP, setModelP] = useState<Vec3>({ x: 0.3, y: 0.2, z: 0 })

  const bounds = DEFAULT_BOUNDS
  const Morth = orthographicMatrix(bounds)
  const Mwarp = perspectiveWarp(bounds)
  const Mper = perspectiveMatrix(bounds)
  const worldP = applyAffine4(MMODEL, modelP)
  const viewP = applyAffine4(MVIEW, worldP)
  const clip = Mper ? apply4(Mper, toHomogeneous(viewP)) : null
  const ndc = clip ? divideByW(clip) : null
  const screen = ndc ? ndcToViewport(ndc, VIEWPORT_WIDTH, VIEWPORT_HEIGHT) : null

  const reset = () => {
    setModelP({ x: 0.3, y: 0.2, z: 0 })
  }

  return (
    <Section id="full-pipeline" title="One point through the complete pipeline" noBorder>
      <p className="body-text">
        This section places the operations in sequence so we can follow a point through every named stage.
      </p>
      <p className="body-text">
        A <strong>viewport</strong> is the rectangular screen region where the final image is drawn. Its width W and
        height H are measured in pixels. The last stage maps the NDC square into this rectangle.
      </p>
      <div className="walkthrough">
        <div className="label-caps">The six stages</div>
        <ol>
          <li>
            <strong>Model.</strong> P starts in the object’s own coordinate space.
          </li>
          <li>
            <strong>World.</strong> M<sub>model</sub> places the object in the shared scene.
          </li>
          <li>
            <strong>Camera (view).</strong> M<sub>view</sub> rewrites P relative to the camera.
          </li>
          <li>
            <strong>Clip.</strong> M<sub>per</sub> produces four clip coordinates. They have not yet been divided by w.
          </li>
          <li>
            <strong>NDC.</strong> Divide clip x, y, and z by clip w. The visible canonical cube is [−1, 1]³.
          </li>
          <li>
            <strong>Screen.</strong> The viewport map changes NDC x and y into pixel coordinates.
          </li>
        </ol>
      </div>
      <MathText
        tex={String.raw`P_{\mathrm{model}}\xrightarrow{M_{\mathrm{model}}}P_{\mathrm{world}}\xrightarrow{M_{\mathrm{view}}}P_{\mathrm{camera}}\xrightarrow{M_{\mathrm{per}}}P_{\mathrm{clip}}\xrightarrow{\div w}P_{\mathrm{ndc}}\xrightarrow{\mathrm{viewport}}P_{\mathrm{screen}}`}
        display
      />

      <div className="walkthrough">
        <div className="label-caps">Derive the viewport map from endpoints</div>
        <p className="body-text">
          Screen x increases to the right, but screen y usually increases downward.
        </p>
        <p className="body-text">
          For x, require NDC −1 → pixel 0 and NDC +1 → pixel W. The same linear endpoint calculation used for the
          orthographic matrix gives scale W/2 and translation W/2.
        </p>
        <MathText
          tex={String.raw`x_{\mathrm{screen}}=\frac{W}{2}x_{\mathrm{ndc}}+\frac{W}{2}=\frac{(x_{\mathrm{ndc}}+1)W}{2}`}
          display
        />
        <p className="body-text">
          For y, require NDC +1 at the top to become pixel 0, and NDC −1 at the bottom to become pixel H. The negative
          scale performs the direction flip.
        </p>
        <MathText
          tex={String.raw`y_{\mathrm{screen}}=-\frac{H}{2}y_{\mathrm{ndc}}+\frac{H}{2}=\frac{(1-y_{\mathrm{ndc}})H}{2}`}
          display
        />
      </div>

      <PriorLectureLinks
        links={[{ href: '/linear-algebra#together3d', label: 'Review right-to-left matrix composition in Part I' }]}
      />

      <Playground label="Playground: inspect one point at every named stage">
        <div className="controls-col wide">
          <div className="pipeline-summary" aria-label="Coordinate values through the graphics pipeline" aria-live="polite">
            <div className="pipeline-summary-head">
              <span>Space</span><span>Operation</span><span>Coordinate of P</span>
            </div>
            <div className="pipeline-summary-row">
              <strong><span>1</span> Model</strong><small>starting point</small><code>{tuple3(modelP)}</code>
            </div>
            <div className="pipeline-summary-row">
              <strong><span>2</span> World</strong><small>M<sub>model</sub></small><code>{tuple3(worldP)}</code>
            </div>
            <div className="pipeline-summary-row">
              <strong><span>3</span> Camera</strong><small>M<sub>view</sub></small><code>{tuple3(viewP)}</code>
            </div>
            <div className="pipeline-summary-row">
              <strong><span>4</span> Clip</strong><small>M<sub>per</sub></small>
              <code>{clip ? `(${fmt(clip.x)}, ${fmt(clip.y)}, ${fmt(clip.z)}, ${fmt(clip.w)})` : 'unavailable'}</code>
            </div>
            <div className="pipeline-summary-row">
              <strong><span>5</span> NDC</strong><small>divide by w</small><code>{ndc ? tuple3(ndc) : 'undefined'}</code>
            </div>
            <div className="pipeline-summary-row">
              <strong><span>6</span> Screen</strong><small>viewport map</small>
              <code>{screen ? `(${fmt(screen.x)}, ${fmt(screen.y)}) px` : 'unavailable'}</code>
            </div>
          </div>
          <div className="pipeline-model-inputs">
            <Vec3Inputs value={modelP} onChange={setModelP} prefix="model P" color="var(--ink)" />
          </div>
          <button type="button" className="mode-btn" onClick={reset}>
            Reset
          </button>
          <p className="hint-text">
            The summary updates all stages together. The three diagrams below provide visual references for the
            camera-space, NDC, and screen stages.
          </p>
        </div>
        <div className="projection-pair">
          <div className="frame-pane">
            <h3 className="frame-title">Camera-space view</h3>
            <p className="frame-caption">A 3D observer view of the camera, perspective frustum, objects, and point P.</p>
            <FrustumScene
              bounds={bounds}
              mode="perspective"
              cubes={SAMPLE_CUBES}
              points={[{ p: viewP, color: '#1a1a1a', label: 'P' }]}
              width={400}
              height={400}
              ariaLabel="Perspective frustum with the tracked point in camera space"
            />
          </div>
          <div className="frame-pane">
            <h3 className="frame-title">NDC x–y view</h3>
            <p className="frame-caption">The projected result after dividing by w; depth is not shown.</p>
            <ProjectionPreview
              vertices={stackedCubeVertices()}
              edges={stackedCubeEdges()}
              groupColors={SAMPLE_CUBES.map((cube) => cube.color)}
              markers={[{ p: viewP, color: '#1a1a1a', label: 'P' }]}
              matrix={Mper}
              caption="The tracked point after perspective projection in the NDC x–y plane"
              showAnnotations={false}
            />
          </div>
        </div>
        <ViewportDiagram ndc={ndc} width={VIEWPORT_WIDTH} height={VIEWPORT_HEIGHT} />
      </Playground>

      <MatrixReadout
        matrix={Mper}
        label={<>M<sub>per</sub> = M<sub>orth</sub> M<sub>warp</sub></>}
        tex={PER_TEX}
      />
      <p className="hint-text">
        {Morth && Mwarp
          ? <>The numeric matrix is M<sub>orth</sub> multiplied by M<sub>warp</sub>. M<sub>model</sub> and M<sub>view</sub> happen earlier; the viewport happens after the divide by w.</>
          : 'Choose valid camera bounds to build the projection matrix.'}
      </p>
    </Section>
  )
}
