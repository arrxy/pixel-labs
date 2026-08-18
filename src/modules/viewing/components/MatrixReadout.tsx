import { MathText } from '../../linear-algebra/components/MathText'
import { fmt } from '../../linear-algebra/lib/math'
import type { Mat4 } from '../../linear-algebra/lib/math3'
import type { ReactNode } from 'react'

type Props = {
  matrix: Mat4 | null
  label: ReactNode
  tex?: string
}

export function MatrixReadout({ matrix, label, tex }: Props) {
  return (
    <div className="matrix-readout">
      <div className="mono-block">
        <div className="muted-label">{label} · read each row left to right</div>
        {matrix ? (
          <div className="matrix-grid four">
            {matrix.flat().map((n, i) => (
              <span key={i}>{fmt(n)}</span>
            ))}
          </div>
        ) : (
          <div className="secondary">invalid bounds</div>
        )}
      </div>
      {tex ? <MathText tex={tex} display /> : null}
    </div>
  )
}
