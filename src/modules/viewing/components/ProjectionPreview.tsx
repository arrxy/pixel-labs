import { fmt } from '../../linear-algebra/lib/math'
import type { Mat4 } from '../../linear-algebra/lib/math3'
import type { Vec3 } from '../../linear-algebra/lib/types'
import { CUBE_EDGES, inNdc, projectPoint } from '../lib/projection'

type Marker = { p: Vec3; color?: string; label?: string }

type Props = {
  vertices: Vec3[]
  edges?: [number, number][]
  /** Color each block of `groupSize` vertices (one cube at a time). */
  groupColors?: string[]
  groupSize?: number
  markers?: Marker[]
  matrix: Mat4 | null
  width?: number
  height?: number
  caption?: string
}

export function ProjectionPreview({
  vertices,
  edges = CUBE_EDGES,
  groupColors,
  groupSize = 8,
  markers = [],
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

  const colorOf = (index: number) => {
    if (!groupColors?.length) return undefined
    return groupColors[Math.floor(index / groupSize) % groupColors.length]
  }

  const projected = matrix ? vertices.map((v) => projectPoint(matrix, v)) : []

  const lines: { x1: number; y1: number; x2: number; y2: number; muted: boolean; color?: string }[] = []
  for (const [i, j] of edges) {
    const a = projected[i]
    const b = projected[j]
    if (!a?.ok || !b?.ok) continue
    const dx = sx(a.ndc.x) - sx(b.ndc.x)
    const dy = sy(a.ndc.y) - sy(b.ndc.y)
    if (dx * dx + dy * dy < 0.8) continue
    lines.push({
      x1: sx(a.ndc.x),
      y1: sy(a.ndc.y),
      x2: sx(b.ndc.x),
      y2: sy(b.ndc.y),
      muted: !inNdc(a.ndc) || !inNdc(b.ndc),
      color: colorOf(i),
    })
  }

  const dots = projected.flatMap((p, i) =>
    p.ok ? [{ key: i, x: sx(p.ndc.x), y: sy(p.ndc.y), inside: inNdc(p.ndc), color: colorOf(i) }] : [],
  )

  const marks = matrix
    ? markers.flatMap((m, i) => {
        const hit = projectPoint(matrix, m.p)
        if (!hit.ok) return []
        return [
          {
            key: `m-${i}`,
            x: sx(hit.ndc.x),
            y: sy(hit.ndc.y),
            color: m.color ?? '#1a1a1a',
            label: m.label,
            ndc: hit.ndc,
            inside: inNdc(hit.ndc),
          },
        ]
      })
    : []

  const tracked = marks[0]
  const insideCount = dots.filter((d) => d.inside).length
  const status = !matrix
    ? 'invalid bounds'
    : tracked
      ? `P → NDC (${fmt(tracked.ndc.x)}, ${fmt(tracked.ndc.y)}, ${fmt(tracked.ndc.z)})${tracked.inside ? '' : ' · outside NDC'}`
      : `${insideCount}/${vertices.length} vertices inside the NDC square`

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
          NDC xy · film
        </text>
        <text x={sx(1) - 2} y={sy(0) + 12} textAnchor="end" className="ndc-label">
          x
        </text>
        <text x={sx(0) + 6} y={sy(1) + 12} className="ndc-label">
          y
        </text>
        {lines.map((ln, i) => (
          <line
            key={i}
            x1={ln.x1}
            y1={ln.y1}
            x2={ln.x2}
            y2={ln.y2}
            className={ln.muted ? 'proj-edge muted' : 'proj-edge'}
            style={ln.color && !ln.muted ? { stroke: ln.color } : undefined}
          />
        ))}
        {dots.map((d) => (
          <circle
            key={d.key}
            cx={d.x}
            cy={d.y}
            r={3.2}
            className={d.inside ? 'proj-dot' : 'proj-dot muted'}
            style={d.color && d.inside ? { fill: d.color } : undefined}
          />
        ))}
        {marks.map((m) => (
          <g key={m.key}>
            <circle cx={m.x} cy={m.y} r={4} fill={m.color} />
            {m.label ? (
              <text x={m.x + 6} y={m.y - 6} className="ndc-label">
                {m.label}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <figcaption className="mono-block muted" aria-live="polite">
        {status}
      </figcaption>
    </figure>
  )
}
