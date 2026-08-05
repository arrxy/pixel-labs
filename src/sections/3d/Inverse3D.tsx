import { useState } from 'react'
import { SliderRow } from '../../components/Controls'
import { Playground } from '../../components/Diagram'
import { MathParagraph, MathText } from '../../components/MathText'
import { Scene3D } from '../../components/Scene3D'
import { Section } from '../../components/Section'
import {
  applyAffine4,
  clamp,
  computeCompositeM4,
  invertAffine4,
  mul4,
} from '../../lib/math3'
import { createDashedLine, createPoint, createUnitCubeWire, SCENE_COLORS } from '../../lib/scene3d'

export function Inverse3D() {
  const [tx, setTx] = useState(1)
  const [ty, setTy] = useState(0.8)
  const [tz, setTz] = useState(0.5)
  const [rz, setRz] = useState(35)
  const [sx, setSx] = useState(1.4)
  const [sy, setSy] = useState(1.1)
  const [sz, setSz] = useState(0.9)
  const [showInverse, setShowInverse] = useState(true)

  const M = computeCompositeM4(tx, ty, tz, 0, 0, rz, sx, sy, sz)
  const Minv = invertAffine4(M)

  return (
    <Section id="inverse3d" title="Inverse transforms (3D)">
      <MathParagraph>
        {`For $M = SRT$, the inverse reverses the order: $M^{-1}=T^{-1}R^{-1}S^{-1}$. Green is $M$ on the unit cube; orange recovers the original via $M^{-1}$.`}
      </MathParagraph>
      <MathText tex={String.raw`M^{-1}M = I`} display />
      <Playground label="Playground: composite and its inverse">
        <Scene3D
          deps={[tx, ty, tz, rz, sx, sy, sz, showInverse]}
          setup={({ root }) => {
            root.add(createUnitCubeWire(SCENE_COLORS.muted, undefined, true))
            root.add(createUnitCubeWire(SCENE_COLORS.a, M))
            if (showInverse && Minv) {
              const recovered = mul4(Minv, M)
              root.add(createUnitCubeWire(SCENE_COLORS.b, recovered))
              const tip = applyAffine4(M, { x: 1, y: 0.5, z: 0.5 })
              const back = applyAffine4(Minv, tip)
              root.add(createPoint(tip, SCENE_COLORS.a, 0.07))
              root.add(createPoint(back, SCENE_COLORS.b, 0.07))
              root.add(createDashedLine(tip, back, SCENE_COLORS.b))
            }
          }}
        />
        <div className="controls-col wide">
          <SliderRow label="tx" value={tx} min={-3} max={3} step={0.1} onChange={(v) => setTx(clamp(v, 3))} />
          <SliderRow label="ty" value={ty} min={-3} max={3} step={0.1} onChange={(v) => setTy(clamp(v, 3))} />
          <SliderRow label="tz" value={tz} min={-3} max={3} step={0.1} onChange={(v) => setTz(clamp(v, 3))} />
          <SliderRow label="θz" value={rz} min={-180} max={180} step={1} onChange={setRz} />
          <SliderRow label="sx" value={sx} min={0.3} max={2.5} step={0.1} onChange={setSx} />
          <SliderRow label="sy" value={sy} min={0.3} max={2.5} step={0.1} onChange={setSy} />
          <SliderRow label="sz" value={sz} min={0.3} max={2.5} step={0.1} onChange={setSz} />
          <label className="check-label">
            <input type="checkbox" checked={showInverse} onChange={(e) => setShowInverse(e.target.checked)} />
            show M⁻¹ recovery
          </label>
          <div className="mono-block muted">
            {Minv ? <div className="ink">M⁻¹ exists</div> : <div className="secondary">singular</div>}
          </div>
        </div>
      </Playground>
    </Section>
  )
}
