import { useState, type ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  unit: string
  color: string
  children: ReactNode
}

/** Chiffre-clé visible en un coup d'œil, avec le détail du calcul replié dans la carte au clic. */
export function StatCard({ label, value, unit, color, children }: StatCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className={`rounded-[10px] border px-3 py-2.5 text-left transition-colors duration-150 hover:border-accent/60 ${open ? 'glow-accent border-accent/50 bg-surface2' : 'border-line bg-surface2'}`}
    >
      <span className="flex items-center justify-between gap-1.5">
        <span className="text-[11.5px] uppercase tracking-wide text-muted">{label}</span>
        <span className="shrink-0 text-[10px] text-accent">{open ? 'réduire ⌃' : 'détails ⌄'}</span>
      </span>
      <span className="mt-0.5 block font-display text-2xl font-semibold" style={{ color }}>
        {value}
      </span>
      <span className="block text-[11px] text-muted">{unit}</span>
      {open && <span className="mt-2.5 block border-t border-line pt-2.5 text-[12.5px] leading-relaxed text-ink">{children}</span>}
    </button>
  )
}
