import { useEffect } from 'react'

/** Scroll to the URL hash after lazy lesson sections mount. */
export function HashScroll() {
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, '')
    if (!raw) return
    const id = decodeURIComponent(raw)

    const scroll = () => {
      const el = document.getElementById(id)
      if (!el) return false
      el.scrollIntoView()
      return true
    }

    if (scroll()) return

    const obs = new MutationObserver(() => {
      if (scroll()) obs.disconnect()
    })
    obs.observe(document.body, { childList: true, subtree: true })
    const timeout = window.setTimeout(() => obs.disconnect(), 8000)
    return () => {
      obs.disconnect()
      window.clearTimeout(timeout)
    }
  }, [])

  return null
}
