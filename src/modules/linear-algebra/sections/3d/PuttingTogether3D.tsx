import { useState } from 'react'
import { SliderRow } from '../../components/Controls'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import { applyAffine4, clamp, computeCompositeM4, fmt } from '../../lib/math3'
import { createPoint, createUnitCubeWire, SCENE_COLORS } from '../../lib/scene3d'

export function PuttingTogether3D() {
  const [tx, setTx] = useState(1.2)
  const [ty, setTy] = useState(0.8)
  const [tz, setTz] = useState(0.4)
  const [rx, setRx] = useState(15)
  const [ry, setRy] = useState(25)
  const [rz, setRz] = useState(10)
  const [sx, setSx] = useState(1.4)
  const [sy, setSy] = useState(1.1)
  const [sz, setSz] = useState(0.9)

  const M = computeCompositeM4(tx, ty, tz, rx, ry, rz, sx, sy, sz)
  const p = { x: 1, y: 1, z: 1 }
  const tp = applyAffine4(M, p)

  return (
    <Section id="together3d" title="Putting it together (3D)" noBorder>
      <MathParagraph>
        {`Compose scaling, rotation, and translation into one $4\\times 4$ matrix $M = SRT$. The dashed cube is in local space; the green cube shows the result after applying $M$.`}
      </MathParagraph>
      <MathText tex={String.raw`M = S\,R\,T`} display />
      <Playground label="Playground: full affine stack">
        <Scene3D
          width={340}
          height={300}
          deps={[tx, ty, tz, rx, ry, rz, sx, sy, sz]}
          setup={({ root }) => {
            root.add(createUnitCubeWire(SCENE_COLORS.muted, undefined, true))
            root.add(createUnitCubeWire(SCENE_COLORS.a, M))
            root.add(createPoint(p, '#9b978a'))
            root.add(createPoint(tp, SCENE_COLORS.b))
          }}
        />
        <div className="controls-col wide">
          <SliderRow label="tx" value={tx} min={-3} max={3} step={0.1} onChange={(v) => setTx(clamp(v, 3))} />
          <SliderRow label="ty" value={ty} min={-3} max={3} step={0.1} onChange={(v) => setTy(clamp(v, 3))} />
          <SliderRow label="tz" value={tz} min={-3} max={3} step={0.1} onChange={(v) => setTz(clamp(v, 3))} />
          <SliderRow label="θx" value={rx} min={-180} max={180} step={1} onChange={setRx} />
          <SliderRow label="θy" value={ry} min={-180} max={180} step={1} onChange={setRy} />
          <SliderRow label="θz" value={rz} min={-180} max={180} step={1} onChange={setRz} />
          <SliderRow label="sx" value={sx} min={0.3} max={2.5} step={0.1} onChange={setSx} />
          <SliderRow label="sy" value={sy} min={0.3} max={2.5} step={0.1} onChange={setSy} />
          <SliderRow label="sz" value={sz} min={0.3} max={2.5} step={0.1} onChange={setSz} />
        </div>
      </Playground>
      <div className="matrix-readout">
        <div className="mono-block">
          <div className="muted-label">M (4×4)</div>
          <div className="matrix-grid four">
            {M.flat().map((n, i) => (
              <span key={i}>{fmt(n)}</span>
            ))}
          </div>
        </div>
        <div className="mono-block muted vertex-result">
          vertex (1, 1, 1) → <span className="secondary">({fmt(tp.x)}, {fmt(tp.y)}, {fmt(tp.z)})</span>
        </div>
      </div>
    </Section>
  )
}
