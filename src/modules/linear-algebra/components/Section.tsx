import type { ReactNode } from 'react'

type Props = {
  id: string
  title: string
  children: ReactNode
  borderedTop?: boolean
  noBorder?: boolean
}

export function Section({ id, title, children, borderedTop, noBorder }: Props) {
  return (
    <section
      id={id}
      className={[
        'lesson-section',
        borderedTop ? 'bordered-top' : '',
        noBorder ? 'no-border' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  )
}
