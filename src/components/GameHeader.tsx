import type { GameCompute } from '../lib/gameCompute'
import { archOf } from '../data/classes'
import { Barbell } from './Barbell'

interface GameHeaderProps {
  game: GameCompute
  onOpenProfile: () => void
}

export function GameHeader({ game, onOpenProfile }: GameHeaderProps) {
  const { profile, cls, rank, nextRank, lvl, into, need, current, delta, dir, week, phase, reached, remaining, proj, streak } = game
  const goalDisplay = profile.goal

  return (
    <header className="px-0.5 pt-0.5">
      <button onClick={onOpenProfile} aria-label="Voir ton profil et ton poids" className="flex w-full items-center gap-2.5 rounded-2xl text-left transition-opacity duration-150 active:opacity-80">
        <div className="glow-accent flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border-2 border-accent bg-surface2 text-2xl" aria-hidden>
          {cls.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="m-0 font-display text-lg font-semibold">
            {profile.pseudo} <span className="text-xs font-normal text-muted">· {cls.name}</span>
          </p>
          <p className="m-0 mt-px flex flex-wrap items-baseline gap-x-1.5 text-xs text-accent">
            <span>
              {rank.icon} {rank.name} · Niveau {lvl}
            </span>
            {nextRank && <span className="text-muted">· {nextRank.name} au niv. {nextRank.min}</span>}
            {streak.current > 0 && (
              <span
                className={streak.activeToday ? 'pulse-glow rounded px-1 text-accent' : 'text-red'}
                title={streak.activeToday ? 'Série active — fais une action aujourd\'hui pour la garder demain.' : 'Série en danger : fais une action aujourd\'hui !'}
              >
                · 🔥 {streak.current} j
              </span>
            )}
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-valuenow={into} aria-valuemax={need} aria-label="Progression du niveau">
            <div className="glow-purple h-full bg-purple transition-[width] duration-300" style={{ width: `${(into / need) * 100}%` }} />
          </div>
          <p className="m-0 mt-0.5 text-[10.5px] text-muted">
            {into} / {need} XP → niv. {lvl + 1}
          </p>
        </div>
        <div className="flex items-center gap-1 text-right">
          <div>
            <p className="m-0 font-display text-2xl font-bold">{current.toFixed(1)}</p>
            <p className="m-0 text-[10.5px] text-muted">kg · obj. {goalDisplay}</p>
            {delta !== null && (
              <p className={`m-0 text-[11px] ${(dir >= 0 ? delta >= 0 : delta <= 0) ? 'text-green' : 'text-red'}`}>
                {delta >= 0 ? '+' : ''}
                {delta} kg
              </p>
            )}
          </div>
          <span className="text-lg text-muted" aria-hidden>
            ›
          </span>
        </div>
      </button>

      <div className="mt-1.5 text-center">
        <Barbell pct={game.barbellPct} label={game.barbellLabel} />
        <p className="m-0 mb-0.5 text-[11.5px] text-muted">
          {reached ? (
            <b className="text-green">🏆 QUÊTE PRINCIPALE ACCOMPLIE — {goalDisplay} kg atteints ! Fixe-toi un nouvel objectif.</b>
          ) : dir === 0 ? (
            `Semaine ${week} · Phase ${phase.id} (${phase.title}) — ta quête : la constance`
          ) : (
            <>
              Semaine {week} · Phase {phase.id} ({phase.title}) — encore <b className="text-accent">{remaining} kg</b> {archOf(profile.cls).verb}
              {proj?.date && <> · arrivée ≈ {proj.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</>}
            </>
          )}
        </p>
      </div>
    </header>
  )
}
