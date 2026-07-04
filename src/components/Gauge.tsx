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
