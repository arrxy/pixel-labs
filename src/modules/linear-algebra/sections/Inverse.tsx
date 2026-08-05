import { useCallback, useState } from 'react'
import { SliderRow } from '../components/Controls'
import { Playground } from '../components/Diagram'
import { MathParagraph, MathText } from '../components/MathText'
import { Section } from '../components/Section'
import { VectorCanvas } from '../components/VectorCanvas'
import { OX, OY, drawGrid, polyOutline, u2p } from '../lib/canvas'
import { applyAffine, clamp, computeCompositeM, fmt, invertAffine } from '../lib/math'
import { DEFAULT_COLORS } from '../lib/types'

export function Inverse() {
  const [tx, setTx] = useState(3)
  const [ty, setTy] = useState(2)
  const [theta, setTheta] = useState(35)
  const [sx, setSx] = useState(1.5)
  const [sy, setSy] = useState(1.2)
  const [showInverse, setShowInverse] = useState(true)

  const M = computeCompositeM(tx, ty, theta, sx, sy)
  const Minv = invertAffine(M)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const col = DEFAULT_COLORS
      drawGrid(ctx, col, 300, 300, OX, OY, 22)
      const sq = [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1.2 },
        { x: 0, y: 1.2 },
      ]
      const mat = computeCompositeM(tx, ty, theta, sx, sy)
      const inv = invertAffine(mat)
      const tsq = sq.map((p) => applyAffine(mat, p))
      polyOutline(ctx, sq, '#c9c6ba', true, OX, OY, 22)
      polyOutline(ctx, tsq, col.a, false, OX, OY, 22)

      if (showInverse && inv) {
        const back = tsq.map((p) => applyAffine(inv, p))
        polyOutline(ctx, back, col.b, false, OX, OY, 22)
        const tip = applyAffine(mat, { x: 2, y: 0.6 })
        const backTip = applyAffine(inv, tip)
        const p0 = u2p(tip.x, tip.y, OX, OY, 22)
        const p1 = u2p(backTip.x, backTip.y, OX, OY, 22)
        ctx.save()
        ctx.setLineDash([4, 3])
        ctx.strokeStyle = col.b
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(p0.px, p0.py)
        ctx.lineTo(p1.px, p1.py)
        ctx.stroke()
        ctx.restore()
      }
    },
    [tx, ty, theta, sx, sy, showInverse],
  )

  return (
    <Section id="inverse" title="Inverse transforms">
      <MathParagraph>
        {`Every useful transform has an inverse that undoes it. Translate by $-t$, rotate by $-\\theta$, scale by $1/s$. For a rotation matrix the inverse is simply the transpose: $R^{-1}=R^{\\mathsf{T}}$.`}
      </MathParagraph>
      <MathText
        tex={String.raw`R(\theta)^{-1}=R(-\theta)=\begin{pmatrix}\cos\theta&\sin\theta\\-\sin\theta&\cos\theta\end{pmatrix}=R(\theta)^{\mathsf{T}}`}
        display
      />
      <MathParagraph>
        {`For a composite $M=SRT$, the inverse reverses the order: $M^{-1}=T^{-1}R^{-1}S^{-1}$. Apply $M$, then $M^{-1}$, and you are back where you started: world space to local and back.`}
      </MathParagraph>
      <Playground label="Playground: green is M·shape; orange is M⁻¹ applied to the green result">
        <VectorCanvas draw={draw} interactive={false} />
        <div className="controls-col wide">
          <SliderRow label="tx" value={tx} min={-5} max={5} step={0.5} onChange={(v) => setTx(clamp(v, 5))} />
          <SliderRow label="ty" value={ty} min={-5} max={5} step={0.5} onChange={(v) => setTy(clamp(v, 5))} />
          <SliderRow label="θ" value={theta} min={-180} max={180} step={1} onChange={setTheta} />
          <SliderRow label="sx" value={sx} min={0.3} max={2.5} step={0.1} onChange={setSx} />
          <SliderRow label="sy" value={sy} min={0.3} max={2.5} step={0.1} onChange={setSy} />
          <label className="check-label">
            <input type="checkbox" checked={showInverse} onChange={(e) => setShowInverse(e.target.checked)} />
            show inverse
          </label>
          {Minv && (
            <div className="mono-block">
              <div className="muted-label">M⁻¹</div>
              <div className="matrix-grid">
                <span>{fmt(Minv[0][0])}</span>
                <span>{fmt(Minv[0][1])}</span>
                <span>{fmt(Minv[0][2])}</span>
                <span>{fmt(Minv[1][0])}</span>
                <span>{fmt(Minv[1][1])}</span>
                <span>{fmt(Minv[1][2])}</span>
                <span>0.00</span>
                <span>0.00</span>
                <span>1.00</span>
              </div>
            </div>
          )}
        </div>
      </Playground>
    </Section>
  )
}
