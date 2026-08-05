import { useCallback, useState } from 'react'
import { SliderRow } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawGrid, u2p } from '../lib/canvas'
import { DEFAULT_COLORS } from '../lib/types'

export function Translation() {
  const [tx, setTx] = useState(1)
  const [ty, setTy] = useState(1)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const a = { x: 1, y: 2 }
      const ta = { x: 1 + tx, y: 2 + ty }
      const p0 = u2p(a.x, a.y)
      const p1 = u2p(ta.x, ta.y)
      ctx.save()
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = '#c9c6ba'
      ctx.beginPath()
      ctx.moveTo(p0.px, p0.py)
      ctx.lineTo(p1.px, p1.py)
      ctx.stroke()
      ctx.restore()
      ctx.beginPath()
      ctx.arc(p0.px, p0.py, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#9b978a'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(p1.px, p1.py, 4, 0, Math.PI * 2)
      ctx.fillStyle = col.a
      ctx.fill()
    },
    [tx, ty],
  )

  return (
    <Section id="translation" title="Translation">
      <MathParagraph>
        {`Translation shifts every point by a fixed offset: $\\mathbf{a}=\\begin{pmatrix}1\\\\2\\end{pmatrix}$ translated by $\\begin{pmatrix}1\\\\1\\end{pmatrix}$ lands at $\\begin{pmatrix}2\\\\3\\end{pmatrix}$.`}
      </MathParagraph>
      <MathParagraph>
        {`Unlike rotation and scale, translation can't be written as a matrix multiplied by a 2D vector: there's no matrix M where $M\\begin{pmatrix}x\\\\y\\end{pmatrix}$ produces $\\begin{pmatrix}x+t_x\\\\y+t_y\\end{pmatrix}$ for every x, y. That's what homogeneous coordinates fix.`}
      </MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg">
          <line
            x1="60"
            y1="90"
            x2="90"
            y2="60"
            stroke="#c9c6ba"
            strokeWidth="2"
            strokeDasharray="4,3"
            markerEnd="url(#arrowInk)"
          />
          <circle cx="60" cy="90" r="4" fill="#9b978a" />
          <circle cx="90" cy="60" r="4" fill="#0f6e63" />
          <text x="38" y="104" fontFamily="Source Serif 4, serif" fontSize="12" fill="#6b6b63" fontStyle="italic">
            a = (1,2)
          </text>
          <text x="94" y="54" fontFamily="Source Serif 4, serif" fontSize="12" fill="#0f6e63" fontStyle="italic">
            a+t = (2,3)
          </text>
          <text x="66" y="70" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#6b6b63">
            t
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: move the sliders or type tx, ty">
        <VectorCanvas draw={draw} interactive={false} />
        <div className="controls-col wide">
          <SliderRow label="tx" value={tx} min={-5} max={5} step={0.5} onChange={setTx} />
          <SliderRow label="ty" value={ty} min={-5} max={5} step={0.5} onChange={setTy} />
        </div>
      </Playground>
    </Section>
  )
}
