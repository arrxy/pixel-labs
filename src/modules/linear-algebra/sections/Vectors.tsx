import { useCallback, useState } from 'react'
import { Diagram, Playground } from '../components/Diagram'
import { NumInput } from '../components/Controls'
import { MathParagraph } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, u2p } from '../lib/canvas'
import { fmt, mag } from '../lib/math'
import { DEFAULT_COLORS, type Vec2 } from '../lib/types'

export function Vectors() {
  const [v, setV] = useState<Vec2>({ x: 4, y: 3 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const p = u2p(v.x, v.y)
      drawArrow(ctx, OX, OY, p.px, p.py, col.a, 3)
    },
    [v],
  )

  return (
    <Section id="vectors" title="What is a vector?">
      <MathParagraph>
        {`A vector describes a length and a direction. In a 2D coordinate plane with an x-axis and a y-axis, the vector $\\begin{pmatrix}4\\\\3\\end{pmatrix}$ means 4 units in the x direction and 3 units in the y direction.`}
      </MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg" role="img" aria-label="Vector from the origin to point v on a coordinate grid">
          <line x1="10" y1="150" x2="205" y2="150" stroke="#cfccc0" strokeWidth="1.5" />
          <line x1="30" y1="170" x2="30" y2="15" stroke="#cfccc0" strokeWidth="1.5" />
          <line x1="30" y1="90" x2="110" y2="90" stroke="#c9c6ba" strokeWidth="1" strokeDasharray="4,3" />
          <line x1="110" y1="90" x2="110" y2="150" stroke="#c9c6ba" strokeWidth="1" strokeDasharray="4,3" />
          <line x1="30" y1="150" x2="106" y2="91" stroke="#0f6e63" strokeWidth="2.5" markerEnd="url(#arrowA)" />
          <text x="63" y="145" fontFamily="Space Mono, monospace" fontSize="12" fill="#4a4841">
            4
          </text>
          <text x="115" y="122" fontFamily="Space Mono, monospace" fontSize="12" fill="#4a4841">
            3
          </text>
          <text x="95" y="78" fontFamily="Instrument Serif, serif" fontSize="14" fill="#0f6e63" fontStyle="italic">
            v
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: drag or type to change the vector">
        <VectorCanvas mode="single" value={v} onChange={setV} draw={draw} />
        <div className="controls-col">
          <NumInput label="x" value={v.x} onChange={(x) => setV((s) => ({ ...s, x }))} />
          <NumInput label="y" value={v.y} onChange={(y) => setV((s) => ({ ...s, y }))} />
          <div className="mono-stat">|v| = {fmt(mag(v))}</div>
        </div>
      </Playground>
    </Section>
  )
}
