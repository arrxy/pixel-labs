import { useId, type ReactNode } from 'react'

type Props = {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  color?: string
}

export function NumInput({ label, value, onChange, step = 0.5, color }: Props) {
  const inputId = useId()

  return (
    <label className="num-label" htmlFor={inputId} style={color ? { color } : undefined}>
      {label}{' '}
      <input
        id={inputId}
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
  const labelId = useId()
  const rangeTypeId = useId()
  const numberTypeId = useId()
  const set = (raw: string) => {
    const n = parseFloat(raw)
    if (!Number.isNaN(n)) onChange(n)
  }
  return (
    <div className="slider-label">
      <span id={labelId}>{label}</span>
      <div className="slider-row">
        <span id={rangeTypeId} className="visually-hidden">
          slider
        </span>
        <input
          type="range"
          aria-labelledby={`${labelId} ${rangeTypeId}`}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
        <span id={numberTypeId} className="visually-hidden">
          number input
        </span>
        <input
          type="number"
          aria-labelledby={`${labelId} ${numberTypeId}`}
          className="num-input"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      </div>
    </div>
  )
}
