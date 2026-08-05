import { useState } from 'react'
import { SliderRow } from '../../components/Controls'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { apply3, fmt, rotationMatrix3 } from '../../lib/math3'
import { createArrow, SCENE_COLORS } from '../../lib/scene3d'
import type { Vec3 } from '../../lib/types'

type Axis = 'x' | 'y' | 'z'

export function Rotation3D() {
  const [theta, setTheta] = useState(45)
  const [axis, setAxis] = useState<Axis>('y')
  const v: Vec3 = { x: 2, y: 1, z: 0.5 }
  const R = rotationMatrix3(axis, (theta * Math.PI) / 180)
  const rv = apply3(R, v)

  return (
    <Section id="rotation3d" title="Rotation (3D)">
      <MathParagraph>
        {`A 3D rotation needs an axis. Here we rotate about X, Y, or Z. The dashed arrow is the original vector; green is after rotation.`}
      </MathParagraph>
      <MathText
        tex={String.raw`R_y(\theta)=\begin{pmatrix}\cos\theta&0&\sin\theta\\0&1&0\\-\sin\theta&0&\cos\theta\end{pmatrix}`}
        display
      />
      <Playground label="Playground: pick axis and θ">
        <Scene3D
          deps={[theta, axis]}
          setup={({ root }) => {
            root.add(createArrow(v, SCENE_COLORS.muted))
            root.add(createArrow(rv, SCENE_COLORS.a))
          }}
        />
        <div className="controls-col wide">
          <div className="btn-row">
            {(['x', 'y', 'z'] as Axis[]).map((ax) => (
              <button
                key={ax}
                type="button"
                className={`mode-btn${axis === ax ? ' active' : ''}`}
                onClick={() => setAxis(ax)}
              >
                {ax.toUpperCase()}
              </button>
            ))}
          </div>
          <SliderRow label="θ" value={theta} min={-180} max={180} step={1} onChange={setTheta} />
          <div className="mono-block muted">
            <div className="ink">
              result = ({fmt(rv.x)}, {fmt(rv.y)}, {fmt(rv.z)})
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
