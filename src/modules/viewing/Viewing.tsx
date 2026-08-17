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
              How a 3D model becomes a 2D image: camera space, the view volume, and the matrices that flatten space
              onto a screen.
            </p>
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
