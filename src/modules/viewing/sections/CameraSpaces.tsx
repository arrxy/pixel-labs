import { useState, type ReactNode } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { SliderRow } from '../../linear-algebra/components/Controls'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathText } from '../../linear-algebra/components/MathText'
import { Scene3D, type Scene3DApi } from '../../linear-algebra/components/Scene3D'
import { Section } from '../../linear-algebra/components/Section'
import { fmt } from '../../linear-algebra/lib/math'
import { applyAffine4, clamp, computeCompositeM4, invertAffine4, mul4 } from '../../linear-algebra/lib/math3'
import { createDashedLine, createPoint, createSpriteLabel, SCENE_COLORS } from '../../linear-algebra/lib/scene3d'
import { createCameraGizmo, createUnitCube } from '../lib/scene'
import { lookAt } from '../lib/projection'

const Mm = computeCompositeM4(0.6, 0.15, -0.4, 0, 28, 12, 1.2, 1, 1.1)
const P_LOCAL = { x: 1, y: 1, z: 1 }

function Mx({ sub }: { sub: string }) {
  return (
    <span className="math-sym">
      M<sub>{sub}</sub>
    </span>
  )
}

function SpaceFrame({
  title,
  coord,
  caption,
  ariaLabel,
  deps,
  setup,
  cameraDistance = 10,
}: {
  title: string
  coord: string
  caption: ReactNode
  ariaLabel: string
  deps: unknown[]
  setup: (api: Scene3DApi) => void
  cameraDistance?: number
}) {
  return (
    <div className="frame-pane">
      <h3 className="frame-title">{title}</h3>
      <Scene3D
        responsive
        width={260}
        height={220}
        cameraDistance={cameraDistance}
        showGuides
        ariaLabel={ariaLabel}
        deps={deps}
        setup={setup}
      />
      <p className="frame-coord" aria-live="polite">
        {coord}
      </p>
      <p className="frame-caption">{caption}</p>
    </div>
  )
}

