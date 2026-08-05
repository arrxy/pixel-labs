import type { ReactNode } from 'react'

type Props = {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  color?: string
}

export function NumInput({ label, value, onChange, step = 0.5, color }: Props) {
  return (
    <label className="num-label" style={color ? { color } : undefined}>
      {label}{' '}
      <input
        type="number"
        className="num-input"
        step={step}
        value={value}
        onChange={(e) => {
          const n = parseFloat(e.target.value)
          if (!Number.isNaN(n)) onChange(n)
        }}
      />
    </label>
  )
}

type SliderProps = {
  label: ReactNode
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
}

export function SliderRow({ label, value, onChange, min, max, step = 1 }: SliderProps) {
  const set = (raw: string) => {
    const n = parseFloat(raw)
    if (!Number.isNaN(n)) onChange(n)
  }
  return (
    <label className="slider-label">
      {label}
      <div className="slider-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
        <input
          type="number"
          className="num-input"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      </div>
    </label>
  )
}
