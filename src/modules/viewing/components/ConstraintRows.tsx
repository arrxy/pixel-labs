import type { ReactNode } from 'react'

export type ConstraintRow = {
  row: string
  output: string
  rule: ReactNode
  entries: string
}

export function ConstraintRows({ title, rows }: { title: string; rows: ConstraintRow[] }) {
  return (
    <div className="constraint-builder" aria-label={title}>
      <div className="label-caps">{title}</div>
      <div className="constraint-grid">
        <div className="constraint-head">matrix row</div>
        <div className="constraint-head">required output</div>
        <div className="constraint-head">entries</div>
        {rows.map((item) => (
          <div className="constraint-row" key={item.row}>
            <div className="constraint-number">{item.row}</div>
            <div>
              <div className="constraint-output">{item.output}</div>
              <div className="constraint-rule">{item.rule}</div>
            </div>
            <code>{item.entries}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
