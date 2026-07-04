interface GaugeProps {
  label: string
  value: number
  max: number
  unit: string
  color: string
}

export function Gauge({ label, value, max, unit, color }: GaugeProps) {
  const pct = Math.min(100, max ? (value / max) * 100 : 0)
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>
          {value} / {max} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-surface2">
        <div className="h-full rounded transition-[width] duration-200" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

interface StatProps {
  label: string
  value: string
  unit: string
  color: string
}

export function Stat({ label, value, unit, color }: StatProps) {
  return (
    <div className="rounded-[10px] border border-line bg-surface2 px-3 py-2.5">
      <p className="m-0 text-[11.5px] uppercase tracking-wide text-muted">{label}</p>
      <p className="m-0 mt-0.5 font-display text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
      <p className="m-0 text-[11px] text-muted">{unit}</p>
    </div>
  )
}
