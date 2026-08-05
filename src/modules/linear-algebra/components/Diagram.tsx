import type { ReactNode } from 'react'

export function Diagram({ children, label = 'Diagram' }: { children: ReactNode; label?: string }) {
  return (
    <>
      <div className="label-caps">{label}</div>
      <div className="diagram-box">{children}</div>
    </>
  )
}

export function Playground({
  children,
  label,
}: {
  children: ReactNode
  label?: string
}) {
  return (
    <>
      {label ? <div className="label-caps playground-label">{label}</div> : null}
      <div className="playground">{children}</div>
    </>
  )
}
