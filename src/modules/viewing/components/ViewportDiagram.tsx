import { fmt } from '../../linear-algebra/lib/math'
import type { Vec3 } from '../../linear-algebra/lib/types'
import { ndcToViewport } from '../lib/projection'

export function ViewportDiagram({ ndc, width, height }: { ndc: Vec3 | null; width: number; height: number }) {
  const screen = ndc ? ndcToViewport(ndc, width, height) : null
  const ndcBox = { x: 36, y: 42, w: 150, h: 150 }
  const viewBox = { x: 310, y: 42, w: 180, h: 150 }
  const ndcX = ndc ? ndcBox.x + ((ndc.x + 1) / 2) * ndcBox.w : 0
  const ndcY = ndc ? ndcBox.y + ((1 - ndc.y) / 2) * ndcBox.h : 0
  const screenX = screen ? viewBox.x + (screen.x / width) * viewBox.w : 0
  const screenY = screen ? viewBox.y + (screen.y / height) * viewBox.h : 0

  return (
    <svg
      className="viewport-diagram"
      viewBox="0 0 530 235"
      width="100%"
      role="img"
      aria-label="NDC square mapped to a pixel viewport with y direction reversed"
    >
      <text x={ndcBox.x} y="22" className="diagram-title">
        NDC square
      </text>
      <rect x={ndcBox.x} y={ndcBox.y} width={ndcBox.w} height={ndcBox.h} className="ndc-frame" />
      <line x1="214" y1="117" x2="282" y2="117" className="viewport-arrow" />
      <polygon points="282,117 270,111 270,123" className="viewport-arrow-head" />
      <text x="248" y="103" textAnchor="middle" className="diagram-label">
        scale + shift
      </text>
      <text x="248" y="138" textAnchor="middle" className="diagram-label">
        flip y
      </text>

      <text x={viewBox.x} y="22" className="diagram-title">
        Viewport · {width} × {height} px
      </text>
      <rect x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} className="viewport-frame" />
      <text x={viewBox.x + 8} y={viewBox.y + 18} className="diagram-label">
        +y goes down
      </text>

      {ndc && screen ? (
        <>
          <circle cx={ndcX} cy={ndcY} r="5" className="proj-dot" />
          <text x={ndcX + 8} y={ndcY - 8} className="diagram-label">
            P
          </text>
          <circle cx={screenX} cy={screenY} r="5" className="proj-dot-b" />
          <text x={screenX + 8} y={screenY - 8} className="diagram-label">
            P
          </text>
          <text x={ndcBox.x} y="222" className="diagram-label">
            P = ({fmt(ndc.x)}, {fmt(ndc.y)})
          </text>
          <text x={viewBox.x} y="222" className="diagram-label">
            P = ({fmt(screen.x)}, {fmt(screen.y)}) px
          </text>
        </>
      ) : null}
    </svg>
  )
}
