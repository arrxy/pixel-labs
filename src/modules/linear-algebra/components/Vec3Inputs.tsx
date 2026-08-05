import { NumInput } from './Controls'
import type { Vec3 } from '../lib/types'

type Props = {
  value: Vec3
  onChange: (v: Vec3) => void
  labels?: [string, string, string]
  color?: string
  prefix?: string
}

export function Vec3Inputs({
  value,
  onChange,
  labels = ['x', 'y', 'z'],
  color,
  prefix = '',
}: Props) {
  return (
    <div className="controls-col">
      <NumInput
        label={`${prefix}${labels[0]}`}
        value={value.x}
        color={color}
        onChange={(x) => onChange({ ...value, x })}
      />
      <NumInput
        label={`${prefix}${labels[1]}`}
        value={value.y}
        color={color}
        onChange={(y) => onChange({ ...value, y })}
      />
      <NumInput
        label={`${prefix}${labels[2]}`}
        value={value.z}
        color={color}
        onChange={(z) => onChange({ ...value, z })}
      />
    </div>
  )
}
