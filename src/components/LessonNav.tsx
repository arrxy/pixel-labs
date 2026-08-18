import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'

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
  const links = useMemo(() => groups.flatMap((group) => group.links), [groups])
  const [open, setOpen] = useState(true)
  const [activeHref, setActiveHref] = useState(links[0]?.href ?? '')
  const navId = useId()
  const close = () => setOpen(false)

  useEffect(() => {
    let frame = 0

    const updateActiveLink = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const threshold = Math.min(180, window.innerHeight * 0.28)
        let nextHref = links[0]?.href ?? ''

        for (const link of links) {
          const id = decodeURIComponent(link.href.replace(/^#/, ''))
          const section = document.getElementById(id)
          if (!section) continue
          if (section.getBoundingClientRect().top <= threshold) nextHref = link.href
          else break
        }

        const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
        if (atPageEnd && links.length > 0) nextHref = links[links.length - 1].href

        setActiveHref((current) => (current === nextHref ? current : nextHref))
      })
    }

    updateActiveLink()
    window.addEventListener('scroll', updateActiveLink, { passive: true })
    window.addEventListener('resize', updateActiveLink)
    window.addEventListener('hashchange', updateActiveLink)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveLink)
      window.removeEventListener('resize', updateActiveLink)
      window.removeEventListener('hashchange', updateActiveLink)
    }
  }, [links])

  useEffect(() => {
    const nav = document.getElementById(navId)
    const activeLink = nav?.querySelector<HTMLElement>('a[aria-current="location"]')
    if (!nav || !activeLink) return

    const navRect = nav.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    const topBoundary = navRect.top + 72
    const bottomBoundary = navRect.bottom - 32

    if (linkRect.top < topBoundary) nav.scrollBy({ top: linkRect.top - topBoundary })
    else if (linkRect.bottom > bottomBoundary) nav.scrollBy({ top: linkRect.bottom - bottomBoundary })
  }, [activeHref, navId, open])

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
            <a className="nav-icon-btn" href="/" aria-label="Back to Pixel Playground">
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
                    <a
                      href={l.href}
                      aria-current={activeHref === l.href ? 'location' : undefined}
                      onClick={() => setActiveHref(l.href)}
                    >
                      {l.label}
                    </a>
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
