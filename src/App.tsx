import { lazy, Suspense } from 'react'
import { Home } from './Home'

const LinearAlgebra = lazy(() =>
  import('./modules/linear-algebra/LinearAlgebra').then((m) => ({ default: m.LinearAlgebra })),
)

const Viewing = lazy(() =>
  import('./modules/viewing/Viewing').then((m) => ({ default: m.Viewing })),
)

const route = window.location.pathname.replace(/\/$/, '') || '/'

export default function App() {
  if (route === '/linear-algebra') {
    return (
      <Suspense fallback={null}>
        <LinearAlgebra />
      </Suspense>
    )
  }
  if (route === '/viewing') {
    return (
      <Suspense fallback={null}>
        <Viewing />
      </Suspense>
    )
  }
  return <Home />
}
