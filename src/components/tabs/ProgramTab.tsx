import { useRef, useState } from 'react'
import type { CharacterData } from '../../types'
import type { GameCompute } from '../../lib/gameCompute'
import { applyExoName } from '../../lib/gameCompute'
import { PHASES } from '../../data/phases'
import { DAYS_FR } from '../../lib/dates'
import { CalendarMonth } from '../CalendarMonth'
import { exportCharacter, parseImportedCharacter } from '../../lib/storage'
import { disableReminders, enableReminders, remindersEnabled, remindersSupported } from '../../lib/reminders'

interface ProgramTabProps {
  data: CharacterData
  game: GameCompute
  persist: (next: CharacterData) => void
}

export function ProgramTab({ data, game, persist }: ProgramTabProps) {
  const { cls, phase, trainDays, weeklyTarget, tk } = game
  const fileRef = useRef<HTMLInputElement>(null)
  const [importErr, setImportErr] = useState('')
  const [remindersOn, setRemindersOn] = useState(remindersEnabled())
  const [remindersMsg, setRemindersMsg] = useState('')

  const toggleReminders = async () => {
    if (remindersOn) {
      disableReminders()
      setRemindersOn(false)
      setRemindersMsg('')
    } else {
      const ok = await enableReminders()
      setRemindersOn(ok)
      setRemindersMsg(ok ? '' : 'Notifications refusées par le navigateur — vérifie les réglages du site.')
    }
  }

  const clearSwap = (orig: string) => {
    const next = { ...data.exoSwaps }
    delete next[orig]
    persist({ ...data, exoSwaps: next })
  }

  const workoutDays = new Set(data.workouts.map((w) => w.day))

  const onImportFile = async (file: File) => {
    const result = parseImportedCharacter(await file.text())
    if (typeof result === 'string') return setImportErr(result)
    setImportErr('')
    persist(result)
  }

  return (
    <section>
      <CalendarMonth workoutDays={workoutDays} trainDays={trainDays} todayKey={tk} />

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

      {remindersSupported() && (
        <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
          <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🔔 Rappels</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
            À l'ouverture de l'appli : rappel de séance les jours d'entraînement et rappel de pesée hebdo. Rien d'autre, promis.
          </p>
          <button
            onClick={toggleReminders}
            aria-pressed={remindersOn}
            className={`mt-2.5 w-full rounded-[10px] border px-4 py-2.5 text-sm ${remindersOn ? 'border-accent text-accent' : 'border-line text-muted'}`}
          >
            {remindersOn ? '🔔 Rappels activés — toucher pour désactiver' : '🔕 Activer les rappels'}
          </button>
          {remindersMsg && <p className="mt-1.5 text-[12.5px] text-red">{remindersMsg}</p>}
        </div>
      )}

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">💾 Sauvegarde</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          Ta progression est stockée sur CET appareil. Exporte-la régulièrement (changement de téléphone, réinstallation…).
        </p>
        <div className="mt-2.5 flex gap-2">
          <button onClick={() => exportCharacter(data)} className="flex-1 rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted">
            ⬇️ Exporter
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted">
            ⬆️ Importer
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void onImportFile(f)
              e.target.value = ''
            }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted">L'import remplace toutes les données de ce personnage par celles du fichier.</p>
        {importErr && <p className="mt-1.5 text-[12.5px] text-red">{importErr}</p>}
      </div>
    </section>
  )
}
