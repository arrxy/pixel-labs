import { useCallback, useState } from 'react'
import { SliderRow } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawGrid, polyOutline } from '../lib/canvas'
import { apply2, shearMatrix } from '../lib/math'
import { DEFAULT_COLORS } from '../lib/types'

export function Shear() {
  const [kx, setKx] = useState(0.8)
  const [ky, setKy] = useState(0)

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
      const M = shearMatrix(kx, ky)
      const tsq = sq.map((p) => apply2(M, p))
      polyOutline(ctx, sq, '#c9c6ba', true)
      polyOutline(ctx, tsq, col.a, false)
    },
    [kx, ky],
  )

  return (
    <Section id="shear" title="Shear">
      <MathParagraph>
        {`Shear slides one axis along the other. A horizontal shear ($k_x$) keeps heights fixed and pushes $x$ by an amount proportional to $y$. Vertical shear ($k_y$) does the opposite. Together they form the matrix:`}
      </MathParagraph>
      <MathText
        tex={String.raw`H=\begin{pmatrix}1 & k_x\\k_y & 1\end{pmatrix}\qquad H\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}x+k_xy\\k_yx+y\end{pmatrix}`}
        display
      />
      <MathParagraph>
        Shear is still a linear map (origin stays put) but it is not a pure rotate-or-scale. Reflection is related:
        flipping an axis is just a negative scale, which you already saw in the Scale playground.
      </MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg">
          <rect x="50" y="80" width="50" height="50" fill="none" stroke="#c9c6ba" strokeWidth="2" strokeDasharray="4,3" />
          <polygon points="50,130 100,130 130,80 80,80" fill="none" stroke="#0f6e63" strokeWidth="2.5" />
          <text x="54" y="74" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#6b6b63">
            original
          </text>
          <text x="134" y="78" fontFamily="Source Serif 4, serif" fontSize="12" fill="#0f6e63" fontStyle="italic">
            sheared
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: move the sliders or type kx, ky">
        <VectorCanvas draw={draw} interactive={false} />
        <div className="controls-col wide">
          <SliderRow label="kx (horizontal)" value={kx} min={-2} max={2} step={0.1} onChange={setKx} />
          <SliderRow label="ky (vertical)" value={ky} min={-2} max={2} step={0.1} onChange={setKy} />
        </div>
      </Playground>
    </Section>
  )
}
