import { useState, type ReactNode } from 'react'

interface DisclosureProps {
  icon?: string
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: ReactNode
}

/** Section repliable : évite le mur de texte, le contenu se découvre au clic. */
export function Disclosure({ icon, title, subtitle, defaultOpen = false, children }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-3 rounded-2xl border border-line bg-surface">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-2.5 p-4 text-left">
        {icon && (
          <span className="text-lg" aria-hidden>
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[14.5px] font-semibold uppercase tracking-wide">{title}</span>
          {subtitle && <span className="mt-0.5 block text-[11.5px] font-normal normal-case tracking-normal text-muted">{subtitle}</span>}
        </span>
        <span className={`shrink-0 text-sm text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden>
          ⌄
        </span>
      </button>
      {open && <div className="border-t border-line px-4 pb-4 pt-3">{children}</div>}
    </div>
  )
}
