import { useState } from 'react'
import { SliderRow } from '../../components/Controls'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { det3, fmt, linearPart, mul3, scaleMatrix3, shear4 } from '../../lib/math3'
import { createBasis, createUnitCubeWire, SCENE_COLORS } from '../../lib/scene3d'

export function Determinant3D() {
  const [sx, setSx] = useState(1.4)
  const [sy, setSy] = useState(1.1)
  const [sz, setSz] = useState(0.9)
  const [shear, setShear] = useState(0.4)
  const [flip, setFlip] = useState(false)

  const S = scaleMatrix3(sx, flip ? -sy : sy, sz)
  const H = linearPart(shear4(shear, 0, 0, 0, 0, 0))
  const M = mul3(S, H)
  const d = det3(M)
  const mat4 = [
    [M[0][0], M[0][1], M[0][2], 0],
    [M[1][0], M[1][1], M[1][2], 0],
    [M[2][0], M[2][1], M[2][2], 0],
    [0, 0, 0, 1],
  ]
  const color = d >= 0 ? SCENE_COLORS.a : SCENE_COLORS.b

  return (
    <Section id="determinant3d" title="Determinant (3D)">
      <MathParagraph>
        {`For a $3\\times 3$ matrix the determinant is the signed volume of the parallelepiped spanned by its columns. Negative means orientation flipped (a reflection sneaked in).`}
      </MathParagraph>
      <MathText tex={String.raw`\det M = \text{signed volume of basis parallelepiped}`} display />
      <Playground label="Playground: scale, shear, flip Y">
        <Scene3D
          deps={[sx, sy, sz, shear, flip]}
          setup={({ root }) => {
            root.add(createUnitCubeWire(SCENE_COLORS.muted, undefined, true))
            root.add(createUnitCubeWire(color, mat4))
            root.add(createBasis(M, 1.2))
          }}
        />
        <div className="controls-col wide">
          <SliderRow label="sx" value={sx} min={0.3} max={2.5} step={0.1} onChange={setSx} />
          <SliderRow label="sy" value={sy} min={0.3} max={2.5} step={0.1} onChange={setSy} />
          <SliderRow label="sz" value={sz} min={0.3} max={2.5} step={0.1} onChange={setSz} />
          <SliderRow label="shear" value={shear} min={-1.5} max={1.5} step={0.1} onChange={setShear} />
          <label className="check-label">
            <input type="checkbox" checked={flip} onChange={(e) => setFlip(e.target.checked)} />
            flip Y (negate sy)
          </label>
          <div className="mono-stat" style={{ color }}>
            det = {fmt(d)} {d >= 0 ? '(preserving)' : '(flipped)'}
          </div>
        </div>
      </Playground>
    </Section>
  )
}
