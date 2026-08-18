import { lazy, Suspense } from 'react'
import { Home } from './Home'
import { PageMetadata } from './components/PageMetadata'

const LinearAlgebra = lazy(() =>
  import('./modules/linear-algebra/LinearAlgebra').then((m) => ({ default: m.LinearAlgebra })),
)

const Viewing = lazy(() =>
  import('./modules/viewing/Viewing').then((m) => ({ default: m.Viewing })),
)

const route = window.location.pathname.replace(/\/$/, '') || '/'

export default function App() {
  let page: 'home' | 'linear-algebra' | 'viewing' = 'home'
  let content = <Home />

  if (route === '/linear-algebra') {
    page = 'linear-algebra'
    content = (
      <Suspense fallback={null}>
        <LinearAlgebra />
      </Suspense>
    )
  } else if (route === '/viewing') {
    page = 'viewing'
    content = (
      <Suspense fallback={null}>
        <Viewing />
      </Suspense>
    )
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <PageMetadata page={page} />
      {content}
    </>
  )
}
