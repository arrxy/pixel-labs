import { lazy, Suspense } from 'react'
import { Home } from './Home'

const LinearAlgebra = lazy(() =>
  import('./modules/linear-algebra/LinearAlgebra').then((m) => ({ default: m.LinearAlgebra })),
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
  return <Home />
}
