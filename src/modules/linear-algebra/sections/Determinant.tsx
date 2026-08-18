import { useCallback, useState } from 'react'
import { SliderRow } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, u2p } from '../lib/canvas'
import { apply2, det2, fmt, scaleMatrix, shearMatrix, mul2 } from '../lib/math'
import { DEFAULT_COLORS } from '../lib/types'

export function Determinant() {
  const [sx, setSx] = useState(1.5)
  const [sy, setSy] = useState(1.2)
  const [kx, setKx] = useState(0.4)

  const S = scaleMatrix(sx, sy)
  const H = shearMatrix(kx, 0)
  const M = mul2(S, H)
  const d = det2(M)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const Sm = scaleMatrix(sx, sy)
      const Hm = shearMatrix(kx, 0)
      const mat = mul2(Sm, Hm)
      const e1 = apply2(mat, { x: 1, y: 0 })
      const e2 = apply2(mat, { x: 0, y: 1 })
      const p1 = u2p(e1.x, e1.y)
      const p2 = u2p(e2.x, e2.y)
      const p12 = u2p(e1.x + e2.x, e1.y + e2.y)
      const po = u2p(0, 0)
      const det = det2(mat)

      ctx.beginPath()
      ctx.moveTo(po.px, po.py)
      ctx.lineTo(p1.px, p1.py)
      ctx.lineTo(p12.px, p12.py)
      ctx.lineTo(p2.px, p2.py)
      ctx.closePath()
      ctx.fillStyle = det >= 0 ? 'rgba(15,110,99,0.15)' : 'rgba(217,98,43,0.18)'
      ctx.fill()
      ctx.strokeStyle = det >= 0 ? col.a : col.b
      ctx.lineWidth = 1.5
      ctx.stroke()

      // unit square reference
      const u1 = u2p(1, 0)
      const u2 = u2p(0, 1)
      const u12 = u2p(1, 1)
      ctx.save()
      ctx.setLineDash([3, 3])
      ctx.strokeStyle = '#c9c6ba'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(po.px, po.py)
      ctx.lineTo(u1.px, u1.py)
      ctx.lineTo(u12.px, u12.py)
      ctx.lineTo(u2.px, u2.py)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      drawArrow(ctx, OX, OY, p1.px, p1.py, col.a, 3)
      drawArrow(ctx, OX, OY, p2.px, p2.py, col.b, 3)
    },
    [sx, sy, kx],
  )

  return (
    <Section id="determinant" title="Determinant">
      <MathParagraph>
        {`The determinant of a 2×2 matrix is the signed area of the parallelogram formed by its columns. If $M=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$, then:`}
      </MathParagraph>
      <MathText tex={String.raw`\det M=ad-bc`} display />
      <MathParagraph>
        {`A positive value means orientation is preserved (a counterclockwise basis stays counterclockwise). A negative value means the shape is flipped by a reflection. The absolute value tells us how much the matrix scales area. Zero means the matrix collapses space onto a line.`}
      </MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg">
          <polygon points="40,140 120,140 150,70 70,70" fill="rgba(15,110,99,0.12)" stroke="#0f6e63" strokeWidth="2" />
          <line x1="40" y1="140" x2="120" y2="140" stroke="#0f6e63" strokeWidth="2.5" markerEnd="url(#arrowA)" />
          <line x1="40" y1="140" x2="70" y2="70" stroke="#d9622b" strokeWidth="2.5" markerEnd="url(#arrowB)" />
          <text x="100" y="100" fontFamily="Space Mono, monospace" fontSize="12" fill="#4a4841">
            area = det
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: try negative sx to flip orientation. Fill turns orange when det < 0">
        <VectorCanvas draw={draw} interactive={false} />
        <div className="controls-col wide">
          <SliderRow label="sx" value={sx} min={-2.5} max={2.5} step={0.1} onChange={setSx} />
          <SliderRow label="sy" value={sy} min={-2.5} max={2.5} step={0.1} onChange={setSy} />
          <SliderRow label="kx (shear)" value={kx} min={-1.5} max={1.5} step={0.1} onChange={setKx} />
          <div className="mono-block">
            <div>
              det M = <span className={d < 0 ? 'secondary' : 'ink'}>{fmt(d)}</span>
            </div>
            <div className="muted-label">
              {d > 0 ? 'orientation preserved' : d < 0 ? 'orientation flipped' : 'degenerate (collapsed)'}
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
