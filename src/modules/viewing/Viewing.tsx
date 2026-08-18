import { lazy, Suspense } from 'react'
import { HashScroll } from '../../components/HashScroll'
import { PriorLectureLinks } from '../../components/PriorLectureLinks'
import { ArrowMarkers } from '../linear-algebra/components/ArrowMarkers'
import { ViewingNav } from './components/ViewingNav'
import './viewing.css'

const ViewingTrack = lazy(() => import('./Track').then((m) => ({ default: m.ViewingTrack })))

export function Viewing() {
  return (
    <div className="page">
      <ArrowMarkers />
      <HashScroll />
      <div className="page-inner">
        <ViewingNav />
        <main className="lesson-main">
          <header className="lesson-header">
            <h1>Viewing</h1>
            <p>
              Follow one 3D point from model space to a screen pixel. We will build the camera, choose what it can see,
              derive both projection matrices from their endpoint rules, and label every coordinate stage.
            </p>
            <div className="legend-box">
              <div className="label-caps">What this lesson assumes from Part I</div>
              <ul className="legend-list">
                <li>
                  Vectors, unit vectors, the <strong>dot product</strong>, and the <strong>cross product</strong>.
                </li>
                <li>
                  Affine 4×4 transforms with a fourth coordinate <strong>w = 1</strong>, including translation, rotation,
                  and scaling.
                </li>
                <li>
                  Matrix composition is right-to-left: <span className="math-sym">AB</span> applies B first. Inverse
                  transforms undo a placement.
                </li>
              </ul>
            </div>
            <PriorLectureLinks
              links={[{ href: '/linear-algebra#together3d', label: 'This continues from 4×4 transforms in Part I' }]}
            />
          </header>
          <Suspense fallback={<p className="hint-text">Loading viewing labs…</p>}>
            <ViewingTrack />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
