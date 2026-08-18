import { useState } from 'react'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { Vec3Inputs } from '../../components/Vec3Inputs'
import { dot3, fmt, mag3, project3 } from '../../lib/math3'
import { createArrow, createDashedLine, SCENE_COLORS } from '../../lib/scene3d'
import type { Vec3 } from '../../lib/types'

export function DotProduct3D() {
  const [a, setA] = useState<Vec3>({ x: 2, y: 1, z: 0.5 })
  const [b, setB] = useState<Vec3>({ x: 1, y: 2, z: 0.5 })
  const d = dot3(a, b)
  const ma = mag3(a)
  const mb = mag3(b)
  const angle =
    ma > 1e-9 && mb > 1e-9 ? (Math.acos(Math.min(1, Math.max(-1, d / (ma * mb)))) * 180) / Math.PI : 0
  const p = project3(a, b)

  return (
    <Section id="dot3d" title="Dot product (3D)">
      <MathParagraph>
        {`The formula is the same as in 2D: $a\\cdot b = |a||b|\\cos\\theta = a_xb_x+a_yb_y+a_zb_z$. The gray segment is the projection of $a$ onto $b$.`}
      </MathParagraph>
      <MathText tex={String.raw`a\cdot b=a_xb_x+a_yb_y+a_zb_z`} display />
      <Playground label="Playground: edit a and b">
        <Scene3D
          deps={[a, b]}
          setup={({ root }) => {
            root.add(createArrow(a, SCENE_COLORS.a))
            root.add(createArrow(b, SCENE_COLORS.b))
            root.add(createArrow(p, SCENE_COLORS.muted))
            root.add(createDashedLine(a, p, SCENE_COLORS.muted))
          }}
        />
        <div className="controls-col">
          <div className="vec-pair">
            <Vec3Inputs value={a} onChange={setA} prefix="a" color="var(--accent)" />
            <Vec3Inputs value={b} onChange={setB} prefix="b" color="var(--secondary)" />
          </div>
          <div className="mono-block muted">
            <div className="ink">a · b = {fmt(d)}</div>
            <div>θ ≈ {fmt(angle)}°</div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
