import type { CharacterData } from '../types'
import type { GameCompute } from '../lib/gameCompute'
import { WeightTab } from './tabs/WeightTab'
import { CompanionCard } from './CompanionCard'
import { FOOD_SWAPS } from '../data/foodSwaps'

interface ProfileScreenProps {
  data: CharacterData
  game: GameCompute
  persist: (next: CharacterData) => void
  onBack: () => void
  onSignOut: () => void
  resetArmed: boolean
  onDeleteClick: () => void
}

export function ProfileScreen({ data, game, persist, onBack, onSignOut, resetArmed, onDeleteClick }: ProfileScreenProps) {
  const { rank, nextRank, lvl, into, need, xp, streak, achievements } = game
  const doneAchievements = achievements.filter((a) => a.done).length

  const toggleFoodSwap = (swapId: string) => persist({ ...data, foodSwaps: { ...data.foodSwaps, [swapId]: !data.foodSwaps?.[swapId] } })

  return (
    <section>
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm text-muted">
        <span aria-hidden>‹</span> Retour
      </button>

      <CompanionCard game={game} />

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🎫 Ta fiche de perso</p>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="glow-accent rounded-[10px] border border-accent/40 bg-surface2 px-3 py-2.5">
            <p className="m-0 text-[11.5px] uppercase tracking-wide text-muted">Rang</p>
            <p className="m-0 mt-0.5 font-display text-xl font-semibold text-accent">
              {rank.icon} {rank.name}
            </p>
            <p className="m-0 text-[11px] text-muted">{nextRank ? `${nextRank.name} au niv. ${nextRank.min}` : 'Rang maximum'}</p>
          </div>
          <div className="glow-purple rounded-[10px] border border-purple/40 bg-surface2 px-3 py-2.5">
            <p className="m-0 text-[11.5px] uppercase tracking-wide text-muted">Niveau</p>
            <p className="m-0 mt-0.5 font-display text-xl font-semibold text-purple">Niveau {lvl}</p>
            <p className="m-0 text-[11px] text-muted">
              {into} / {need} XP · {xp} XP au total
            </p>
          </div>
          <div className={`rounded-[10px] border px-3 py-2.5 ${streak.activeToday ? 'glow-accent border-accent/40 bg-surface2' : 'border-line bg-surface2'}`}>
            <p className="m-0 text-[11.5px] uppercase tracking-wide text-muted">Série</p>
            <p className={`m-0 mt-0.5 font-display text-xl font-semibold ${streak.activeToday ? 'text-accent' : 'text-red'}`}>🔥 {streak.current} j</p>
            <p className="m-0 text-[11px] text-muted">Record : {streak.longest} j</p>
          </div>
          <div className={`rounded-[10px] border px-3 py-2.5 ${doneAchievements > 0 ? 'glow-green border-green/40 bg-surface2' : 'border-line bg-surface2'}`}>
            <p className="m-0 text-[11.5px] uppercase tracking-wide text-muted">Hauts faits</p>
            <p className="m-0 mt-0.5 font-display text-xl font-semibold text-green">
              {doneAchievements}/{achievements.length}
            </p>
            <p className="m-0 text-[11px] text-muted">Détails dans l'onglet Guilde</p>
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🚫 Allergies & préférences</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          Active ce que tu ne peux pas ou ne veux pas manger : remplacé automatiquement dans les recettes, le suivi des repas et la liste de courses.
        </p>
        <div className="mt-2.5 flex flex-col gap-2">
          {FOOD_SWAPS.map((swap) => {
            const on = !!data.foodSwaps?.[swap.id]
            return (
              <button
                key={swap.id}
                onClick={() => toggleFoodSwap(swap.id)}
                aria-pressed={on}
                className={`flex items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left ${on ? 'border-accent bg-surface2' : 'border-line bg-surface2'}`}
              >
                <span
                  className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 text-sm font-bold text-bg"
                  style={{ background: on ? '#FFB020' : 'transparent', borderColor: on ? '#FFB020' : '#8B93A1' }}
                >
                  {on ? '✓' : ''}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px]">{swap.label}</span>
                  <span className="block text-[11px] text-muted">
                    {on ? `Remplacé par : ${swap.replacement}` : swap.reason}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <WeightTab data={data} game={game} persist={persist} />

      <div className="mt-3 rounded-2xl border border-line bg-surface p-4 text-center">
        <button onClick={onSignOut} className="mb-2 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted">
          🚪 Se déconnecter
        </button>
        <button onClick={onDeleteClick} className={`w-full rounded-[10px] border px-4 py-2.5 text-sm ${resetArmed ? 'border-red text-red' : 'border-line text-muted'}`}>
          {resetArmed ? 'Confirmer : supprimer CE personnage et ses données ?' : 'Supprimer ce personnage'}
        </button>
      </div>
    </section>
  )
}
