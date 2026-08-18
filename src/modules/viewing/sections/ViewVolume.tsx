import { useMemo, useState } from 'react'
import { SliderRow } from '../../linear-algebra/components/Controls'
import { Playground } from '../../linear-algebra/components/Diagram'
import { Section } from '../../linear-algebra/components/Section'
import { FrustumScene } from '../components/FrustumScene'
import {
  DEFAULT_BOUNDS,
  classifyViewPoint,
  type PointClass,
  type ProjectionMode,
  type ViewBounds,
} from '../lib/projection'

const SAMPLE_POINTS = [
  { p: { x: 0.2, y: 0.1, z: -3.5 }, label: 'A', note: 'ahead' },
  { p: { x: 1.8, y: 0.4, z: -4 }, label: 'B', note: 'to the right' },
  { p: { x: 0, y: 0, z: -9 }, label: 'C', note: 'past far' },
  { p: { x: 0.4, y: 0.2, z: 1.2 }, label: 'D', note: 'behind pin' },
]

function Mx({ sub }: { sub: string }) {
  return (
    <span className="math-sym">
      M<sub>{sub}</sub>
    </span>
  )
}

function pointColor(kind: PointClass): string {
  if (kind === 'inside') return '#0f6e63'
  if (kind === 'behind') return '#d9622b'
  return '#9b978a'
}

function pointStatus(kind: PointClass): string {
  if (kind === 'clipped') return 'outside'
  return kind
}

const VOLUME_LOOK = { x: 0, y: 0.15, z: -3.8 }
const VOLUME_FROM = { x: 0.72, y: 0.42, z: 0.5 }

function VolumePane({
  title,
  caption,
  mode,
  bounds,
  points,
  volumeColor,
  viewId,
}: {
  title: string
  caption: string
  mode: ProjectionMode
  bounds: ViewBounds
  points: { p: { x: number; y: number; z: number }; color: string; label: string }[]
  volumeColor: string
  viewId: number
}) {
  return (
    <div className="frame-pane">
      <h3 className="frame-title">{title}</h3>
      <FrustumScene
        key={viewId}
        bounds={bounds}
        mode={mode}
        points={points}
        volumeColor={volumeColor}
        showPlaneLabels
        cameraDistance={22}
        fov={48}
        orbitTarget={VOLUME_LOOK}
        cameraOffset={VOLUME_FROM}
        ariaLabel={`${title} view volume in camera space`}
      />
      <p className="frame-caption">{caption}</p>
    </div>
  )
}

