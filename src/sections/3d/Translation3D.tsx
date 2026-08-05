import { useState } from 'react'
import { SliderRow } from '../../components/Controls'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { clamp, fmt, translate4 } from '../../lib/math3'
import { createPoint, createUnitCubeWire, SCENE_COLORS } from '../../lib/scene3d'

export function Translation3D() {
  const [tx, setTx] = useState(1.5)
  const [ty, setTy] = useState(1)
  const [tz, setTz] = useState(0.5)
  const M = translate4(tx, ty, tz)
  const p = { x: 0.5, y: 0.5, z: 0.5 }
  const q = { x: p.x + tx, y: p.y + ty, z: p.z + tz }

  return (
    <Section id="translation3d" title="Translation (3D)">
      <MathParagraph>
        {`Translation offsets every point by $(t_x,t_y,t_z)$. A linear $3\\times 3$ matrix cannot do this — you need an extra homogeneous coordinate, just as in 2D.`}
      </MathParagraph>
      <MathText
        tex={String.raw`p' = p + t = \begin{pmatrix}x+t_x\\y+t_y\\z+t_z\end{pmatrix}`}
        display
      />
      <Playground label="Playground: move the cube">
        <Scene3D
          deps={[tx, ty, tz]}
          setup={({ root }) => {
            root.add(createUnitCubeWire(SCENE_COLORS.muted, undefined, true))
            root.add(createUnitCubeWire(SCENE_COLORS.a, M))
            root.add(createPoint(p, '#9b978a'))
            root.add(createPoint(q, SCENE_COLORS.b))
          }}
        />
        <div className="controls-col wide">
          <SliderRow label="tx" value={tx} min={-3} max={3} step={0.1} onChange={(v) => setTx(clamp(v, 3))} />
          <SliderRow label="ty" value={ty} min={-3} max={3} step={0.1} onChange={(v) => setTy(clamp(v, 3))} />
          <SliderRow label="tz" value={tz} min={-3} max={3} step={0.1} onChange={(v) => setTz(clamp(v, 3))} />
          <div className="mono-block muted">
            <div>
              p = (0.50, 0.50, 0.50)
            </div>
            <div className="ink">
              p′ = ({fmt(q.x)}, {fmt(q.y)}, {fmt(q.z)})
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
