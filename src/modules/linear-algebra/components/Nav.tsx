import { useEffect, useId, useState } from 'react'

const VECTOR_LINKS = [
  { href: '#vectors', label: 'What is a vector?' },
  { href: '#normalize', label: 'Unit vectors' },
  { href: '#addition', label: 'Addition & subtraction' },
  { href: '#dot', label: 'Dot product' },
  { href: '#projection', label: 'Projection' },
  { href: '#cross', label: 'Cross product' },
]

const MATRIX_LINKS = [
  { href: '#matrix', label: 'Matrices' },
  { href: '#rotation', label: 'Rotation' },
  { href: '#scale', label: 'Scale' },
  { href: '#shear', label: 'Shear' },
  { href: '#translation', label: 'Translation' },
  { href: '#homogeneous', label: 'Homogeneous coords' },
  { href: '#inverse', label: 'Inverse transforms' },
  { href: '#determinant', label: 'Determinant' },
  { href: '#together', label: 'Putting it together' },
]

const LINKS_3D = [
  { href: '#from-2d-to-3d', label: 'From 2D to 3D' },
  { href: '#vectors3d', label: 'Vectors' },
  { href: '#normalize3d', label: 'Unit vectors' },
  { href: '#addition3d', label: 'Addition' },
  { href: '#dot3d', label: 'Dot product' },
  { href: '#projection3d', label: 'Projection' },
  { href: '#cross3d', label: 'Cross product' },
  { href: '#matrix3d', label: 'Matrices' },
  { href: '#rotation3d', label: 'Rotation' },
  { href: '#scale3d', label: 'Scale' },
  { href: '#shear3d', label: 'Shear' },
  { href: '#translation3d', label: 'Translation' },
  { href: '#homogeneous3d', label: 'Homogeneous' },
  { href: '#inverse3d', label: 'Inverse' },
  { href: '#determinant3d', label: 'Determinant' },
  { href: '#together3d', label: 'Putting it together' },
]

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

function NavLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className="nav-group-label">Vectors</div>
      <ul className="nav-list">
        {VECTOR_LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={onNavigate}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-group-label">Matrices & Transforms</div>
      <ul className="nav-list">
        {MATRIX_LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={onNavigate}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-group-label">3D</div>
      <ul className="nav-list">
        {LINKS_3D.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={onNavigate}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const navId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

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
        <>
          <div className="nav-backdrop" onClick={close} />
          <nav id={navId} className="lesson-nav" aria-label="Lesson sections">
            <div className="nav-icon-row">
              <button type="button" className="nav-icon-btn" aria-label="Close menu" onClick={close}>
                <CloseIcon />
              </button>
              <a className="nav-icon-btn" href="/" aria-label="Back to Processing Labs">
                <BackIcon />
              </a>
            </div>
            <div className="nav-brand">
              Linear Algebra
              <br />
              for Graphics
            </div>
            <NavLinks onNavigate={close} />
          </nav>
        </>
      )}
    </>
  )
}
