import type { Rank } from '../types'

interface XpToastProps {
  amount: number
}

export function XpToast({ amount }: XpToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3.5">
      <div className="animate-xp-toast rounded-full border border-accent bg-surface2 px-4 py-2 font-display text-sm font-semibold text-accent shadow-lg">
        +{amount} XP
      </div>
    </div>
  )
}

interface LevelUpModalProps {
  lvl: number
  rank: Rank
  onDismiss: () => void
}

export function LevelUpModal({ lvl, rank, onDismiss }: LevelUpModalProps) {
  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/70 px-6"
      role="dialog"
      aria-label="Niveau supérieur"
    >
      <div className="animate-level-up rounded-2xl border-2 border-accent bg-surface p-6 text-center">
        <p className="m-0 font-display text-xs font-semibold uppercase tracking-[3px] text-accent">Niveau supérieur</p>
        <p className="m-0 mt-2 text-5xl">{rank.icon}</p>
        <p className="m-0 mt-2 font-display text-3xl font-bold">Niveau {lvl}</p>
        <p className="m-0 mt-1 text-sm text-muted">{rank.name}</p>
        <p className="m-0 mt-4 text-xs text-muted">(touche l'écran pour continuer)</p>
      </div>
    </div>
  )
}
