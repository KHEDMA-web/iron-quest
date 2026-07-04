import type { CharacterData } from '../../types'
import type { GameCompute } from '../../lib/gameCompute'
import { applyExoName } from '../../lib/gameCompute'
import { PHASES } from '../../data/phases'
import { DAYS_FR } from '../../lib/dates'

interface ProgramTabProps {
  data: CharacterData
  game: GameCompute
  persist: (next: CharacterData) => void
  onSwitch: () => void
  resetArmed: boolean
  onDeleteClick: () => void
}

export function ProgramTab({ data, game, persist, onSwitch, resetArmed, onDeleteClick }: ProgramTabProps) {
  const { cls, phase, trainDays, weeklyTarget } = game

  const clearSwap = (orig: string) => {
    const next = { ...data.exoSwaps }
    delete next[orig]
    persist({ ...data, exoSwaps: next })
  }

  return (
    <section>
      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">Ton plan sur la durée</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          {weeklyTarget} séances/semaine : <b className="text-ink">{trainDays.map((d) => DAYS_FR[d]).join(' · ')}</b>. Rotation automatique des séances. ⇄ le jour J pour remplacer un exercice.
          {cls.arch === 'seche' && " Le programme de muscu reste identique en sèche : c'est en soulevant lourd qu'on garde le muscle."}
          {cls.extra && ` ${cls.emoji} Mission ${cls.name} : ${cls.extra}`}
        </p>
        {Object.keys(data.exoSwaps).length > 0 && (
          <div className="mt-2.5">
            <p className="m-0 mb-1 border-b border-line pb-1 font-display text-[13px] uppercase tracking-wide text-muted">Tes remplacements actifs</p>
            {Object.entries(data.exoSwaps).map(([o, r]) => (
              <div key={o} className="flex items-center justify-between gap-2.5 py-1.5">
                <span className="text-[12.5px] text-muted">
                  {o} → <b className="text-ink">{r}</b>
                </span>
                <button onClick={() => clearSwap(o)} aria-label={`Rétablir ${o}`} className="bg-transparent px-1.5 py-0.5 text-sm text-muted">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {PHASES.map((p) => {
        const activeP = p.id === phase.id
        return (
          <div key={p.id} className={`mb-3 rounded-2xl border p-4 ${activeP ? 'border-accent' : 'border-line'} bg-surface`}>
            <p className="m-0 mb-0.5 font-display text-[11.5px] font-semibold tracking-[2.5px] text-accent">
              PHASE {p.id} · SEMAINES {p.from}
              {p.to < 999 ? `–${p.to}` : '+'} {activeP && '· EN COURS ✦'}
            </p>
            <p className="m-0 mb-1.5 font-display text-xl font-semibold">{p.title}</p>
            <p className="m-0 mb-2.5 text-[12.5px] leading-relaxed text-muted">{p.intro}</p>
            {p.sessions.map((s) => (
              <div key={s.key} className="mb-2.5">
                <p className="m-0 mb-1 border-b border-line pb-1 font-display text-[13px] uppercase tracking-wide text-muted">{s.name}</p>
                {s.exos.map(([exo, sets, rest]) => (
                  <div key={exo} className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[13.5px]">{applyExoName(data, exo)}</span>
                    <span className="whitespace-nowrap font-display text-xs text-accent">
                      {sets} · {rest}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      })}

      <div className="rounded-2xl border border-line bg-surface p-4 text-center">
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
