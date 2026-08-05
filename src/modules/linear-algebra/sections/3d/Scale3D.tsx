import { useState } from 'react'
import { SliderRow } from '../../components/Controls'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { fmt, scale4 } from '../../lib/math3'
import { createUnitCubeWire, SCENE_COLORS } from '../../lib/scene3d'

export function Scale3D() {
  const [sx, setSx] = useState(1.5)
  const [sy, setSy] = useState(1)
  const [sz, setSz] = useState(0.7)
  const M = scale4(sx, sy, sz)

  return (
    <Section id="scale3d" title="Scale (3D)">
      <MathParagraph>
        {`Non-uniform scale stretches each axis independently. The dashed cube is the unit cube; green is after scale.`}
      </MathParagraph>
      <MathText
        tex={String.raw`S=\begin{pmatrix}s_x&0&0\\0&s_y&0\\0&0&s_z\end{pmatrix}`}
        display
      />
      <Playground label="Playground: sx, sy, sz">
        <Scene3D
          deps={[sx, sy, sz]}
          setup={({ root }) => {
            root.add(createUnitCubeWire(SCENE_COLORS.muted, undefined, true))
            root.add(createUnitCubeWire(SCENE_COLORS.a, M))
          }}
        />
        <div className="controls-col wide">
          <SliderRow label="sx" value={sx} min={0.2} max={2.5} step={0.1} onChange={setSx} />
          <SliderRow label="sy" value={sy} min={0.2} max={2.5} step={0.1} onChange={setSy} />
          <SliderRow label="sz" value={sz} min={0.2} max={2.5} step={0.1} onChange={setSz} />
          <div className="mono-block muted">
            volume scale = {fmt(sx * sy * sz)}
          </div>
        </div>
      </Playground>
    </Section>
  )
}
