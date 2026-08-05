import { useCallback, useState } from 'react'
import { NumInput } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, u2p } from '../lib/canvas'
import { dot, fmt, mag } from '../lib/math'
import { DEFAULT_COLORS, type Vec2 } from '../lib/types'

export function DotProduct() {
  const [a, setA] = useState<Vec2>({ x: 4, y: 1 })
  const [b, setB] = useState<Vec2>({ x: 2, y: 3 })

  const dotVal = dot(a, b)
  const magA = mag(a)
  const magB = mag(b)
  const cosT = dotVal / ((magA || 1e-6) * (magB || 1e-6))
  const angle = (Math.acos(Math.max(-1, Math.min(1, cosT))) * 180) / Math.PI
  const projD = dotVal / (magB || 1e-6)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const pa = u2p(a.x, a.y)
      const pb = u2p(b.x, b.y)
      const bLen = Math.hypot(b.x, b.y) || 1e-6
      const d = (a.x * b.x + a.y * b.y) / bLen
      const ux = b.x / bLen
      const uy = b.y / bLen
      const pp = u2p(ux * d, uy * d)
      ctx.save()
      ctx.strokeStyle = '#c9c6ba'
      ctx.setLineDash([3, 3])
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pa.px, pa.py)
      ctx.lineTo(pp.px, pp.py)
      ctx.stroke()
      ctx.restore()
      drawArrow(ctx, OX, OY, pp.px, pp.py, '#9b978a', 3)
      drawArrow(ctx, OX, OY, pa.px, pa.py, col.a, 3)
      drawArrow(ctx, OX, OY, pb.px, pb.py, col.b, 3)
    },
    [a, b],
  )

  return (
    <Section id="dot" title="Dot product">
      <MathParagraph>
        The dot product of two vectors gives a scalar. It measures how much one vector points in the direction of another.
      </MathParagraph>
      <MathText tex={String.raw`\mathbf{a}\cdot\mathbf{b}=a_xb_x+a_yb_y`} display />
      <MathParagraph>
        {`It also relates to the angle between the vectors, $\\mathbf{a}\\cdot\\mathbf{b}=|\\mathbf{a}||\\mathbf{b}|\\cos\\theta$, and to the length of the projection of a onto b, $d=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|}$.`}
      </MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg">
          <line x1="10" y1="150" x2="205" y2="150" stroke="#cfccc0" strokeWidth="1.5" />
          <line x1="30" y1="170" x2="30" y2="15" stroke="#cfccc0" strokeWidth="1.5" />
          <line x1="30" y1="150" x2="96" y2="104" stroke="#9b978a" strokeWidth="2.5" markerEnd="url(#arrowInk)" />
          <line x1="96" y1="104" x2="102" y2="132" stroke="#c9c6ba" strokeWidth="1" strokeDasharray="4,3" />
          <line x1="30" y1="150" x2="102" y2="132" stroke="#0f6e63" strokeWidth="2.5" markerEnd="url(#arrowA)" />
          <line x1="30" y1="150" x2="64" y2="98" stroke="#d9622b" strokeWidth="2.5" markerEnd="url(#arrowB)" />
          <text x="106" y="128" fontFamily="Source Serif 4, serif" fontSize="13" fill="#0f6e63" fontStyle="italic">
            a
          </text>
          <text x="66" y="92" fontFamily="Source Serif 4, serif" fontSize="13" fill="#d9622b" fontStyle="italic">
            b
          </text>
          <text x="70" y="112" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#6b6b63">
            d
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: drag or type to change a and b. Gray arrow is a's projection onto b">
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
            <div>a · b = {fmt(dotVal)}</div>
            <div>θ = {fmt(angle)}°</div>
            <div>d = {fmt(projD)}</div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
