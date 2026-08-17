type Stage<T extends string> = { id: T; label: string }

type Props<T extends string> = {
  stages: Stage<T>[]
  active: T
  onChange: (id: T) => void
  label?: string
}

export function PipelineStepper<T extends string>({
  stages,
  active,
  onChange,
  label = 'Pipeline stage',
}: Props<T>) {
  return (
    <div className="pipeline-stepper" role="tablist" aria-label={label}>
      {stages.map((s) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={active === s.id}
          className={active === s.id ? 'mode-btn active' : 'mode-btn'}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
