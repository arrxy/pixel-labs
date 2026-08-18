import { useCallback, useState } from 'react'
import { NumInput } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, u2p } from '../lib/canvas'
import { fmt, mag, normalize } from '../lib/math'
import { DEFAULT_COLORS, type Vec2 } from '../lib/types'

export function Normalize() {
  const [v, setV] = useState<Vec2>({ x: 4, y: 3 })
  const len = mag(v)
  const u = normalize(v)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const pv = u2p(v.x, v.y)
      const unit = normalize(v)
      const pu = u2p(unit.x, unit.y)
      drawArrow(ctx, OX, OY, pv.px, pv.py, '#c9c6ba', 2, true)
      if (mag(v) > 1e-6) {
        drawArrow(ctx, OX, OY, pu.px, pu.py, col.a, 3)
        ctx.beginPath()
        ctx.arc(OX, OY, 26, 0, Math.PI * 2)
        ctx.strokeStyle = '#c9c6ba'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.stroke()
        ctx.setLineDash([])
      }
    },
    [v],
  )

  return (
    <Section id="normalize" title="Unit vectors & normalization">
      <MathParagraph>
        {`Often you care about direction, not length. Dividing a vector by its magnitude produces a unit vector of length 1 in the same direction:`}
      </MathParagraph>
      <MathText tex={String.raw`\hat{\mathbf{v}}=\dfrac{\mathbf{v}}{|\mathbf{v}|}`} display />
      <MathParagraph>
        {`Unit vectors show up everywhere in graphics: surface normals, light directions, camera axes, and ray directions. The dashed circle below has radius 1; the solid arrow always lands on it.`}
      </MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg" role="img" aria-label="Vector v and its normalized unit vector">
          <circle cx="110" cy="100" r="40" fill="none" stroke="#c9c6ba" strokeWidth="1.5" strokeDasharray="4,3" />
          <line
            x1="110"
            y1="100"
            x2="170"
            y2="55"
            stroke="#c9c6ba"
            strokeWidth="2"
            strokeDasharray="4,3"
            markerEnd="url(#arrowInk)"
          />
          <line x1="110" y1="100" x2="142" y2="76" stroke="#0f6e63" strokeWidth="2.5" markerEnd="url(#arrowA)" />
          <text x="156" y="52" fontFamily="Instrument Serif, serif" fontSize="13" fill="#6b6b63" fontStyle="italic">
            v
          </text>
          <text x="146" y="72" fontFamily="Instrument Serif, serif" fontSize="13" fill="#0f6e63" fontStyle="italic">
            v̂
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: drag or type to change v. Solid arrow is the unit vector">
        <VectorCanvas mode="single" value={v} onChange={setV} draw={draw} />
        <div className="controls-col">
          <NumInput label="x" value={v.x} onChange={(x) => setV((s) => ({ ...s, x }))} />
          <NumInput label="y" value={v.y} onChange={(y) => setV((s) => ({ ...s, y }))} />
          <div className="mono-block">
            <div>|v| = {fmt(len)}</div>
            <div className="ink">
              <MathText tex={String.raw`\hat{v}`} /> = ({fmt(u.x)}, {fmt(u.y)})
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
