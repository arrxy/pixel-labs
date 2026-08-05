import { ArrowMarkers } from './components/ArrowMarkers'
import { Nav } from './components/Nav'
import { Addition } from './sections/Addition'
import { CrossProduct } from './sections/CrossProduct'
import { DotProduct } from './sections/DotProduct'
import { Homogeneous } from './sections/Homogeneous'
import { Matrices } from './sections/Matrices'
import { PuttingTogether } from './sections/PuttingTogether'
import { Rotation } from './sections/Rotation'
import { Scale } from './sections/Scale'
import { Translation } from './sections/Translation'
import { Vectors } from './sections/Vectors'

export default function App() {
  return (
    <div className="page">
      <ArrowMarkers />
      <div className="page-inner">
        <Nav />
        <main className="lesson-main">
          <header className="lesson-header">
            <h1>Linear Algebra for Graphics</h1>
            <p>
              A hands-on introduction to the vectors and matrices behind computer graphics. Drag the arrows and move the
              sliders. The math responds live.
            </p>
          </header>
          <Vectors />
          <Addition />
          <DotProduct />
          <CrossProduct />
          <Matrices />
          <Rotation />
          <Scale />
          <Translation />
          <Homogeneous />
          <PuttingTogether />
        </main>
      </div>
    </div>
  )
}
