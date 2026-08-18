import { StrictMode } from 'react'
import { renderToReadableStream } from 'react-dom/server'
import App from './App'

export async function render(pathname: string) {
  let renderError: unknown
  const stream = await renderToReadableStream(
    <StrictMode>
      <App pathname={pathname} />
    </StrictMode>,
    {
      onError(error) {
        renderError = error
      },
    },
  )
  await stream.allReady
  if (renderError) throw renderError
  return new Response(stream).text()
}
