import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { CharacterData } from '../types'
import { archOf } from '../data/classes'
import { computeGame } from '../lib/gameCompute'
import { Barbell } from './Barbell'
import { DayTab } from './tabs/DayTab'
import { LevelUpModal, XpToast } from './GameFeedback'
import { checkReminders } from '../lib/reminders'
import { isoWeek } from '../lib/dates'

const WeightTab = lazy(() => import('./tabs/WeightTab').then((m) => ({ default: m.WeightTab })))
const ProgramTab = lazy(() => import('./tabs/ProgramTab').then((m) => ({ default: m.ProgramTab })))
const NutritionTab = lazy(() => import('./tabs/NutritionTab').then((m) => ({ default: m.NutritionTab })))
const ShoppingTab = lazy(() => import('./tabs/ShoppingTab').then((m) => ({ default: m.ShoppingTab })))
const GuildTab = lazy(() => import('./tabs/GuildTab').then((m) => ({ default: m.GuildTab })))

const TABS = [
  ['jour', 'Jour'],
  ['poids', 'Poids'],
  ['prog', 'Prog'],
  ['nutri', 'Nutri'],
  ['courses', '🛒'],
  ['guilde', '⚔️'],
] as const

type TabId = (typeof TABS)[number][0]

interface GameProps {
  data: CharacterData
  onUpdate: (next: CharacterData) => void
  onSwitch: () => void
  onDelete: () => void
  saveErr: boolean
}

export function Game({ data, onUpdate, onSwitch, onDelete, saveErr }: GameProps) {
  const [tab, setTab] = useState<TabId>('jour')
  const [resetArmed, setResetArmed] = useState(false)
  const [xpPop, setXpPop] = useState<{ amount: number; key: number } | null>(null)
  const [levelUp, setLevelUp] = useState<{ lvl: number; rank: ReturnType<typeof computeGame>['rank'] } | null>(null)
  const prevRef = useRef<{ xp: number; lvl: number } | null>(null)

  const game = computeGame(data)
  const { profile, cls, rank, nextRank, lvl, into, need, current, goalDisplay, delta, week, phase, reached, dir, remaining, proj } = {
    ...game,
    goalDisplay: profileGoal(data),
  }

  useEffect(() => {
    const prev = prevRef.current
    if (prev) {
      const gained = game.xp - prev.xp
      if (gained > 0) setXpPop({ amount: gained, key: Date.now() })
      if (game.lvl > prev.lvl) setLevelUp({ lvl: game.lvl, rank: game.rank })
    }
    prevRef.current = { xp: game.xp, lvl: game.lvl }
  }, [game.xp, game.lvl, game.rank])

  useEffect(() => {
    if (!xpPop) return
    const t = setTimeout(() => setXpPop(null), 1600)
    return () => clearTimeout(t)
  }, [xpPop])

  useEffect(() => {
    checkReminders({
      dayKey: game.tk,
      weekKey: isoWeek(game.tk),
      isTrainDay: game.isTrainDay,
      doneToday: game.doneToday,
      weekWeighIn: game.weekWeighIn,
      sessionName: game.session.name,
    })
    // Au montage uniquement : les rappels concernent l'ouverture de l'app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-[520px] px-3.5 pb-10 pt-4">
      {xpPop && <XpToast key={xpPop.key} amount={xpPop.amount} />}
      {levelUp && <LevelUpModal lvl={levelUp.lvl} rank={levelUp.rank} onDismiss={() => setLevelUp(null)} />}
      <header className="px-0.5 pt-0.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border-2 border-accent bg-surface2 text-2xl" aria-hidden>
            {cls.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 font-display text-lg font-semibold">
              {profile.pseudo} <span className="text-xs font-normal text-muted">· {cls.name}</span>
            </p>
            <p className="m-0 mt-px text-xs text-accent">
              {rank.icon} {rank.name} · Niveau {lvl}
              {game.streak > 0 && (
                <span className="whitespace-nowrap text-red"> · 🔥 {game.streak} sem.</span>
              )}
              {nextRank && <span className="whitespace-nowrap text-muted"> · {nextRank.name} au niv. {nextRank.min}</span>}
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-valuenow={into} aria-valuemax={need} aria-label="Progression du niveau">
              <div className="h-full bg-purple transition-[width] duration-200" style={{ width: `${(into / need) * 100}%` }} />
            </div>
            <p className="m-0 mt-0.5 text-[10.5px] text-muted">
              {into} / {need} XP → niv. {lvl + 1}
            </p>
          </div>
          <div className="text-right">
            <p className="m-0 font-display text-2xl font-bold">{current.toFixed(1)}</p>
            <p className="m-0 text-[10.5px] text-muted">kg · obj. {goalDisplay}</p>
            {delta !== null && (
              <p className={`m-0 text-[11px] ${(dir >= 0 ? delta >= 0 : delta <= 0) ? 'text-green' : 'text-red'}`}>
                {delta >= 0 ? '+' : ''}
                {delta} kg
              </p>
            )}
          </div>
        </div>

        <div className="mt-1.5 text-center">
          <Barbell pct={game.barbellPct} label={game.barbellLabel} />
          <p className="m-0 mb-0.5 text-[11.5px] text-muted">
            {reached ? (
              <b className="text-green">🏆 QUÊTE PRINCIPALE ACCOMPLIE — {goalDisplay} kg atteints ! Fixe-toi un nouvel objectif.</b>
            ) : dir === 0 ? (
              `Semaine ${week} · Phase ${phase.id} (${phase.title}) — ta quête : la constance`
            ) : (
              <>
                Semaine {week} · Phase {phase.id} ({phase.title}) — encore <b className="text-accent">{remaining} kg</b>{' '}
                {archOf(profile.cls).verb}
                {proj?.date && <> · arrivée ≈ {proj.date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</>}
              </>
            )}
          </p>
        </div>
      </header>

      <nav className="my-3 flex gap-1 rounded-xl bg-surface p-1">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-lg py-2.5 font-display text-xs font-semibold uppercase tracking-wide ${
              tab === id ? 'bg-accent text-[#1A1A1A]' : 'bg-transparent text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {saveErr && <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-red">Sauvegarde échouée — refais une action pour réessayer.</p>}

      {tab === 'jour' && <DayTab data={data} game={game} persist={onUpdate} />}
      <Suspense fallback={<p className="p-4 text-center text-sm text-muted">Chargement…</p>}>
        {tab === 'poids' && <WeightTab data={data} game={game} persist={onUpdate} />}
        {tab === 'prog' && (
          <ProgramTab
            data={data}
            game={game}
            persist={onUpdate}
            onSwitch={onSwitch}
            resetArmed={resetArmed}
            onDeleteClick={() => (resetArmed ? onDelete() : setResetArmed(true))}
          />
        )}
        {tab === 'nutri' && <NutritionTab game={game} />}
        {tab === 'courses' && <ShoppingTab data={data} game={game} persist={onUpdate} />}
        {tab === 'guilde' && <GuildTab game={game} />}
      </Suspense>
    </div>
  )
}

function profileGoal(data: CharacterData) {
  return data.profile!.goal
}
