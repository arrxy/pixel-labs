import { useCallback, useState } from 'react'
import { SliderRow } from '../components/Controls'
import { Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { drawGrid } from '../lib/canvas'
import { applyAffine, clamp, computeCompositeM, fmt } from '../lib/math'
import { DEFAULT_COLORS } from '../lib/types'

export function PuttingTogether() {
  const [tx, setTx] = useState(5)
  const [ty, setTy] = useState(4)
  const [theta, setTheta] = useState(30)
  const [sx, setSx] = useState(2)
  const [sy, setSy] = useState(1.5)

  const M = computeCompositeM(tx, ty, theta, sx, sy)
  const tv = applyAffine(M, { x: 1, y: 2 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      const W = 380
      const H = 300
      const ox = W / 2
      const oy = H / 2
      const scale = 5
      drawGrid(ctx, col, W, H, ox, oy, scale * 2)
      const table = [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
        { x: 3, y: 1.5 },
        { x: 0, y: 1.5 },
      ]
      const map = (x: number, y: number) => ({ px: ox + x * scale, py: oy - y * scale })
      const mat = computeCompositeM(tx, ty, theta, sx, sy)

      ctx.save()
      ctx.strokeStyle = '#c9c6ba'
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 2
      ctx.beginPath()
      table.forEach((p, i) => {
        const m = map(p.x, p.y)
        if (i === 0) ctx.moveTo(m.px, m.py)
        else ctx.lineTo(m.px, m.py)
      })
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      const tpts = table.map((p) => applyAffine(mat, p))
      ctx.save()
      ctx.strokeStyle = col.a
      ctx.fillStyle = 'rgba(15,110,99,0.1)'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      tpts.forEach((p, i) => {
        const m = map(p.x, p.y)
        if (i === 0) ctx.moveTo(m.px, m.py)
        else ctx.lineTo(m.px, m.py)
      })
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      const vx = 1
      const vy = 2
      const transformed = applyAffine(mat, { x: vx, y: vy })
      const mv0 = map(vx, vy)
      const mv1 = map(transformed.x, transformed.y)
      ctx.beginPath()
      ctx.arc(mv0.px, mv0.py, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#9b978a'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(mv1.px, mv1.py, 4, 0, Math.PI * 2)
      ctx.fillStyle = col.b
      ctx.fill()
    },
    [tx, ty, theta, sx, sy],
  )

  return (
    <Section id="together" title="Putting it together" noBorder>
      <MathParagraph>
        {`Say you have a table asset that needs to move whenever a force is applied. First translate it by $\\begin{pmatrix}t_x\\\\t_y\\end{pmatrix}$, then rotate it counterclockwise by θ, then scale it by $s_x$ and $s_y$. Transformations apply right to left, so the combined matrix is:`}
      </MathParagraph>
      <MathText tex={String.raw`M=S\cdot R(\theta)\cdot T`} display />
      <MathParagraph>
        Multiply the three matrices once, in the order they will be applied (translate innermost, since it is
        rightmost), and reuse that single M for every vertex of the table, no matter how complex the mesh.
      </MathParagraph>
      <p className="hint-text">
        Playground: move the sliders or type values. The dashed rectangle is the original table; the vertex{' '}
        <MathText tex={String.raw`\begin{pmatrix}1\\2\end{pmatrix}`} /> is marked before and after.
      </p>
      <Playground>
        <VectorCanvas draw={draw} width={380} height={300} interactive={false} />
        <div className="controls-col wide">
          <SliderRow
            label="tx"
            value={tx}
            min={-5}
            max={5}
            step={0.5}
            onChange={(v) => setTx(clamp(v, 5))}
          />
          <SliderRow
            label="ty"
            value={ty}
            min={-5}
            max={5}
            step={0.5}
            onChange={(v) => setTy(clamp(v, 5))}
          />
          <SliderRow
            label="θ"
            value={theta}
            min={-180}
            max={180}
            step={1}
            onChange={(v) => setTheta(clamp(v, 180))}
          />
          <SliderRow
            label="sx"
            value={sx}
            min={0.2}
            max={2.5}
            step={0.1}
            onChange={(v) => setSx(Math.max(0.2, Math.min(2.5, v)))}
          />
          <SliderRow
            label="sy"
            value={sy}
            min={0.2}
            max={2.5}
            step={0.1}
            onChange={(v) => setSy(Math.max(0.2, Math.min(2.5, v)))}
          />
        </div>
      </Playground>
      <div className="matrix-readout">
        <div className="mono-block">
          <div className="muted-label">M = S·R(θ)·T</div>
          <div className="matrix-grid">
            <span>{fmt(M[0][0])}</span>
            <span>{fmt(M[0][1])}</span>
            <span>{fmt(M[0][2])}</span>
            <span>{fmt(M[1][0])}</span>
            <span>{fmt(M[1][1])}</span>
            <span>{fmt(M[1][2])}</span>
            <span>0.00</span>
            <span>0.00</span>
            <span>1.00</span>
          </div>
        </div>
        <div className="mono-block muted vertex-result">
          vertex (1, 2) → <span className="secondary">({fmt(tv.x)}, {fmt(tv.y)})</span>
        </div>
      </div>
    </Section>
  )
}