export function CameraSpaces() {
  const [camX, setCamX] = useState(1.6)
  const [camZ, setCamZ] = useState(4.6)
  const [yaw, setYaw] = useState(-18)

  const reset = () => {
    setCamX(1.6)
    setCamZ(4.6)
    setYaw(-18)
  }

  const eye = { x: camX, y: 1.4, z: camZ }
  const rad = (yaw * Math.PI) / 180
  const target = { x: eye.x + Math.sin(rad), y: 0.6, z: eye.z - Math.cos(rad) }
  const Mview = lookAt(eye, target, { x: 0, y: 1, z: 0 })
  const Mcam = invertAffine4(Mview)
  const worldP = applyAffine4(Mm, P_LOCAL)
  const viewP = applyAffine4(Mview, worldP)
  const cubeView = mul4(Mview, Mm)
  const camDeps = [camX, camZ, yaw]

  return (
    <Section id="camera-space" title="One point, three coordinate spaces">
      <p className="body-text">
        A <strong>coordinate space</strong> is a choice of origin and axes used to describe a point. The physical
        point does not change when its coordinates are rewritten in another space.
      </p>
      <div className="legend-box">
        <div className="label-caps">The three spaces</div>
        <ul className="legend-list">
          <li>
            <strong>Model space</strong> belongs to one object. The cube’s own origin and axes are used.
          </li>
          <li>
            <strong>World space</strong> is the shared room containing every object and the camera.
          </li>
          <li>
            <strong>Camera space</strong>, also called <strong>view space</strong>, uses the camera as the origin. Its
            x-axis points right, its y-axis points up, and it looks along −z.
          </li>
        </ul>
      </div>
      <p className="body-text">
        <strong>P</strong> is one physical point: the labeled orange corner of the cube. A 4×4 matrix rewrites P into
        the next space. <Mx sub="model" /> places the object in the world; <Mx sub="view" /> rewrites world coordinates
        relative to the camera.
      </p>
      <MathText
        tex={String.raw`P_{\text{world}}=M_{\text{model}}\,P_{\text{model}}\qquad P_{\text{camera}}=M_{\text{view}}\,P_{\text{world}}`}
        display
      />
      <p className="body-text">
        The camera’s <strong>pose</strong> is where it sits in the world and which way it faces (the black pin in the
        World pane). If you used that pose as a matrix, it would plant the camera into the world.
      </p>
      <p className="body-text">
        <Mx sub="view" /> does the opposite: it leaves the camera at the origin and moves the cube instead. That is
        what “inverse” means here: it undoes the camera’s placement. In the World pane, the pin moves around a fixed
        cube.
        In the Camera pane, the cube moves around a fixed pin.
      </p>
      <p className="hint-text">
        This section uses <Mx sub="view" /> for its job. The next section constructs every row of that matrix from the
        camera’s position and axes.
      </p>
      <PriorLectureLinks
        links={[
          { href: '/linear-algebra#together3d', label: 'Review composed 4×4 transforms' },
          { href: '/linear-algebra#inverse3d', label: 'inverse transforms in Part I' },
        ]}
      />

      <div className="legend-box">
        <div className="label-caps">What you are looking at</div>
        <ul className="legend-list">
          <li>
            <strong>P</strong> (orange) is a point: one corner of the cube, at (1, 1, 1) in model space. Each matrix{' '}
            <strong>M</strong> below rewrites that same point.
          </li>
          <li>
            The <strong>teal cube</strong> is the object. It is the same cube in every frame, just written in different
            coordinates.
          </li>
          <li>
            The <strong>black pin</strong> is the camera’s position (the eye). The camera icon faces along its −z-axis.
          </li>
          <li>
            The <strong>dashed gray cube</strong> in World is a ghost of Model: where the cube sat before{' '}
            <Mx sub="model" />.
          </li>
        </ul>
      </div>

      <div className="walkthrough">
        <div className="label-caps">Walkthrough: one corner, three names</div>
        <ol>
          <li>
            <strong>Model.</strong> The cube sits on its own origin. P is just (1, 1, 1). There is no camera in this
            space, so this pane never changes when you drag the sliders.
          </li>
          <li>
            <strong>World.</strong> <Mx sub="model" /> placed that cube in a shared room. The
            orange dot is the same corner, now in world coordinates. The black pin is the camera standing somewhere in
            that room. The dashed orange line is “camera to P.”
          </li>
          <li>
            <strong>Camera.</strong> Undoing the camera’s placement locks the pin at (0, 0, 0), looking along −z, while
            the cube moves. Drag <strong>camera x</strong>: in World the pin slides, while in Camera the cube slides
            the other way. It is the same motion described from the opposite frame. That is <Mx sub="view" />.
          </li>
        </ol>
      </div>

      <Playground label="Playground: all three frames at once">
        <div className="frame-lab">
          <div className="frame-grid">
            <SpaceFrame
              title="1 · Model"
              coord={`P = (${fmt(P_LOCAL.x)}, ${fmt(P_LOCAL.y)}, ${fmt(P_LOCAL.z)})`}
              caption="Local coordinates. No camera. Sliders do not affect this pane."
              ariaLabel="Cube in model space"
              deps={[]}
              cameraDistance={8}
              setup={({ root }) => {
                root.add(createUnitCube(SCENE_COLORS.a))
                root.add(createPoint(P_LOCAL, SCENE_COLORS.b, 0.1))
                root.add(createSpriteLabel('P', { x: P_LOCAL.x, y: P_LOCAL.y + 0.24, z: P_LOCAL.z }, {
                  color: SCENE_COLORS.b,
                  worldHeight: 0.22,
                }))
              }}
            />
            <SpaceFrame
              title="2 · World"
              coord={`P = (${fmt(worldP.x)}, ${fmt(worldP.y)}, ${fmt(worldP.z)})`}
              caption={
                <>
                  Shared room: cube after <Mx sub="model" />, camera as a black pin. Drag the camera; P stays put.
                </>
              }
              ariaLabel="Cube and camera in world space"
              deps={camDeps}
              setup={({ root }) => {
                root.add(createUnitCube(SCENE_COLORS.muted, undefined, true))
                root.add(createUnitCube(SCENE_COLORS.a, Mm))
                root.add(createPoint(worldP, SCENE_COLORS.b, 0.1))
                root.add(createSpriteLabel('P', { x: worldP.x, y: worldP.y + 0.24, z: worldP.z }, {
                  color: SCENE_COLORS.b,
                  worldHeight: 0.22,
                }))
                if (Mcam) {
                  root.add(createCameraGizmo(Mcam))
                  root.add(createDashedLine(eye, worldP, SCENE_COLORS.b))
                  root.add(createPoint(eye, '#1a1a1a', 0.06))
                }
              }}
            />
            <SpaceFrame
              title="3 · Camera"
              coord={`P = (${fmt(viewP.x)}, ${fmt(viewP.y)}, ${fmt(viewP.z)})`}
              caption="The pin is locked at (0, 0, 0), looking along −z. Drag the sliders: the cube moves, not the pin."
              ariaLabel="Cube in camera space"
              deps={camDeps}
              setup={({ root }) => {
                root.add(createCameraGizmo())
                root.add(createPoint({ x: 0, y: 0, z: 0 }, '#1a1a1a', 0.06))
                root.add(createUnitCube(SCENE_COLORS.a, cubeView))
                root.add(createPoint(viewP, SCENE_COLORS.b, 0.1))
                root.add(createSpriteLabel('P', { x: viewP.x, y: viewP.y + 0.24, z: viewP.z }, {
                  color: SCENE_COLORS.b,
                  worldHeight: 0.22,
                }))
              }}
            />
          </div>
          <div className="controls-col wide">
            <SliderRow label="camera x" value={camX} min={-3} max={4} step={0.1} onChange={(v) => setCamX(clamp(v, 4))} />
            <SliderRow label="camera z" value={camZ} min={2} max={8} step={0.1} onChange={setCamZ} />
            <SliderRow label="yaw (turn left/right)" value={yaw} min={-60} max={60} step={1} onChange={setYaw} />
            <button type="button" className="mode-btn" onClick={reset}>
              Reset
            </button>
            <p className="hint-text">
              Move camera x and watch the World and Camera panes together. The Model pane should not move.
            </p>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
