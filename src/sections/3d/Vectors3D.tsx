import { useState } from 'react'
import { Playground } from '../../components/Diagram'
import { MathParagraph } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { Vec3Inputs } from '../../components/Vec3Inputs'
import { fmt, mag3 } from '../../lib/math3'
import { createArrow, SCENE_COLORS } from '../../lib/scene3d'
import type { Vec3 } from '../../lib/types'

export function Vectors3D() {
  const [v, setV] = useState<Vec3>({ x: 2, y: 1.5, z: 1 })

  return (
    <Section id="vectors3d" title="What is a vector? (3D)">
      <MathParagraph>
        {`In 3D a vector has three components: $\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}$. Length is still the Euclidean norm: $|v|=\\sqrt{x^2+y^2+z^2}$. Drag the scene to orbit.`}
      </MathParagraph>
      <Playground label="Playground: edit components; drag to orbit">
        <Scene3D
          deps={[v]}
          setup={({ root }) => {
            root.add(createArrow(v, SCENE_COLORS.a))
          }}
        />
        <div className="controls-col">
          <Vec3Inputs value={v} onChange={setV} />
          <div className="mono-stat">|v| = {fmt(mag3(v))}</div>
        </div>
      </Playground>
    </Section>
  )
}
