const PARTS = [
  {
    part: 'Part I',
    title: 'Linear Algebra',
    blurb: 'Vectors, matrices, and transforms: the math behind graphics in 2D and 3D.',
    topics: ['Vectors and vector operations', 'Matrices and affine transforms', 'Homogeneous coordinates in 2D and 3D'],
    href: '/linear-algebra',
    ready: true,
  },
  {
    part: 'Part II',
    title: 'Viewing',
    blurb: 'Cameras, projections, and how 3D scenes become pixels on a screen.',
    topics: ['Camera and world spaces', 'Orthographic and perspective projection', 'Clipping, NDC, and viewport mapping'],
    href: '/viewing',
    ready: true,
  },
] as const

export function Home() {
  return (
    <main id="main-content" className="home" tabIndex={-1}>
      <header className="home-header">
        <p className="home-brand">Graphics Explained</p>
        <h1>Graphics from first principles</h1>
        <p className="home-lead">Interactive lessons on the math and pipelines behind computer graphics.</p>
      </header>
      <section className="home-intro" aria-labelledby="home-intro-title">
        <h2 id="home-intro-title">Learn how graphics systems turn geometry into pixels</h2>
        <p>
          Build the mathematics from vectors and matrices through camera coordinates, projection, normalized device
          coordinates, and screen pixels. Every lesson pairs a careful derivation with diagrams and controls you can
          adjust, so each equation has a visible geometric meaning.
        </p>
      </section>
      <ul className="part-list">
        {PARTS.map((p) => (
          <li key={p.href}>
            {p.ready ? (
              <a className="part-card" href={p.href}>
                <span className="part-eyebrow">{p.part}</span>
                <span className="part-title">{p.title}</span>
                <span className="part-blurb">{p.blurb}</span>
                <ul className="part-topics" aria-label={`${p.title} topics`}>
                  {p.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </a>
            ) : (
              <div className="part-card part-card-soon" aria-disabled="true">
                <span className="part-eyebrow">{p.part}</span>
                <span className="part-title">{p.title}</span>
                <span className="part-blurb">{p.blurb}</span>
                <ul className="part-topics" aria-label={`${p.title} topics`}>
                  {p.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <span className="part-soon">Coming soon</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
