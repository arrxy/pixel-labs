import { useCallback, useState } from 'react'
import { NumInput } from '../components/Controls'
import { Diagram, Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawArrow, drawGrid, u2p } from '../lib/canvas'
import { fmt } from '../lib/math'
import { DEFAULT_COLORS, type Vec2 } from '../lib/types'

export function Addition() {
  const [a, setA] = useState<Vec2>({ x: 3, y: 1 })
  const [b, setB] = useState<Vec2>({ x: 1, y: 3 })
  const [mode, setMode] = useState<'add' | 'sub'>('add')

  const bb = mode === 'sub' ? { x: -b.x, y: -b.y } : b
  const sum = { x: a.x + bb.x, y: a.y + bb.y }

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 26)
      const bbLocal = mode === 'sub' ? { x: -b.x, y: -b.y } : b
      const sumLocal = { x: a.x + bbLocal.x, y: a.y + bbLocal.y }
      const pa = u2p(a.x, a.y)
      const pb = u2p(bbLocal.x, bbLocal.y)
      const psum = u2p(sumLocal.x, sumLocal.y)
      drawArrow(ctx, OX, OY, pa.px, pa.py, col.a, 3)
      drawArrow(ctx, OX, OY, pb.px, pb.py, col.b, 3)
      drawArrow(ctx, pa.px, pa.py, psum.px, psum.py, col.b, 1.5, true)
      drawArrow(ctx, OX, OY, psum.px, psum.py, col.ink, 3)
    },
    [a, b, mode],
  )

  return (
    <Section id="addition" title="Addition & subtraction">
      <MathParagraph>
        {`Suppose two vectors add: $\\mathbf{a}=\\begin{pmatrix}x\\\\z\\end{pmatrix}$, $\\mathbf{b}=\\begin{pmatrix}u\\\\v\\end{pmatrix}$.`}
      </MathParagraph>
      <MathText tex={String.raw`\mathbf{a}+\mathbf{b}=\begin{pmatrix}x+u\\z+v\end{pmatrix}`} display />
      <MathParagraph>
        {`Subtraction works the same way, with the second vector negated: $\\mathbf{a}-\\mathbf{b}=\\mathbf{a}+(-\\mathbf{b})$.`}
      </MathParagraph>
      <Diagram>
        <svg viewBox="0 0 220 180" className="diagram-svg">
          <line x1="10" y1="150" x2="205" y2="150" stroke="#cfccc0" strokeWidth="1.5" />
          <line x1="30" y1="170" x2="30" y2="15" stroke="#cfccc0" strokeWidth="1.5" />
          <line x1="30" y1="150" x2="90" y2="130" stroke="#0f6e63" strokeWidth="2.5" markerEnd="url(#arrowA)" />
          <line x1="30" y1="150" x2="48" y2="92" stroke="#d9622b" strokeWidth="1.5" strokeDasharray="4,3" />
          <line x1="90" y1="130" x2="108" y2="72" stroke="#d9622b" strokeWidth="2.5" markerEnd="url(#arrowB)" />
          <line x1="30" y1="150" x2="108" y2="72" stroke="#1a1a1a" strokeWidth="2.5" markerEnd="url(#arrowInk)" />
          <text x="52" y="148" fontFamily="Source Serif 4, serif" fontSize="13" fill="#0f6e63" fontStyle="italic">
            a
          </text>
          <text x="96" y="98" fontFamily="Source Serif 4, serif" fontSize="13" fill="#d9622b" fontStyle="italic">
            b
          </text>
          <text x="58" y="70" fontFamily="Source Serif 4, serif" fontSize="13" fill="#1a1a1a" fontStyle="italic">
            a+b
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
          <div className="btn-row">
            <button
              type="button"
              className={mode === 'add' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => setMode('add')}
            >
              a + b
            </button>
            <button
              type="button"
              className={mode === 'sub' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => setMode('sub')}
            >
              a − b
            </button>
          </div>
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
          <div className="mono-stat">
            a {mode === 'sub' ? '−' : '+'} b = ({fmt(sum.x)}, {fmt(sum.y)})
          </div>
        </div>
      </Playground>
    </Section>
  )
}
