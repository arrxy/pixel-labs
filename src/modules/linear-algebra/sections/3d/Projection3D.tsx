import { useState } from 'react'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { Vec3Inputs } from '../../components/Vec3Inputs'
import { fmt, project3, reject3 } from '../../lib/math3'
import { createArrow, createDashedLine, SCENE_COLORS } from '../../lib/scene3d'
import type { Vec3 } from '../../lib/types'

export function Projection3D() {
  const [a, setA] = useState<Vec3>({ x: 2, y: 1.5, z: 1 })
  const [b, setB] = useState<Vec3>({ x: 3, y: 0.5, z: 0 })
  const p = project3(a, b)
  const r = reject3(a, b)

  return (
    <Section id="projection3d" title="Projection (3D)">
      <MathParagraph>
        {`The orthogonal projection of $a$ onto $b$ is the shadow of $a$ on the line spanned by $b$. The rejection is the perpendicular remainder: $a = \\mathrm{proj}_b a + \\mathrm{rej}_b a$.`}
      </MathParagraph>
      <MathText
        tex={String.raw`\mathrm{proj}_b a=\frac{a\cdot b}{b\cdot b}\,b\qquad \mathrm{rej}_b a=a-\mathrm{proj}_b a`}
        display
      />
      <Playground label="Playground: gray = projection, dashed = rejection">
        <Scene3D
          deps={[a, b]}
          setup={({ root }) => {
            root.add(createArrow(a, SCENE_COLORS.a))
            root.add(createArrow(b, SCENE_COLORS.b))
            root.add(createArrow(p, SCENE_COLORS.muted))
            root.add(createDashedLine({ x: 0, y: 0, z: 0 }, r, '#9b978a'))
            root.add(createArrow(r, '#9b978a', { from: p }))
          }}
        />
        <div className="controls-col">
          <div className="vec-pair">
            <Vec3Inputs value={a} onChange={setA} prefix="a" color="var(--accent)" />
            <Vec3Inputs value={b} onChange={setB} prefix="b" color="var(--secondary)" />
          </div>
          <div className="mono-block muted">
            <div>
              proj = ({fmt(p.x)}, {fmt(p.y)}, {fmt(p.z)})
            </div>
            <div>
              rej = ({fmt(r.x)}, {fmt(r.y)}, {fmt(r.z)})
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
