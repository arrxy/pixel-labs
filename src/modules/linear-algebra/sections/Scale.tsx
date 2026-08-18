import { useCallback, useState } from 'react'
import { SliderRow } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawGrid, polyOutline } from '../lib/canvas'
import { DEFAULT_COLORS } from '../lib/types'

export function Scale() {
  const [sx, setSx] = useState(3)
  const [sy, setSy] = useState(0.5)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const sq = [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
        { x: 3, y: 2 },
        { x: 0, y: 2 },
      ]
      const tsq = sq.map((p) => ({ x: p.x * sx, y: p.y * sy }))
      polyOutline(ctx, sq, '#c9c6ba', true)
      polyOutline(ctx, tsq, col.a, false)
    },
    [sx, sy],
  )

  return (
    <Section id="scale" title="Scale">
      <MathParagraph>
        {`Scaling works the same way. To stretch x by 3 and shrink y to half, the new x-axis unit vector becomes $\\begin{pmatrix}3\\\\0\\end{pmatrix}$ and the new y-axis unit vector becomes $\\begin{pmatrix}0\\\\0.5\\end{pmatrix}$:`}
      </MathParagraph>
      <MathText
        tex={String.raw`S=\begin{pmatrix}s_x & 0\\0 & s_y\end{pmatrix}\qquad S\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}s_x\cdot x\\s_y\cdot y\end{pmatrix}`}
        display
      />
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg" role="img" aria-label="Original and scaled rectangle on a coordinate grid">
          <rect x="30" y="110" width="40" height="40" fill="none" stroke="#c9c6ba" strokeWidth="2" strokeDasharray="4,3" />
          <rect x="30" y="130" width="120" height="20" fill="none" stroke="#0f6e63" strokeWidth="2.5" />
          <text x="36" y="104" fontFamily="Space Mono, monospace" fontSize="11" fill="#6b6b63">
            unit square
          </text>
          <text x="156" y="144" fontFamily="Instrument Serif, serif" fontSize="12" fill="#0f6e63" fontStyle="italic">
            scaled
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: move the sliders or type sx, sy">
        <VectorCanvas draw={draw} interactive={false} />
        <div className="controls-col wide">
          <SliderRow label="sx" value={sx} min={-3} max={3} step={0.1} onChange={setSx} />
          <SliderRow label="sy" value={sy} min={-3} max={3} step={0.1} onChange={setSy} />
        </div>
      </Playground>
    </Section>
  )
}
