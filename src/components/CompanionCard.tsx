import type { GameCompute } from '../lib/gameCompute'
import { COMPANION_FLAVOR, companionMood, companionStage, nextCompanionStage } from '../lib/companion'

interface CompanionCardProps {
  game: GameCompute
}

const MOOD_STYLE: Record<ReturnType<typeof companionMood>, { border: string; glow: string; badge: string }> = {
  content: { border: 'border-accent/40', glow: 'glow-accent', badge: 'text-accent' },
  triste: { border: 'border-red/40', glow: '', badge: 'text-red' },
  neutre: { border: 'border-line', glow: '', badge: 'text-muted' },
}

export function CompanionCard({ game }: CompanionCardProps) {
  const stage = companionStage(game.lvl)
  const next = nextCompanionStage(game.lvl)
  const mood = companionMood(game.streak)
  const style = MOOD_STYLE[mood]

  return (
    <div className={`mb-3 rounded-2xl border bg-surface p-4 text-center ${style.border} ${style.glow}`}>
      <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🐾 Ton compagnon</p>
      <div className={`mt-2 text-5xl ${mood === 'content' ? 'companion-bob' : ''}`} aria-hidden>
        {stage.emoji}
      </div>
      <p className="m-0 mt-1.5 font-display text-base font-semibold">{stage.name}</p>
      <p className={`m-0 mt-1 text-[12.5px] ${style.badge}`}>{COMPANION_FLAVOR[mood]}</p>
      <p className="m-0 mt-1.5 text-[11px] text-muted">{next ? `Prochaine évolution : niveau ${next.minLevel} (${next.emoji} ${next.name})` : 'Forme finale atteinte 🏆'}</p>
    </div>
  )
}
