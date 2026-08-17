type Link = { href: string; label: string }

type Props = {
  links: Link[]
}

export function PriorLectureLinks({ links }: Props) {
  if (links.length === 0) return null

  return (
    <p className="prior-lecture">
      {links.map((l, i) => (
        <span key={l.href}>
          {i > 0 ? (i === links.length - 1 ? ' and ' : ', ') : null}
          <a href={l.href} target="_blank" rel="noreferrer">
            {l.label}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </span>
      ))}
      .
    </p>
  )
}
