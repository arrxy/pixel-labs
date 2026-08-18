import { useState } from 'react'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { Vec3Inputs } from '../../components/Vec3Inputs'
import { cross3, fmt, mag3 } from '../../lib/math3'
import { createArrow, createParallelogram, SCENE_COLORS } from '../../lib/scene3d'
import type { Vec3 } from '../../lib/types'

export function CrossProduct3D() {
  const [a, setA] = useState<Vec3>({ x: 2, y: 0.5, z: 0 })
  const [b, setB] = useState<Vec3>({ x: 0.5, y: 2, z: 0.5 })
  const c = cross3(a, b)
  const area = mag3(c)

  return (
    <Section id="cross3d" title="Cross product (3D)" noBorder>
      <MathParagraph>
        {`In 3D the cross product is a real vector: $a\\times b$ is perpendicular to both $a$ and $b$, with length equal to the parallelogram area and direction given by the right-hand rule.`}
      </MathParagraph>
      <MathText
        tex={String.raw`a\times b=\begin{pmatrix}a_yb_z-a_zb_y\\a_zb_x-a_xb_z\\a_xb_y-a_yb_x\end{pmatrix}`}
        display
      />
      <Playground label="Playground: purple arrow = a × b">
        <Scene3D
          deps={[a, b]}
          setup={({ root }) => {
            root.add(createParallelogram(a, b, SCENE_COLORS.a, 0.2))
            root.add(createArrow(a, SCENE_COLORS.a))
            root.add(createArrow(b, SCENE_COLORS.b))
            root.add(createArrow(c, '#6b5b95'))
          }}
        />
        <div className="controls-col">
          <div className="vec-pair">
            <Vec3Inputs value={a} onChange={setA} prefix="a" color="var(--accent)" />
            <Vec3Inputs value={b} onChange={setB} prefix="b" color="var(--secondary)" />
          </div>
          <div className="mono-block muted">
            <div className="ink">
              a × b = ({fmt(c.x)}, {fmt(c.y)}, {fmt(c.z)})
            </div>
            <div>|a × b| = {fmt(area)} (area)</div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
