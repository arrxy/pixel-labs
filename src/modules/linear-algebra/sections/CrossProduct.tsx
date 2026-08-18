import { useCallback, useState } from 'react'
import { NumInput } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, u2p } from '../lib/canvas'
import { cross2d, fmt } from '../lib/math'
import { DEFAULT_COLORS, type Vec2 } from '../lib/types'

export function CrossProduct() {
  const [a, setA] = useState<Vec2>({ x: 3, y: 1 })
  const [b, setB] = useState<Vec2>({ x: 1, y: 3 })
  const crossVal = cross2d(a, b)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const pa = u2p(a.x, a.y)
      const pb = u2p(b.x, b.y)
      const pab = u2p(a.x + b.x, a.y + b.y)
      const po = u2p(0, 0)
      const cross = a.x * b.y - a.y * b.x
      ctx.beginPath()
      ctx.moveTo(po.px, po.py)
      ctx.lineTo(pa.px, pa.py)
      ctx.lineTo(pab.px, pab.py)
      ctx.lineTo(pb.px, pb.py)
      ctx.closePath()
      ctx.fillStyle = cross >= 0 ? 'rgba(15,110,99,0.12)' : 'rgba(217,98,43,0.12)'
      ctx.fill()
      drawArrow(ctx, OX, OY, pa.px, pa.py, col.a, 3)
      drawArrow(ctx, OX, OY, pb.px, pb.py, col.b, 3)
    },
    [a, b],
  )

  return (
    <Section id="cross" title="Cross product" noBorder>
      <MathParagraph>
        The cross product takes two vectors, a and b, and produces a third vector perpendicular to both, following the
        right-hand rule. In 2D we only see its z-component: a signed number equal to the area of the parallelogram the
        two vectors span.
      </MathParagraph>
      <MathText tex={String.raw`a_xb_y-a_yb_x`} display />
      <MathParagraph>A positive value means b is counterclockwise from a; negative means clockwise.</MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg">
          <line x1="10" y1="150" x2="205" y2="150" stroke="#cfccc0" strokeWidth="1.5" />
          <line x1="30" y1="170" x2="30" y2="15" stroke="#cfccc0" strokeWidth="1.5" />
          <polygon points="30,150 90,130 110,70 50,90" fill="rgba(15,110,99,0.12)" />
          <line x1="30" y1="150" x2="90" y2="130" stroke="#0f6e63" strokeWidth="2.5" markerEnd="url(#arrowA)" />
          <line x1="30" y1="150" x2="50" y2="90" stroke="#d9622b" strokeWidth="2.5" markerEnd="url(#arrowB)" />
          <text x="92" y="148" fontFamily="Instrument Serif, serif" fontSize="13" fill="#0f6e63" fontStyle="italic">
            a
          </text>
          <text x="36" y="86" fontFamily="Instrument Serif, serif" fontSize="13" fill="#d9622b" fontStyle="italic">
            b
          </text>
          <text x="66" y="118" fontFamily="Space Mono, monospace" fontSize="11" fill="#0a4f47">
            area
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: drag or type to change a and b">
        <VectorCanvas
          mode="pair"
          a={a}
          b={b}
          onChange={(which, v) => (which === 'a' ? setA(v) : setB(v))}
          draw={draw}
        />
        <div className="controls-col">
          <div className="vec-pair">
            <div className="controls-col">
              <NumInput label="ax" value={a.x} color="var(--accent)" onChange={(x) => setA((s) => ({ ...s, x }))} />
              <NumInput label="ay" value={a.y} color="var(--accent)" onChange={(y) => setA((s) => ({ ...s, y }))} />
            </div>
            <div className="controls-col">
              <NumInput label="bx" value={b.x} color="var(--secondary)" onChange={(x) => setB((s) => ({ ...s, x }))} />
              <NumInput label="by" value={b.y} color="var(--secondary)" onChange={(y) => setB((s) => ({ ...s, y }))} />
            </div>
          </div>
          <div className="mono-block">
            <div>a × b = {fmt(crossVal)}</div>
            <div>{crossVal >= 0 ? 'counterclockwise' : 'clockwise'}</div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
