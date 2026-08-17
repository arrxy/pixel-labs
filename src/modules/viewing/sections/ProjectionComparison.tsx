import { useMemo, useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathParagraph } from '../../linear-algebra/components/MathText'
import { Section } from '../../linear-algebra/components/Section'
import { FrustumScene } from '../components/FrustumScene'
import { ProjectionPreview } from '../components/ProjectionPreview'
import {
  DEFAULT_BOUNDS,
  SAMPLE_CUBES,
  projectionMatrix,
  stackedCubeEdges,
  stackedCubeVertices,
  type ProjectionMode,
} from '../lib/projection'

const VOLUME_LOOK = { x: 0, y: 0.15, z: -3.8 }
const VOLUME_FROM = { x: 0.72, y: 0.42, z: 0.5 }

export function ProjectionComparison() {
  const [mode, setMode] = useState<ProjectionMode>('orthographic')
  const matrix = useMemo(() => projectionMatrix(DEFAULT_BOUNDS, mode), [mode])

  return (
    <Section id="projection-types" title="Orthographic vs perspective">
      <MathParagraph>
        {`Same near and far cubes, two cameras. Orthographic keeps their screen size. Perspective makes the farther cube shrink — rays meet at the camera origin.`}
      </MathParagraph>
      <p className="hint-text">
        Both matrices have now been derived. This playground applies them to identical geometry so only the
        projection rule changes.
      </p>
      <PriorLectureLinks
        links={[
          {
            href: '/linear-algebra#projection3d',
            label: 'Vector projection in Part I is a different operation; this section is camera projection',
          },
        ]}
      />
      <Playground label="Playground: identical geometry, two projections">
        <div className="projection-pair">
          <FrustumScene
            bounds={DEFAULT_BOUNDS}
            mode={mode}
            cubes={SAMPLE_CUBES.map((c, i) => ({ ...c, label: i === 0 ? 'closer object' : 'farther object' }))}
            showPlaneLabels
            width={400}
            height={400}
            cameraDistance={22}
            fov={48}
            orbitTarget={VOLUME_LOOK}
            cameraOffset={VOLUME_FROM}
            ariaLabel={`${mode} view of a near cube and a far cube`}
          />
          <ProjectionPreview
            vertices={stackedCubeVertices()}
            edges={stackedCubeEdges()}
            groupColors={SAMPLE_CUBES.map((c) => c.color)}
            matrix={matrix}
            caption={`${mode} camera output in NDC xy`}
          />
        </div>
        <div className="controls-col">
          <div className="btn-row" role="group" aria-label="Projection type">
            <button
              type="button"
              className={mode === 'orthographic' ? 'mode-btn active' : 'mode-btn'}
              aria-pressed={mode === 'orthographic'}
              onClick={() => setMode('orthographic')}
            >
              Orthographic
            </button>
            <button
              type="button"
              className={mode === 'perspective' ? 'mode-btn active' : 'mode-btn'}
              aria-pressed={mode === 'perspective'}
              onClick={() => setMode('perspective')}
            >
              Perspective
            </button>
          </div>
          <p className="hint-text">
            Green is nearer, orange is farther. Switch modes and watch the output square.
          </p>
        </div>
      </Playground>
    </Section>
  )
}
