import { useState } from 'react'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { Vec3Inputs } from '../../components/Vec3Inputs'
import { fmt, mag3, normalize3 } from '../../lib/math3'
import { createArrow, createSphereWire, SCENE_COLORS } from '../../lib/scene3d'
import type { Vec3 } from '../../lib/types'

export function Normalize3D() {
  const [v, setV] = useState<Vec3>({ x: 3, y: 1, z: 2 })
  const u = normalize3(v)

  return (
    <Section id="normalize3d" title="Unit vectors (3D)">
      <MathParagraph>
        {`Divide by length to get a unit vector on the sphere of radius 1. Same idea as 2D, now in space.`}
      </MathParagraph>
      <MathText tex={String.raw`\hat{v}=\frac{v}{|v|}`} display />
      <Playground label="Playground: green = v, orange = unit vector">
        <Scene3D
          deps={[v]}
          setup={({ root }) => {
            root.add(createSphereWire(1, SCENE_COLORS.muted))
            root.add(createArrow(v, SCENE_COLORS.a))
            root.add(createArrow(u, SCENE_COLORS.b))
          }}
        />
        <div className="controls-col">
          <Vec3Inputs value={v} onChange={setV} />
          <div className="mono-block muted">
            <div>|v| = {fmt(mag3(v))}</div>
            <div className="ink">
              û = ({fmt(u.x)}, {fmt(u.y)}, {fmt(u.z)})
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
