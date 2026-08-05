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
      <div className="nav-group-label">3D</div>
      <ul className="nav-list">
        {LINKS_3D.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
