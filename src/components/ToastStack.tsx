import type { ToastItem } from '../hooks/useToasts'

interface ToastStackProps {
  toasts: ToastItem[]
}

export function ToastStack({ toasts }: ToastStackProps) {
  if (!toasts.length) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-3" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-pop glow-accent pointer-events-none flex w-full max-w-[420px] items-center gap-3 rounded-2xl border-2 border-accent bg-surface px-4 py-3"
        >
          <span className="text-2xl" aria-hidden>
            {t.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-sm font-bold uppercase tracking-wide text-accent">{t.title}</span>
            {t.subtitle && <span className="block text-xs text-muted">{t.subtitle}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}
