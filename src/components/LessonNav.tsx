import { useId, useState, type ReactNode } from 'react'

export type LessonNavLink = { href: string; label: string }

export type LessonNavGroup = { label: string; links: LessonNavLink[] }

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'butt' as const,
  strokeLinejoin: 'miter' as const,
}

function MenuIcon() {
  return (
    <svg width="28" height="16" viewBox="0 0 28 16" aria-hidden="true">
      <path d="M0 1.5h28M0 8h28M0 14.5h28" {...STROKE} />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M1 1l18 18M19 1L1 19" {...STROKE} />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" aria-hidden="true">
      <path d="M12.5 1L2 10l10.5 9" {...STROKE} />
    </svg>
  )
}

type Props = {
  brand: ReactNode
  ariaLabel: string
  groups: LessonNavGroup[]
}

export function LessonNav({ brand, ariaLabel, groups }: Props) {
  const [open, setOpen] = useState(true)
  const navId = useId()
  const close = () => setOpen(false)

  return (
    <>
      {!open && (
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={false}
          aria-controls={navId}
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </button>
      )}
      {open && (
        <nav id={navId} className="lesson-nav" aria-label={ariaLabel}>
          <div className="nav-icon-row">
            <button type="button" className="nav-icon-btn" aria-label="Close menu" onClick={close}>
              <CloseIcon />
            </button>
            <a className="nav-icon-btn" href="/" aria-label="Back to Processing Labs">
              <BackIcon />
            </a>
          </div>
          <div className="nav-brand">{brand}</div>
          {groups.map((group) => (
            <div key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              <ul className="nav-list">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </>
  )
}
