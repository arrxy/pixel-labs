/** Shared SVG arrowhead markers for static diagrams. */
export function ArrowMarkers() {
  return (
    <svg className="arrow-defs" aria-hidden>
      <defs>
        <marker
          id="arrowA"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#0f6e63" />
        </marker>
        <marker
          id="arrowB"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#d9622b" />
        </marker>
        <marker
          id="arrowInk"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#1a1a1a" />
        </marker>
      </defs>
    </svg>
  )
}
