import { useCallback, useState } from 'react'
import { NumInput } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, u2p } from '../lib/canvas'
import { fmt, mag, project, reject } from '../lib/math'
import { DEFAULT_COLORS, type Vec2 } from '../lib/types'

export function Projection() {
  const [a, setA] = useState<Vec2>({ x: 4, y: 3 })
  const [b, setB] = useState<Vec2>({ x: 5, y: 0 })
  const p = project(a, b)
  const r = reject(a, b)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const pa = u2p(a.x, a.y)
      const pb = u2p(b.x, b.y)
      const pp = project(a, b)
      const pr = reject(a, b)
      const pProj = u2p(pp.x, pp.y)
      const pRejEnd = u2p(pp.x + pr.x, pp.y + pr.y)

      ctx.save()
      ctx.strokeStyle = '#c9c6ba'
      ctx.setLineDash([3, 3])
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pa.px, pa.py)
      ctx.lineTo(pProj.px, pProj.py)
      ctx.stroke()
      ctx.restore()

      drawArrow(ctx, OX, OY, pb.px, pb.py, col.b, 2.5)
      drawArrow(ctx, OX, OY, pProj.px, pProj.py, '#9b978a', 3)
      if (mag(pr) > 0.05) {
        drawArrow(ctx, pProj.px, pProj.py, pRejEnd.px, pRejEnd.py, '#c9c6ba', 2, true)
      }
      drawArrow(ctx, OX, OY, pa.px, pa.py, col.a, 3)
    },
    [a, b],
  )

  return (
    <Section id="projection" title="Projection">
      <MathParagraph>
        {`The orthogonal projection of $\\mathbf{a}$ onto $\\mathbf{b}$ is the shadow of $\\mathbf{a}$ on the line spanned by $\\mathbf{b}$. It is the part of $\\mathbf{a}$ that lies parallel to $\\mathbf{b}$:`}
      </MathParagraph>
      <MathText
        tex={String.raw`\mathrm{proj}_{\mathbf{b}}\mathbf{a}=\dfrac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{b}\cdot\mathbf{b}}\,\mathbf{b}`}
        display
      />
      <MathParagraph>
        {`What is left over is the rejection, perpendicular to $\\mathbf{b}$: $\\mathbf{a}-\\mathrm{proj}_{\\mathbf{b}}\\mathbf{a}$. Lighting, constraints, and sliding along a surface all use this split.`}
      </MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg">
          <line x1="30" y1="150" x2="190" y2="150" stroke="#d9622b" strokeWidth="2.5" markerEnd="url(#arrowB)" />
          <line x1="30" y1="150" x2="130" y2="150" stroke="#9b978a" strokeWidth="2.5" markerEnd="url(#arrowInk)" />
          <line
            x1="130"
            y1="150"
            x2="130"
            y2="90"
            stroke="#c9c6ba"
            strokeWidth="2"
            strokeDasharray="4,3"
            markerEnd="url(#arrowInk)"
          />
          <line x1="30" y1="150" x2="130" y2="90" stroke="#0f6e63" strokeWidth="2.5" markerEnd="url(#arrowA)" />
          <text x="134" y="86" fontFamily="Instrument Serif, serif" fontSize="13" fill="#0f6e63" fontStyle="italic">
            a
          </text>
          <text x="194" y="154" fontFamily="Instrument Serif, serif" fontSize="13" fill="#d9622b" fontStyle="italic">
            b
          </text>
          <text x="70" y="166" fontFamily="Space Mono, monospace" fontSize="11" fill="#6b6b63">
            proj
          </text>
        </svg>
      </Diagram>
      <Playground label="Playground: gray arrow is projection; dashed is rejection">
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
            <div>
              proj = ({fmt(p.x)}, {fmt(p.y)})
            </div>
            <div>
              rej = ({fmt(r.x)}, {fmt(r.y)})
            </div>
          </div>
        </div>
      </Playground>
    </Section>
  )
}
