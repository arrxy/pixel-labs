import { useState } from 'react'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathText } from '../../linear-algebra/components/MathText'
import { Section } from '../../linear-algebra/components/Section'
import { FrustumScene } from '../components/FrustumScene'
import {
  DEFAULT_BOUNDS,
  SAMPLE_CUBES,
  type ProjectionMode,
} from '../lib/projection'

const LABELED_CUBES = SAMPLE_CUBES.map((c, i) => ({
  ...c,
  label: i === 0 ? 'closer object' : 'farther object',
}))

const VIEW_LOOK = { x: 0, y: 0.15, z: -3.8 }
const VIEW_FROM = { x: 0.72, y: 0.42, z: 0.5 }
const CANON_LOOK = { x: 0, y: 0, z: 0 }
const CANON_FROM = { x: 0.7, y: 0.55, z: 0.85 }

export function CanonicalVolume() {
  const [mode, setMode] = useState<ProjectionMode>('perspective')

  return (
    <Section id="canonical-volume" title="One standard target: the canonical cube">
      <p className="body-text">
        The two view volumes have different shapes, positions, and sizes. Later drawing steps would be needlessly
        different if they had to understand every possible camera volume. Instead, each projection will rewrite its
        chosen volume into the same standard cube.
      </p>
      <p className="body-text">
        That standard target is the <strong>canonical view volume</strong>. Every coordinate in it lies between −1
        and +1. Coordinates measured in this cube are called <strong>Normalized Device Coordinates</strong>, abbreviated
        as <strong>NDC</strong>.
      </p>
      <MathText
        tex={String.raw`-1\le x_{\mathrm{ndc}}\le1\qquad -1\le y_{\mathrm{ndc}}\le1\qquad -1\le z_{\mathrm{ndc}}\le1`}
        display
      />
      <div className="walkthrough">
        <div className="label-caps">The six boundary rules</div>
        <ol>
          <li>
            <strong>Horizontal.</strong> Left becomes x = −1; right becomes x = +1.
          </li>
          <li>
            <strong>Vertical.</strong> Bottom becomes y = −1; top becomes y = +1.
          </li>
          <li>
            <strong>Depth.</strong> Near becomes z = +1; far becomes z = −1.
          </li>
        </ol>
        <p className="hint-text">
          These endpoint rules are the facts from which we will derive every matrix entry. No projection matrix has
          been used in the diagram below.
        </p>
      </div>

      <Playground label="Diagram: starting volume and required NDC target">
        <div className="frame-lab">
          <div className="frame-grid pair">
            <div className="frame-pane">
              <h3 className="frame-title">Camera (view) space</h3>
              <FrustumScene
                bounds={DEFAULT_BOUNDS}
                mode={mode}
                cubes={LABELED_CUBES}
                showVolume
                showCamera
                showPlaneLabels
                showCanonical={false}
                cameraDistance={22}
                fov={48}
                orbitTarget={VIEW_LOOK}
                cameraOffset={VIEW_FROM}
                ariaLabel="View volume in camera space with a near cube and a far cube"
              />
              <p className="frame-caption">
                The wire shape is the volume selected in the previous section. Teal and orange are equal-size example
                objects, not part of the volume itself.
              </p>
            </div>
            <div className="frame-pane">
              <h3 className="frame-title">Required target: NDC</h3>
              <FrustumScene
                bounds={DEFAULT_BOUNDS}
                mode={mode}
                cubes={[]}
                showVolume={false}
                showCamera={false}
                showCanonical
                cameraDistance={8}
                orbitTarget={CANON_LOOK}
                cameraOffset={CANON_FROM}
                ariaLabel="Canonical NDC cube labeled from minus one to plus one on each axis"
              />
              <p className="frame-caption">
                This is the destination, not a result computed early. The next sections derive the two maps that reach
                it.
              </p>
            </div>
          </div>
          <div className="controls-col wide">
            <div className="btn-row" role="group" aria-label="Starting view-volume shape">
              <button
                type="button"
                className={mode === 'orthographic' ? 'mode-btn active' : 'mode-btn'}
                aria-pressed={mode === 'orthographic'}
                onClick={() => setMode('orthographic')}
              >
                Orthographic starting box
              </button>
              <button
                type="button"
                className={mode === 'perspective' ? 'mode-btn active' : 'mode-btn'}
                aria-pressed={mode === 'perspective'}
                onClick={() => setMode('perspective')}
              >
                Perspective starting frustum
              </button>
            </div>
            <p className="hint-text">
              Switch only the left starting shape. The labeled NDC target on the right stays the same.
            </p>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