export function ViewVolume() {
  const [l, setL] = useState(DEFAULT_BOUNDS.l)
  const [r, setR] = useState(DEFAULT_BOUNDS.r)
  const [b, setB] = useState(DEFAULT_BOUNDS.b)
  const [t, setT] = useState(DEFAULT_BOUNDS.t)
  const [nearDistance, setNear] = useState(DEFAULT_BOUNDS.nearDistance)
  const [farDistance, setFar] = useState(DEFAULT_BOUNDS.farDistance)

  const [viewId, setViewId] = useState(0)

  const bounds: ViewBounds = useMemo(
    () => ({ l, r, b, t, nearDistance, farDistance }),
    [l, r, b, t, nearDistance, farDistance],
  )

  const reset = () => {
    setL(DEFAULT_BOUNDS.l)
    setR(DEFAULT_BOUNDS.r)
    setB(DEFAULT_BOUNDS.b)
    setT(DEFAULT_BOUNDS.t)
    setNear(DEFAULT_BOUNDS.nearDistance)
    setFar(DEFAULT_BOUNDS.farDistance)
    setViewId((n) => n + 1)
  }

  const classes = SAMPLE_POINTS.map((s) => ({
    ...s,
    ortho: classifyViewPoint(s.p, bounds, 'orthographic'),
    persp: classifyViewPoint(s.p, bounds, 'perspective'),
  }))

  return (
    <Section id="view-volume" title="View volume">
      <p className="body-text">
        Camera space left the pin at the origin, looking down −z. The rewritten scene still includes points behind
        the camera, off to the side, and infinitely far away. A picture cannot include all of them. The view volume is
        the region we keep.
      </p>
      <p className="body-text">
        The first boundary is the <strong>near plane</strong>. Its rectangle is the film: the window through which the
        scene is viewed. <strong>l, r, b, t</strong> name its left, right, bottom, and top coordinates.{' '}
        <strong>near</strong> and <strong>far</strong> are positive distances from the camera. Because the camera looks
        down −z, the two planes have camera-space coordinates z = −near and z = −far.
      </p>
      <p className="body-text">
        The six numbers define two possible visible regions. For perspective, the side walls open away from the camera
        and form a <strong>frustum</strong>, meaning a pyramid with its tip cut off by the near plane. For
        orthographic projection, the walls stay parallel and form a box.
      </p>
      <p className="body-text">
        A point outside the chosen volume is rejected before drawing. This rejection is called{' '}
        <strong>clipping</strong>. A point behind the camera is also rejected because no forward-looking ray reaches
        the film.
      </p>

      <div className="legend-box">
        <div className="label-caps">What you are looking at</div>
        <ul className="legend-list">
          <li>
            Both panes are still <strong>camera space</strong>. The black pin is the same origin as the Camera pane
            above.
          </li>
          <li>
            The <strong>teal quad</strong> is the near plane (the film). The <strong>orange quad</strong> is the far
            plane.
          </li>
          <li>
            Dots: teal = inside that volume, gray = outside (rejected), and orange = behind the camera. Watch{' '}
            <strong>B</strong>: it can sit in the wedge and miss the box.
          </li>
        </ul>
      </div>

      <div className="walkthrough">
        <div className="label-caps">Why this exists</div>
        <ol>
          <li>
            <strong>Apply</strong> <Mx sub="view" />. We then know where every point is relative to the camera, but we
            still do not know which points fall within a finite image.
          </li>
          <li>
            <strong>Keep a window.</strong> Only points that pass through the near rectangle, and lie between near and
            far, are drawn. The rest are thrown away (clipped).
          </li>
          <li>
            <strong>Two visible regions, one window.</strong> Both shapes share the same six numbers. A photograph wants
            the wedge because objects appear smaller as their distance from the pin increases. A CAD drawing uses the
            box because size does not change with depth. Drag <strong>r</strong> and both volumes widen together.
          </li>
        </ol>
      </div>

      <Playground label="Playground: wedge and box at once">
        <div className="frame-lab">
          <div className="frame-grid pair">
            <VolumePane
              title="Perspective"
              caption="Walls open from the pin. The far end is larger. B often fits here even when it misses the box."
              mode="perspective"
              bounds={bounds}
              volumeColor="#8a4b2f"
              viewId={viewId}
              points={classes.map((s) => ({
                p: s.p,
                color: pointColor(s.persp),
                label: `${s.label}\n${pointStatus(s.persp)}`,
              }))}
            />
            <VolumePane
              title="Orthographic"
              caption="Parallel walls. The far end is the same size as the film. B is often outside this box."
              mode="orthographic"
              bounds={bounds}
              volumeColor="#3d5a80"
              viewId={viewId}
              points={classes.map((s) => ({
                p: s.p,
                color: pointColor(s.ortho),
                label: `${s.label}\n${pointStatus(s.ortho)}`,
              }))}
            />
          </div>
          <div className="controls-col wide view-volume-controls">
            <SliderRow label="l" value={l} min={-3} max={-0.2} step={0.1} onChange={setL} />
            <SliderRow label="r" value={r} min={0.2} max={3} step={0.1} onChange={setR} />
            <SliderRow label="b" value={b} min={-2.5} max={-0.2} step={0.1} onChange={setB} />
            <SliderRow label="t" value={t} min={0.2} max={2.5} step={0.1} onChange={setT} />
            <SliderRow
              label="near"
              value={nearDistance}
              min={0.6}
              max={5}
              step={0.1}
              onChange={(v) => setNear(Math.min(v, farDistance - 0.4))}
            />
            <SliderRow
              label="far"
              value={farDistance}
              min={3}
              max={14}
              step={0.1}
              onChange={(v) => setFar(Math.max(v, nearDistance + 0.4))}
            />
            <button type="button" className="mode-btn" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </Playground>
      <div className="view-volume-results">
        <div className="mono-block muted view-volume-test-grid" aria-live="polite">
          {classes.map((s) => (
            <div className="view-volume-test-row" key={s.label}>
              <span>{s.label}</span>
              <span>({s.note}):</span>
              <span>perspective</span>
              <span>{pointStatus(s.persp)}</span>
              <span aria-hidden="true">·</span>
              <span>orthographic</span>
              <span>{pointStatus(s.ortho)}</span>
            </div>
          ))}
        </div>
        <p className="hint-text">
          Look at B in both panes, then drag r until the box contains B too.
        </p>
      </div>
    </Section>
  )
}
