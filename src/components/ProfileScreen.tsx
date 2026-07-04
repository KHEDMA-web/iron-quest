import type { CharacterData } from '../types'
import type { GameCompute } from '../lib/gameCompute'
import { WeightTab } from './tabs/WeightTab'

interface ProfileScreenProps {
  data: CharacterData
  game: GameCompute
  persist: (next: CharacterData) => void
  onBack: () => void
  onSwitch: () => void
  resetArmed: boolean
  onDeleteClick: () => void
}

export function ProfileScreen({ data, game, persist, onBack, onSwitch, resetArmed, onDeleteClick }: ProfileScreenProps) {
  const { rank, nextRank, lvl, into, need, xp, streak, achievements } = game
  const doneAchievements = achievements.filter((a) => a.done).length

  return (
    <section>
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm text-muted">
        <span aria-hidden>‹</span> Retour
      </button>

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

      <WeightTab data={data} game={game} persist={persist} />

      <div className="mt-3 rounded-2xl border border-line bg-surface p-4 text-center">
        <button onClick={onSwitch} className="mb-2 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted">
          👥 Changer de personnage
        </button>
        <button onClick={onDeleteClick} className={`w-full rounded-[10px] border px-4 py-2.5 text-sm ${resetArmed ? 'border-red text-red' : 'border-line text-muted'}`}>
          {resetArmed ? 'Confirmer : supprimer CE personnage et ses données ?' : 'Supprimer ce personnage'}
        </button>
      </div>
    </section>
  )
}
