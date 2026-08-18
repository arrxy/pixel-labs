import { lazy, Suspense } from 'react'
import { HashScroll } from '../../components/HashScroll'
import { ArrowMarkers } from './components/ArrowMarkers'
import { Nav } from './components/Nav'
import { Addition } from './sections/Addition'
import { CrossProduct } from './sections/CrossProduct'
import { Determinant } from './sections/Determinant'
import { DotProduct } from './sections/DotProduct'
import { Homogeneous } from './sections/Homogeneous'
import { Inverse } from './sections/Inverse'
import { Matrices } from './sections/Matrices'
import { Normalize } from './sections/Normalize'
import { Projection } from './sections/Projection'
import { PuttingTogether } from './sections/PuttingTogether'
import { Rotation } from './sections/Rotation'
import { Scale } from './sections/Scale'
import { Shear } from './sections/Shear'
import { Translation } from './sections/Translation'
import { Vectors } from './sections/Vectors'

const Track3D = lazy(() =>
  import('./sections/3d/Track3D').then((m) => ({ default: m.Track3D })),
)

export function LinearAlgebra() {
  return (
    <div className="page">
      <ArrowMarkers />
      <HashScroll />
      <div className="page-inner">
        <Nav />
        <main className="lesson-main">
          <header className="lesson-header">
            <h1>Linear Algebra for Graphics</h1>
            <p>
              A hands-on introduction to the vectors and matrices behind computer graphics. Play with the arrows and
              sliders.
            </p>
          </header>
          <Vectors />
          <Normalize />
          <Addition />
          <DotProduct />
          <Projection />
          <CrossProduct />
          <Matrices />
          <Rotation />
          <Scale />
          <Shear />
          <Translation />
          <Homogeneous />
          <Inverse />
          <Determinant />
          <PuttingTogether />

          <Suspense fallback={<p className="hint-text">Loading 3D sections…</p>}>
            <Track3D />
          </Suspense>
          <p className="lesson-continue">
            Next: <a href="/viewing">Part II: Viewing</a>
          </p>
        </main>
      </div>
    </div>
  )
}
