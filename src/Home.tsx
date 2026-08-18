const PARTS = [
  {
    part: 'Part I',
    title: 'Linear Algebra',
    blurb: 'Vectors, matrices, and transforms: the math behind graphics in 2D and 3D.',
    href: '/linear-algebra',
    ready: true,
  },
  {
    part: 'Part II',
    title: 'Viewing',
    blurb: 'Cameras, projections, and how 3D scenes become pixels on a screen.',
    href: '/viewing',
    ready: true,
  },
] as const

export function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <p className="home-brand">Processing Labs</p>
        <h1>Graphics from first principles</h1>
        <p className="home-lead">Interactive lessons on the math and pipelines behind computer graphics.</p>
      </header>
      <ul className="part-list">
        {PARTS.map((p) => (
          <li key={p.href}>
            {p.ready ? (
              <a className="part-card" href={p.href}>
                <span className="part-eyebrow">{p.part}</span>
                <span className="part-title">{p.title}</span>
                <span className="part-blurb">{p.blurb}</span>
              </a>
            ) : (
              <div className="part-card part-card-soon" aria-disabled="true">
                <span className="part-eyebrow">{p.part}</span>
                <span className="part-title">{p.title}</span>
                <span className="part-blurb">{p.blurb}</span>
                <span className="part-soon">Coming soon</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
