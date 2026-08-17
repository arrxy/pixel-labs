import { fmt } from '../../linear-algebra/lib/math'

type Props = {
  u0: number
  u1: number
  leftLabel?: string
  rightLabel?: string
}

export function IntervalMapDiagram({ u0, u1, leftLabel = 'u₀', rightLabel = 'u₁' }: Props) {
  const mid = (u0 + u1) / 2

  return (
    <svg
      className="interval-map-diagram"
      viewBox="0 0 520 180"
      width="100%"
      role="img"
      aria-label={`Linear map from ${leftLabel} ${fmt(u0)} and ${rightLabel} ${fmt(u1)} to minus one and plus one`}
    >
      <text x="24" y="24" className="diagram-title">
        input coordinate u
      </text>
      <line x1="70" y1="58" x2="450" y2="58" className="map-line" />
      <circle cx="70" cy="58" r="5" className="map-dot" />
      <circle cx="260" cy="58" r="4" className="map-mid" />
      <circle cx="450" cy="58" r="5" className="map-dot" />
      <text x="70" y="82" textAnchor="middle" className="diagram-label">
        {leftLabel} = {fmt(u0)}
      </text>
      <text x="260" y="82" textAnchor="middle" className="diagram-label">
        midpoint = {fmt(mid)}
      </text>
      <text x="450" y="82" textAnchor="middle" className="diagram-label">
        {rightLabel} = {fmt(u1)}
      </text>
      <path d="M260 94 L260 116" className="map-arrow" />
      <text x="274" y="109" className="diagram-label">
        shift, then scale
      </text>
      <text x="24" y="132" className="diagram-title">
        output coordinate U
      </text>
      <line x1="70" y1="154" x2="450" y2="154" className="map-line" />
      <circle cx="70" cy="154" r="5" className="map-dot target" />
      <circle cx="260" cy="154" r="4" className="map-mid" />
      <circle cx="450" cy="154" r="5" className="map-dot target" />
      <text x="70" y="176" textAnchor="middle" className="diagram-label">
        −1
      </text>
      <text x="260" y="176" textAnchor="middle" className="diagram-label">
        0
      </text>
      <text x="450" y="176" textAnchor="middle" className="diagram-label">
        +1
      </text>
    </svg>
  )
}
