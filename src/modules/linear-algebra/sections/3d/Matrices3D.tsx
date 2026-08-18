import { useState } from 'react'
import { SliderRow } from '../../components/Controls'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { fmt, mul3, rotationMatrix3, scaleMatrix3 } from '../../lib/math3'
import { createBasis, createUnitCubeWire, SCENE_COLORS } from '../../lib/scene3d'

type Order = 'AB' | 'BA'

export function Matrices3D() {
  const [theta, setTheta] = useState(40)
  const [sx, setSx] = useState(1.6)
  const [order, setOrder] = useState<Order>('AB')

  const R = rotationMatrix3('z', (theta * Math.PI) / 180)
  const S = scaleMatrix3(sx, 1, 1)
  const M = order === 'AB' ? mul3(R, S) : mul3(S, R)
  const mat4 = [
    [M[0][0], M[0][1], M[0][2], 0],
    [M[1][0], M[1][1], M[1][2], 0],
    [M[2][0], M[2][1], M[2][2], 0],
    [0, 0, 0, 1],
  ]

  return (
    <Section id="matrix3d" title="Matrices (3D)" borderedTop>
      <MathParagraph>
        {`In 3D each column of a $3\\times 3$ matrix is where a basis vector lands: images of $(1,0,0)$, $(0,1,0)$, and $(0,0,1)$. Order still matters: $AB\\neq BA$ in general.`}
      </MathParagraph>
      <MathText
        tex={String.raw`M=\begin{pmatrix}| & | & |\\e_1' & e_2' & e_3'\\| & | & |\end{pmatrix}`}
        display
      />
      <Playground label="Playground: A = rotation about z, B = scaling along x">
        <Scene3D
          deps={[theta, sx, order]}
          setup={({ root }) => {
            root.add(createUnitCubeWire(SCENE_COLORS.muted, undefined, true))
            root.add(createUnitCubeWire(SCENE_COLORS.a, mat4))
            root.add(createBasis(M, 1.4))
          }}
        />
        <div className="controls-col wide">
          <SliderRow label="θ (A = rotation about z)" value={theta} min={-180} max={180} step={1} onChange={setTheta} />
          <SliderRow label="sx (B = scaling along x)" value={sx} min={0.3} max={2.5} step={0.1} onChange={setSx} />
          <div className="order-toggle">
            <button type="button" className={order === 'AB' ? 'active' : ''} onClick={() => setOrder('AB')}>
              A·B (scale then rotate)
            </button>
            <button type="button" className={order === 'BA' ? 'active' : ''} onClick={() => setOrder('BA')}>
              B·A (rotate then scale)
            </button>
          </div>
          <div className="mono-block">
            <div className="muted-label">{order === 'AB' ? 'A·B' : 'B·A'}</div>
            <div className="matrix-grid">
              <span>{fmt(M[0][0])}</span>
              <span>{fmt(M[0][1])}</span>
              <span>{fmt(M[0][2])}</span>
              <span>{fmt(M[1][0])}</span>
              <span>{fmt(M[1][1])}</span>
              <span>{fmt(M[1][2])}</span>
              <span>{fmt(M[2][0])}</span>
              <span>{fmt(M[2][1])}</span>
              <span>{fmt(M[2][2])}</span>
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
