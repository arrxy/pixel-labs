import { useState } from 'react'
import { PriorLectureLinks } from '../../../components/PriorLectureLinks'
import { SliderRow } from '../../linear-algebra/components/Controls'
import { Playground } from '../../linear-algebra/components/Diagram'
import { MathText } from '../../linear-algebra/components/MathText'
import { Section } from '../../linear-algebra/components/Section'
import { fmt } from '../../linear-algebra/lib/math'
import { dot3 } from '../../linear-algebra/lib/math3'
import { LookAtBasisScene } from '../components/LookAtBasisScene'
import { MatrixReadout } from '../components/MatrixReadout'
import { lookAt, lookAtBasis } from '../lib/projection'

const UP = { x: 0, y: 1, z: 0 }
const TARGET = { x: 0, y: 0.6, z: 0 }

export function LookAtBasis() {
  const [eyeX, setEyeX] = useState(2.4)
  const [eyeY, setEyeY] = useState(1.8)
  const [eyeZ, setEyeZ] = useState(4.2)
  const eye = { x: eyeX, y: eyeY, z: eyeZ }
  const { u, v, w } = lookAtBasis(eye, TARGET, UP)
  const Mview = lookAt(eye, TARGET, UP)

  const reset = () => {
    setEyeX(2.4)
    setEyeY(1.8)
    setEyeZ(4.2)
  }

  return (
    <Section id="camera-basis" title="Build the camera’s coordinate frame">
      <p className="body-text">
        The previous section used a camera matrix. We can now build it using only vector subtraction, normalization,
        cross products, and dot products from Part I.
      </p>
      <div className="legend-box">
        <div className="label-caps">Three inputs</div>
        <ul className="legend-list">
          <li>
            <strong>eye</strong> is the camera’s position in world space.
          </li>
          <li>
            <strong>target</strong> is a world-space point the camera looks toward.
          </li>
          <li>
            <strong>up</strong> is a preferred upward direction. Here it is the world y-axis direction (0, 1, 0).
          </li>
        </ul>
      </div>

      <div className="walkthrough">
        <div className="label-caps">Step 1 · build three perpendicular unit axes</div>
        <p className="body-text">
          We name the camera’s right, up, and backward axes <strong>u</strong>, <strong>v</strong>, and{' '}
          <strong>w</strong>. The camera looks along −w.
        </p>
        <MathText
          tex={String.raw`\mathbf w=\operatorname{normalize}(\mathbf{eye}-\mathbf{target})`}
          display
        />
        <p className="body-text">
          eye − target points backward, from the target to the camera. Crossing the preferred up direction with w
          gives a right-pointing vector. Normalize it to make its length 1. A final cross product gives the corrected
          camera-up axis.
        </p>
        <MathText
          tex={String.raw`\mathbf u=\operatorname{normalize}(\mathbf{up}\times\mathbf w)\qquad \mathbf v=\mathbf w\times\mathbf u`}
          display
        />
      </div>

      <div className="walkthrough">
        <div className="label-caps">Step 2 · find a point’s camera coordinates</div>
        <p className="body-text">
          Let p be any point in world space. First subtract eye so the camera position becomes the origin. A dot
          product with each camera axis then measures the point along that axis:
        </p>
        <MathText
          tex={String.raw`x_c=\mathbf u\cdot(\mathbf p-\mathbf{eye})\qquad y_c=\mathbf v\cdot(\mathbf p-\mathbf{eye})\qquad z_c=\mathbf w\cdot(\mathbf p-\mathbf{eye})`}
          display
        />
        <p className="body-text">
          Distribute each dot product. For example, x<sub>c</sub> = u·p − u·eye. The coefficients of p become the
          first three entries of a matrix row; the remaining number is the translation entry.
        </p>
        <MathText
          tex={String.raw`M_{\mathrm{view}}=\begin{pmatrix}
u_x&u_y&u_z&-\mathbf u\cdot\mathbf{eye}\\
v_x&v_y&v_z&-\mathbf v\cdot\mathbf{eye}\\
w_x&w_y&w_z&-\mathbf w\cdot\mathbf{eye}\\
0&0&0&1
\end{pmatrix}`}
          display
        />
        <p className="hint-text">
          Check the result: substitute p = eye. Each of the first three rows becomes axis·eye − axis·eye = 0,
          so the camera moves to (0, 0, 0).
        </p>
      </div>

      <PriorLectureLinks
        links={[
          { href: '/linear-algebra#normalize3d', label: 'Review normalization' },
          { href: '/linear-algebra#cross3d', label: 'the cross product' },
          { href: '/linear-algebra#dot3d', label: 'the dot product in Part I' },
        ]}
      />

      <Playground label="Playground: eye, target, and camera axes">
        <LookAtBasisScene eye={eye} target={TARGET} up={UP} />
        <div className="controls-col wide">
          <SliderRow label="eye x" value={eyeX} min={-4} max={4} step={0.1} onChange={setEyeX} />
          <SliderRow label="eye y" value={eyeY} min={0.8} max={4} step={0.1} onChange={setEyeY} />
          <SliderRow label="eye z" value={eyeZ} min={1.5} max={7} step={0.1} onChange={setEyeZ} />
          <button type="button" className="mode-btn" onClick={reset}>
            Reset
          </button>
          <div className="mono-block muted" aria-live="polite">
            <div>u (right) = ({fmt(u.x)}, {fmt(u.y)}, {fmt(u.z)})</div>
            <div>v (up) = ({fmt(v.x)}, {fmt(v.y)}, {fmt(v.z)})</div>
            <div>w (backward) = ({fmt(w.x)}, {fmt(w.y)}, {fmt(w.z)})</div>
            <div>row translations = ({fmt(-dot3(u, eye))}, {fmt(-dot3(v, eye))}, {fmt(-dot3(w, eye))})</div>
          </div>
        </div>
      </Playground>
      <MatrixReadout matrix={Mview} label={<>M<sub>view</sub> · world to camera</>} />
    </Section>
  )
}
