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

export function ProjectionComparison() {
  const [mode, setMode] = useState<ProjectionMode>('perspective')
  const matrix = useMemo(() => projectionMatrix(DEFAULT_BOUNDS, mode), [mode])

  return (
    <Section id="projection-types" title="Orthographic vs perspective">
      <MathParagraph>
        {`Same near and far cubes, two cameras. Orthographic keeps their screen size. Perspective makes the farther cube shrink — rays meet at the camera origin.`}
      </MathParagraph>
      <PriorLectureLinks
        links={[
          {
            href: '/linear-algebra#projection3d',
            label: 'Vector projection in Part I is a different operation; this section is camera projection',
          },
        ]}
      />
      <Playground label="Playground: identical geometry, two projections">
        <FrustumScene
          bounds={DEFAULT_BOUNDS}
          mode={mode}
          cubes={SAMPLE_CUBES}
          ariaLabel={`${mode} view of a near cube and a far cube`}
        />
        <ProjectionPreview
          vertices={stackedCubeVertices()}
          edges={stackedCubeEdges()}
          groupColors={SAMPLE_CUBES.map((c) => c.color)}
          matrix={matrix}
          caption={`${mode} camera output in NDC xy`}
        />
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
