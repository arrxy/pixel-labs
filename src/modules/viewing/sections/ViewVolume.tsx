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
        Camera space left the pin at the origin, looking down −z. That rewrite still contains the whole room: behind
        the camera, off to the side, infinitely far. A picture cannot. The view volume is the chunk we keep.
      </p>
      <p className="body-text">
        The near rectangle is the film. <strong>l r b t</strong> are its left, right, bottom, and top edges.{' '}
        <strong>near</strong> and <strong>far</strong> are distances in front of the pin. Because we look down −z,
        those planes sit at z = −near and z = −far.
      </p>
      <p className="body-text">
        Same six numbers, two shapes. Perspective opens the walls out from the pin: a wedge (a frustum). That is the
        camera you already have after <Mx sub="view" /> — rays through the eye. Orthographic is the other choice:
        walls stay parallel, a box, size does not change with depth.
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
            Dots: teal = inside that volume, grey = outside (rejected), orange = behind the camera. Watch <strong>B</strong>: it
            can sit in the wedge and miss the box.
          </li>
        </ul>
      </div>

      <div className="walkthrough">
        <div className="label-caps">Why this exists</div>
        <ol>
          <li>
            <strong>After</strong> <Mx sub="view" />. We know where every point is relative to the camera. We still
            have no idea which of those points hit a finite screen.
          </li>
          <li>
            <strong>Keep a window.</strong> Only points that pass through the near rectangle, and lie between near and
            far, are drawn. The rest are thrown away (clipped).
          </li>
          <li>
            <strong>Two cameras, one window.</strong> A photograph wants the wedge: things farther from the pin fill
            more of the far plane, so they look smaller on the film. A CAD drawing wants the box: size does not change
            with depth. Drag <strong>r</strong> and both volumes widen together.
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
          <div className="controls-col wide">
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
            <div className="mono-block muted" aria-live="polite">
              {classes.map((s) => (
                <div key={s.label}>
                  {s.label} ({s.note}): perspective {pointStatus(s.persp)} · orthographic {pointStatus(s.ortho)}
                </div>
              ))}
            </div>
            <p className="hint-text">
              Try it: look at B in both panes, then drag r until the box swallows B too.
            </p>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
