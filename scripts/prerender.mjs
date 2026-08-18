import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const routes = [
  { pathname: '/', file: 'index.html' },
  { pathname: '/linear-algebra', file: 'linear-algebra/index.html' },
  { pathname: '/viewing', file: 'viewing/index.html' },
]

const serverEntry = resolve(root, '.prerender', 'entry-server.js')

try {
  const { render } = await import(pathToFileURL(serverEntry).href)
  for (const route of routes) {
    const outputPath = resolve(root, 'dist', route.file)
    const template = await readFile(outputPath, 'utf8')
    const appHtml = await render(route.pathname)
    const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    await writeFile(outputPath, html)
  }
} finally {
  await rm(resolve(root, '.prerender'), { recursive: true, force: true })
}
