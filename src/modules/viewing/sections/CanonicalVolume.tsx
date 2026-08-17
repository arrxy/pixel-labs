import { useMemo, useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathText } from '../../linear-algebra/components/MathText'
import { Section } from '../../linear-algebra/components/Section'
import { FrustumScene } from '../components/FrustumScene'
import {
  apply4,
  cubeCorners,
  DEFAULT_BOUNDS,
  divideByW,
  SAMPLE_CUBES,
  toHomogeneous,
  orthographicMatrix,
  perspectiveMatrix,
  type ProjectionMode,
} from '../lib/projection'

function Mx({ sub }: { sub: string }) {
  return (
    <span className="math-sym">
      M<sub>{sub}</sub>
    </span>
  )
}

const LABELED_CUBES = SAMPLE_CUBES.map((c, i) => ({
  ...c,
  label: i === 0 ? 'near' : 'far',
}))

const VIEW_LOOK = { x: 0, y: 0.15, z: -3.8 }
const VIEW_FROM = { x: 0.72, y: 0.42, z: 0.5 }
const CANON_LOOK = { x: 0, y: 0, z: 0 }
const CANON_FROM = { x: 0.7, y: 0.55, z: 0.85 }

export function CanonicalVolume() {
  const [mode, setMode] = useState<ProjectionMode>('perspective')

  const matrix = useMemo(
    () => (mode === 'orthographic' ? orthographicMatrix(DEFAULT_BOUNDS) : perspectiveMatrix(DEFAULT_BOUNDS)),
    [mode],
  )

  const transformed = useMemo(() => {
    if (!matrix) return []
    return LABELED_CUBES.map((c) => ({
      color: c.color,
      label: c.label,
      corners: cubeCorners(c.center, c.size).map((p) => {
        const ndc = divideByW(apply4(matrix, toHomogeneous(p)))
        return ndc ?? p
      }),
    }))
  }, [matrix])

  return (
    <Section id="canonical-volume" title="Canonical view volume">
      <p className="body-text">
        From the start: the cube lives in <strong>model</strong> space. <Mx sub="model" /> writes it into the shared{' '}
        <strong>world</strong>. <Mx sub="view" /> is the inverse of the camera’s pose, so the pin sits at the origin
        looking −z — <strong>camera / view</strong> space. The view volume then keeps only a wedge (perspective) or a
        box (orthographic).
      </p>
      <p className="body-text">
        Throwing away points outside the volume, and later drawing on a screen, should not depend on which shape we
        started from. A <strong>projection map</strong> reshapes either volume into one shared cube{' '}
        <span className="math-sym">[−1, 1]³</span>. This standard target is the <strong>canonical view volume</strong>.
        Here “warp” simply means reshaping coordinates.
      </p>
      <MathText
        tex={String.raw`\text{camera (view) space}\xrightarrow{\text{projection map}}\text{canonical cube }[-1,1]^3`}
        display
      />

      <div className="legend-box">
        <div className="label-caps">What the two boxes are</div>
        <ul className="legend-list">
          <li>
            <strong>Teal</strong> and <strong>orange</strong> are the same object twice: two cubes of equal size in
            camera space. Teal is closer to the pin (near). Orange is farther (far).
          </li>
          <li>
            They are not the view volume. The volume is the wire wedge or box around them. The cubes are just two
            objects sitting inside it, so you can see what the warp does to shape and size.
          </li>
        </ul>
      </div>

      <div className="walkthrough">
        <div className="label-caps">What each projection map does</div>
        <ol>
          <li>
            <strong>Orthographic warp.</strong> First shift the view box so its center is the origin. Then scale each
            axis so the box becomes <span className="math-sym">[−1, 1]³</span>. Parallel edges stay parallel, so a
            cube stays a rectangular box (a cuboid). Depth does not change width, so teal and orange stay the same
            size.
          </li>
          <li>
            <strong>Perspective warp.</strong> First shrink horizontal and vertical coordinates according to depth,
            so farther objects become smaller. Then reshape the result into the same canonical cube. The orange cube
            is farther away, so it shrinks more than the teal cube. The following sections derive the exact rules and
            matrix order.
          </li>
        </ol>
      </div>

      <PriorLectureLinks
        links={[
          { href: '/linear-algebra#translation3d', label: 'Review translation in Part I' },
          { href: '/linear-algebra#scale3d', label: 'scale' },
        ]}
      />

      <Playground label="Playground: view space and canonical, side by side">
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
                Same two cubes, still in camera space. Switch the warp to see a wedge or a box around them.
              </p>
            </div>
            <div className="frame-pane">
              <h3 className="frame-title">Canonical</h3>
              <FrustumScene
                bounds={DEFAULT_BOUNDS}
                mode={mode}
                cubes={[]}
                transformedCubes={transformed}
                showVolume={false}
                showCamera={false}
                showCanonical
                cameraDistance={8}
                orbitTarget={CANON_LOOK}
                cameraOffset={CANON_FROM}
                ariaLabel="Near and far cubes mapped into the canonical cube"
              />
              <p className="frame-caption">
                After the projection map. Orthographic: two cuboids of one size. Perspective: tapered boxes, with the
                farther orange box smaller.
              </p>
            </div>
          </div>
          <div className="controls-col wide">
            <div className="btn-row" role="group" aria-label="Projection used to warp">
              <button
                type="button"
                className={mode === 'orthographic' ? 'mode-btn active' : 'mode-btn'}
                aria-pressed={mode === 'orthographic'}
                onClick={() => setMode('orthographic')}
              >
                Orthographic warp
              </button>
              <button
                type="button"
                className={mode === 'perspective' ? 'mode-btn active' : 'mode-btn'}
                aria-pressed={mode === 'perspective'}
                onClick={() => setMode('perspective')}
              >
                Perspective warp
              </button>
            </div>
            <p className="hint-text">
              Watch the right pane: equal-size cuboids for orthographic; tapered boxes, with orange smaller, for
              perspective.
            </p>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
