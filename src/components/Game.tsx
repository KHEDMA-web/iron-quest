import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { CharacterData } from '../types'
import { computeGame } from '../lib/gameCompute'
import { useToasts } from '../hooks/useToasts'
import { useGameEvents } from '../hooks/useGameEvents'
import { GameHeader } from './GameHeader'
import { ToastStack } from './ToastStack'
import { LevelUpBurst } from './LevelUpBurst'
import { DayTab } from './tabs/DayTab'
import { ProgramTab } from './tabs/ProgramTab'
import { NutritionTab } from './tabs/NutritionTab'
import { GuildTab } from './tabs/GuildTab'
import { checkReminders } from '../lib/reminders'
import { isoWeek } from '../lib/dates'

// ProfileScreen tire WeightTab -> recharts (~360kB) : lazy pour ne charger ce
// poids qu'à l'ouverture du profil, pas dans le bundle initial.
const ProfileScreen = lazy(() => import('./ProfileScreen').then((m) => ({ default: m.ProfileScreen })))

const TABS = [
  ['jour', 'Jour'],
  ['prog', 'Programme'],
  ['nutri', 'Nutrition'],
  ['guilde', 'Guilde'],
] as const

type TabId = (typeof TABS)[number][0]

interface GameProps {
  data: CharacterData
  onUpdate: (next: CharacterData) => void
  onSignOut: () => void
  onDelete: () => void
  saveErr: boolean
}

export function Game({ data, onUpdate, onSignOut, onDelete, saveErr }: GameProps) {
  const [tab, setTab] = useState<TabId>('jour')
  const [resetArmed, setResetArmed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [levelUp, setLevelUp] = useState<number | null>(null)

  // data est remplacé immutablement à chaque persist : useMemo est exact ici et
  // évite de recalculer XP/projection/achievements à chaque clic d'onglet ou toast.
  const game = useMemo(() => computeGame(data), [data])
  const { toasts, push } = useToasts()
  useGameEvents(game, push, setLevelUp)

  useEffect(() => {
    void checkReminders({
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
      <LevelUpBurst level={levelUp} onDone={() => setLevelUp(null)} />
      <ToastStack toasts={toasts} />
      <GameHeader game={game} onOpenProfile={() => setProfileOpen(true)} />

      {profileOpen ? (
        <div className="mt-3">
          <Suspense fallback={<p className="p-4 text-center text-sm text-muted">Chargement…</p>}>
            <ProfileScreen
              data={data}
              game={game}
              persist={onUpdate}
              onBack={() => setProfileOpen(false)}
              onSignOut={onSignOut}
              resetArmed={resetArmed}
              onDeleteClick={() => (resetArmed ? onDelete() : setResetArmed(true))}
            />
          </Suspense>
        </div>
      ) : (
        <>
          <nav className="my-3 flex gap-1 rounded-xl bg-surface p-1" role="tablist" aria-label="Sections">
            {TABS.map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`flex-1 rounded-lg py-2.5 font-display text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${
                  tab === id ? 'bg-accent text-[#1A1A1A]' : 'bg-transparent text-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {saveErr && <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-red">Sauvegarde échouée — refais une action pour réessayer.</p>}

          <div key={tab} role="tabpanel" className="tab-panel">
            {tab === 'jour' && <DayTab data={data} game={game} persist={onUpdate} />}
            {tab === 'prog' && <ProgramTab data={data} game={game} persist={onUpdate} />}
            {tab === 'nutri' && <NutritionTab data={data} game={game} persist={onUpdate} />}
            {tab === 'guilde' && <GuildTab game={game} />}
          </div>
        </>
      )}
    </div>
  )
}
