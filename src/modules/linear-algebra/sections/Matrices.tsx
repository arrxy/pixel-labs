import { useCallback, useState } from 'react'
import { SliderRow } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, polyOutline, u2p } from '../lib/canvas'
import { apply2, fmt, mul2, rotationMatrix, scaleMatrix } from '../lib/math'
import { DEFAULT_COLORS } from '../lib/types'

type Order = 'AB' | 'BA'

export function Matrices() {
  const [theta, setTheta] = useState(40)
  const [sx, setSx] = useState(1.6)
  const [order, setOrder] = useState<Order>('AB')

  const R = rotationMatrix((theta * Math.PI) / 180)
  const S = scaleMatrix(sx, 1)
  const AB = mul2(R, S)
  const BA = mul2(S, R)
  const M = order === 'AB' ? AB : BA

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const sq = [
        { x: 0, y: 0 },
        { x: 2.5, y: 0 },
        { x: 2.5, y: 1.5 },
        { x: 0, y: 1.5 },
      ]
      const Rm = rotationMatrix((theta * Math.PI) / 180)
      const Sm = scaleMatrix(sx, 1)
      const composed = order === 'AB' ? mul2(Rm, Sm) : mul2(Sm, Rm)
      const tsq = sq.map((p) => apply2(composed, p))
      polyOutline(ctx, sq, '#c9c6ba', true)
      polyOutline(ctx, tsq, col.a, false)

      const e1 = apply2(composed, { x: 1, y: 0 })
      const e2 = apply2(composed, { x: 0, y: 1 })
      const p1 = u2p(e1.x * 1.2, e1.y * 1.2)
      const p2 = u2p(e2.x * 1.2, e2.y * 1.2)
      drawArrow(ctx, OX, OY, p1.px, p1.py, col.b, 2)
      drawArrow(ctx, OX, OY, p2.px, p2.py, '#9b978a', 2)
    },
    [theta, sx, order],
  )

  return (
    <Section id="matrix" title="Matrices" borderedTop>
      <MathParagraph>
        {`A matrix is an array of numbers with rules for multiplying vectors and other matrices. In graphics, each column is where a basis vector lands: the first column is the image of $(1,0)$, the second of $(0,1)$.`}
      </MathParagraph>
      <MathParagraph>
        {`Matrix multiplication composes transforms. Order matters: $AB$ means “apply $B$ first, then $A$” (right to left). In general $AB\\neq BA$.`}
      </MathParagraph>
      <MathText
        tex={String.raw`AB=\begin{pmatrix}a&b\\c&d\end{pmatrix}\begin{pmatrix}e&f\\g&h\end{pmatrix}=\begin{pmatrix}ae+bg&af+bh\\ce+dg&cf+dh\end{pmatrix}`}
        display
      />
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg">
          <rect x="30" y="100" width="40" height="30" fill="none" stroke="#c9c6ba" strokeWidth="2" strokeDasharray="4,3" />
          <polygon points="30,130 90,130 78,85 18,85" fill="none" stroke="#0f6e63" strokeWidth="2.5" />
          <text x="100" y="100" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#6b6b63">
            AB ≠ BA
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: A = rotation, B = scale in x. Toggle order">
        <VectorCanvas draw={draw} interactive={false} />
        <div className="controls-col wide">
          <SliderRow label="θ (A = rotation)" value={theta} min={-180} max={180} step={1} onChange={setTheta} />
          <SliderRow label="sx (B = scale x)" value={sx} min={0.3} max={2.5} step={0.1} onChange={setSx} />
          <div className="order-toggle">
            <button type="button" className={order === 'AB' ? 'active' : ''} onClick={() => setOrder('AB')}>
              A·B (scale then rotate)
            </button>
            <button type="button" className={order === 'BA' ? 'active' : ''} onClick={() => setOrder('BA')}>
              B·A (rotate then scale)
            </button>
          </div>
          <div className="mono-block">
            <div className="muted-label">{order === 'AB' ? 'A·B' : 'B·A'}</div>
            <div className="matrix-grid two">
              <span>{fmt(M[0][0])}</span>
              <span>{fmt(M[0][1])}</span>
              <span>{fmt(M[1][0])}</span>
              <span>{fmt(M[1][1])}</span>
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
