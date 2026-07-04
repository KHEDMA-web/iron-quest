import type { CharacterData } from '../types'
import { dayKey } from './dates'

/** Paliers de série (jours consécutifs actifs) qui débloquent un bonus d'XP, une fois chacun. */
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const

export interface Streak {
  /** Série en cours (aujourd'hui inclus si actif aujourd'hui, sinon tolérance d'un jour = hier). */
  current: number
  /** Plus longue série jamais réalisée (sert aux paliers/achievements, ne peut jamais reculer). */
  longest: number
  activeToday: boolean
}

/** Jours (clé YYYY-MM-DD) où le joueur a fait au moins une action : séance, repas coché, pesée. */
export function activeDayKeys(d: CharacterData): Set<string> {
  const days = new Set<string>()
  d.workouts.forEach((w) => days.add(w.day))
  d.weighIns.forEach((w) => days.add(dayKey(new Date(w.date))))
  Object.entries(d.meals).forEach(([day, checks]) => {
    if (Object.values(checks).some(Boolean)) days.add(day)
  })
  return days
}

export function computeStreak(d: CharacterData, today: Date = new Date()): Streak {
  const days = activeDayKeys(d)
  const activeToday = days.has(dayKey(today))

  const cursor = new Date(today)
  if (!activeToday) cursor.setDate(cursor.getDate() - 1)
  let current = 0
  while (days.has(dayKey(cursor))) {
    current++
    cursor.setDate(cursor.getDate() - 1)
  }

  const sorted = [...days].sort()
  let longest = 0
  let run = 0
  let prev: Date | null = null
  for (const key of sorted) {
    const dt = new Date(key)
    run = prev && Math.round((dt.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1
    longest = Math.max(longest, run)
    prev = dt
  }

  return { current, longest: Math.max(longest, current), activeToday }
}

export function streakMilestonesReached(longest: number): number {
  return STREAK_MILESTONES.filter((m) => longest >= m).length
}
