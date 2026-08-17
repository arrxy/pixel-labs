import { fmt } from '../../linear-algebra/lib/math'
import type { Mat4 } from '../../linear-algebra/lib/math3'
import type { Vec3 } from '../../linear-algebra/lib/types'
import { CUBE_EDGES, inNdc, projectPoint } from '../lib/projection'

type Props = {
  vertices: Vec3[]
  edges?: [number, number][]
  matrix: Mat4 | null
  width?: number
  height?: number
  caption?: string
}

export function ProjectionPreview({
  vertices,
  edges = CUBE_EDGES,
  matrix,
  width = 220,
  height = 220,
  caption = 'Camera output in NDC',
}: Props) {
  const pad = 28
  const inner = Math.min(width, height) - pad * 2
  const ox = (width - inner) / 2
  const oy = (height - inner) / 2
  const sx = (x: number) => ox + ((x + 1) / 2) * inner
  const sy = (y: number) => oy + ((1 - y) / 2) * inner

  const projected = matrix
    ? vertices.map((v) => projectPoint(matrix, v))
    : []

  const lines: { x1: number; y1: number; x2: number; y2: number; muted: boolean }[] = []
  for (const [i, j] of edges) {
    const a = projected[i]
    const b = projected[j]
    if (!a?.ok || !b?.ok) continue
    lines.push({
      x1: sx(a.ndc.x),
      y1: sy(a.ndc.y),
      x2: sx(b.ndc.x),
      y2: sy(b.ndc.y),
      muted: !inNdc(a.ndc) || !inNdc(b.ndc),
    })
  }

  const dots = projected.flatMap((p, i) =>
    p.ok ? [{ key: i, x: sx(p.ndc.x), y: sy(p.ndc.y), inside: inNdc(p.ndc), ndc: p.ndc }] : [],
  )
  const first = dots[0]
  const insideCount = dots.filter((d) => d.inside).length
  const status = !matrix
    ? 'invalid bounds'
    : first
      ? `${insideCount}/${vertices.length} inside  ·  NDC (${fmt(first.ndc.x)}, ${fmt(first.ndc.y)}, ${fmt(first.ndc.z)})`
      : 'not projectable'

  return (
    <figure className="projection-preview">
      <svg
        className="projection-svg"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={caption}
      >
        <rect x={ox} y={oy} width={inner} height={inner} className="ndc-frame" />
        <line x1={sx(-1)} y1={sy(0)} x2={sx(1)} y2={sy(0)} className="ndc-axis" />
        <line x1={sx(0)} y1={sy(-1)} x2={sx(0)} y2={sy(1)} className="ndc-axis" />
        <text x={width / 2} y={oy - 8} textAnchor="middle" className="ndc-label">
          NDC
        </text>
        {lines.map((ln, i) => (
          <line
            key={i}
            x1={ln.x1}
            y1={ln.y1}
            x2={ln.x2}
            y2={ln.y2}
            className={ln.muted ? 'proj-edge muted' : 'proj-edge'}
          />
        ))}
        {dots.map((d) => (
          <circle key={d.key} cx={d.x} cy={d.y} r={3.2} className={d.inside ? 'proj-dot' : 'proj-dot muted'} />
        ))}
      </svg>
      <figcaption className="mono-block muted" aria-live="polite">
        {status}
      </figcaption>
    </figure>
  )
}
