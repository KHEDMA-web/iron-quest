import { useState } from 'react'
import { dayKey, monthCells } from '../lib/dates'

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

interface CalendarMonthProps {
  workoutDays: Set<string>
  trainDays: number[]
  todayKey: string
}

/** Dashboard du mois : navigue mois par mois, un point par jour (séance faite / prévue / off). */
export function CalendarMonth({ workoutDays, trainDays, todayKey }: CalendarMonthProps) {
  const [viewed, setViewed] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  const cells = monthCells(viewed)
  const monthLabel = viewed.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const shiftMonth = (delta: number) =>
    setViewed((v) => {
      const next = new Date(v)
      next.setMonth(next.getMonth() + delta)
      return next
    })

  return (
    <div className="glow-accent mb-3 rounded-2xl border border-accent/40 bg-surface p-4">
      <div className="flex items-center justify-between">
        <button onClick={() => shiftMonth(-1)} aria-label="Mois précédent" className="h-8 w-8 rounded-lg border border-line text-muted transition-colors duration-150 hover:border-accent/60">
          ‹
        </button>
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide capitalize">📅 {monthLabel}</p>
        <button onClick={() => shiftMonth(1)} aria-label="Mois suivant" className="h-8 w-8 rounded-lg border border-line text-muted transition-colors duration-150 hover:border-accent/60">
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-y-1.5 text-center">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} className="text-[10.5px] uppercase tracking-wide text-muted">
            {label}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={i} />
          const key = dayKey(date)
          const isTrainDay = trainDays.includes(date.getDay())
          const done = workoutDays.has(key)
          const isToday = key === todayKey
          return (
            <div key={i} className={`flex flex-col items-center gap-1 rounded-lg py-1 ${isToday ? 'border border-accent bg-surface2' : ''}`}>
              <span className={`text-[12px] ${isToday ? 'font-semibold text-accent' : 'text-ink'}`}>{date.getDate()}</span>
              <span
                title={done ? 'Séance faite' : isTrainDay ? 'Séance prévue' : 'Jour off'}
                className={`h-1.5 w-1.5 rounded-full ${done ? 'glow-green bg-green' : isTrainDay ? 'border border-accent' : 'bg-line'}`}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-3 text-[10.5px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green" /> séance faite
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full border border-accent" /> prévue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-line" /> off
        </span>
      </div>
    </div>
  )
}
