import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './styles/global.css'
import App from './App.tsx'

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

const root = document.getElementById('root')!
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
