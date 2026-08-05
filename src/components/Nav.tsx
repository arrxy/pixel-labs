const VECTOR_LINKS = [
  { href: '#vectors', label: 'What is a vector?' },
  { href: '#addition', label: 'Addition & subtraction' },
  { href: '#dot', label: 'Dot product' },
  { href: '#cross', label: 'Cross product' },
]

const MATRIX_LINKS = [
  { href: '#matrix', label: 'Matrices' },
  { href: '#rotation', label: 'Rotation' },
  { href: '#scale', label: 'Scale' },
  { href: '#translation', label: 'Translation' },
  { href: '#homogeneous', label: 'Homogeneous coords' },
  { href: '#together', label: 'Putting it together' },
]

export function Nav() {
  return (
    <nav className="lesson-nav">
      <div className="nav-brand">
        Linear Algebra
        <br />
        for Graphics
      </div>
      <div className="nav-group-label">Vectors</div>
      <ul className="nav-list">
        {VECTOR_LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-group-label">Matrices & Transforms</div>
      <ul className="nav-list">
        {MATRIX_LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
