import { useState } from 'react'
import { SliderRow } from '../../components/Controls'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { fmt, shear4 } from '../../lib/math3'
import { createUnitCubeWire, SCENE_COLORS } from '../../lib/scene3d'

export function Shear3D() {
  const [kxy, setKxy] = useState(0.8)
  const [kxz, setKxz] = useState(0)
  const M = shear4(kxy, kxz, 0, 0, 0, 0)

  return (
    <Section id="shear3d" title="Shear (3D)">
      <MathParagraph>
        {`Shear changes one coordinate by an amount proportional to another. Here $x' = x + k_{xy} y + k_{xz} z$ while $y$ and $z$ stay fixed, producing a slanted box.`}
      </MathParagraph>
      <MathText
        tex={String.raw`H=\begin{pmatrix}1&k_{xy}&k_{xz}\\0&1&0\\0&0&1\end{pmatrix}`}
        display
      />
      <Playground label="Playground: shear factors">
        <Scene3D
          deps={[kxy, kxz]}
          setup={({ root }) => {
            root.add(createUnitCubeWire(SCENE_COLORS.muted, undefined, true))
            root.add(createUnitCubeWire(SCENE_COLORS.a, M))
          }}
        />
        <div className="controls-col wide">
          <SliderRow label="kxy" value={kxy} min={-1.5} max={1.5} step={0.1} onChange={setKxy} />
          <SliderRow label="kxz" value={kxz} min={-1.5} max={1.5} step={0.1} onChange={setKxz} />
          <div className="mono-block muted">
            kxy = {fmt(kxy)}, kxz = {fmt(kxz)}
          </div>
        </div>
      </Playground>
    </Section>
  )
}
