import { useCallback, useState } from 'react'
import { SliderRow } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, u2p } from '../lib/canvas'
import { fmt, rotate } from '../lib/math'
import { DEFAULT_COLORS } from '../lib/types'

export function Rotation() {
  const [theta, setTheta] = useState(30)
  const thr = (theta * Math.PI) / 180
  const cosv = Math.cos(thr)
  const sinv = Math.sin(thr)
  const v = { x: 4, y: 2 }
  const rv = rotate(v, thr)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const th = (theta * Math.PI) / 180
      const src = { x: 4, y: 2 }
      const rotated = rotate(src, th)
      const p0 = u2p(src.x, src.y)
      const p1 = u2p(rotated.x, rotated.y)
      drawArrow(ctx, OX, OY, p0.px, p0.py, '#c9c6ba', 2, true)
      drawArrow(ctx, OX, OY, p1.px, p1.py, col.a, 3)
    },
    [theta],
  )

  return (
    <Section id="rotation" title="Rotation">
      <MathParagraph>
        {`To rotate a vector by θ, picture rotating the basis vectors and watching where they land. The x-axis unit vector $\\begin{pmatrix}1\\\\0\\end{pmatrix}$ becomes $\\begin{pmatrix}\\cos\\theta\\\\\\sin\\theta\\end{pmatrix}$, and the y-axis unit vector $\\begin{pmatrix}0\\\\1\\end{pmatrix}$ becomes $\\begin{pmatrix}-\\sin\\theta\\\\\\cos\\theta\\end{pmatrix}$. Those two new columns are the rotation matrix:`}
      </MathParagraph>
      <MathText
        tex={String.raw`R(\theta)=\begin{pmatrix}\cos\theta & -\sin\theta\\\sin\theta & \cos\theta\end{pmatrix}`}
        display
      />
      <MathParagraph>
        The first column is where the new x-axis points; the second is where the new y-axis points. Multiplying a vector
        by R gives the rotated vector:
      </MathParagraph>
      <MathText
        tex={String.raw`R(\theta)\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}\cos\theta\cdot x-\sin\theta\cdot y\\\sin\theta\cdot x+\cos\theta\cdot y\end{pmatrix}`}
        display
      />
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg" role="img" aria-label="Original vector and its rotation on a coordinate grid">
          <line x1="110" y1="90" x2="160" y2="90" stroke="#c9c6ba" strokeWidth="2" strokeDasharray="4,3" />
          <line x1="110" y1="90" x2="110" y2="40" stroke="#c9c6ba" strokeWidth="2" strokeDasharray="4,3" />
          <line x1="110" y1="90" x2="153" y2="65" stroke="#0f6e63" strokeWidth="2.5" markerEnd="url(#arrowA)" />
          <line x1="110" y1="90" x2="85" y2="47" stroke="#d9622b" strokeWidth="2.5" markerEnd="url(#arrowB)" />
          <path d="M 140 90 A 30 30 0 0 0 132 74" fill="none" stroke="#6b6b63" strokeWidth="1" />
          <text x="140" y="78" fontFamily="Space Mono, monospace" fontSize="11" fill="#6b6b63">
            θ
          </text>
          <text x="156" y="62" fontFamily="Instrument Serif, serif" fontSize="12" fill="#0f6e63" fontStyle="italic">
            x&apos;
          </text>
          <text x="66" y="48" fontFamily="Instrument Serif, serif" fontSize="12" fill="#d9622b" fontStyle="italic">
            y&apos;
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: move the slider or type θ">
        <VectorCanvas draw={draw} interactive={false} />
        <div className="controls-col wide">
          <SliderRow
            label={
              <>
                θ (vector shown dashed is <MathText tex={String.raw`\begin{pmatrix}4\\2\end{pmatrix}`} />)
              </>
            }
            value={theta}
            min={-180}
            max={180}
            step={1}
            onChange={setTheta}
          />
          <div className="mono-block muted">
            <div>
              cos θ = {fmt(cosv)}, sin θ = {fmt(sinv)}
            </div>
            <div className="ink">
              result = ({fmt(rv.x)}, {fmt(rv.y)})
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
