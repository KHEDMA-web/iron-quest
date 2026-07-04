import type { CharacterData, Rank } from '../types'
import { isoWeek } from './dates'

export const RANKS: Rank[] = [
  { min: 1, name: 'Recrue', icon: '🌱' },
  { min: 4, name: 'Soldat', icon: '🥉' },
  { min: 7, name: 'Guerrier', icon: '🥈' },
  { min: 11, name: 'Gladiateur', icon: '🥇' },
  { min: 16, name: 'Champion', icon: '💎' },
  { min: 22, name: 'Maître', icon: '⚡' },
  { min: 30, name: 'Légende', icon: '🐉' },
]

export const rankOf = (lvl: number): Rank => [...RANKS].reverse().find((r) => lvl >= r.min)!

export const XP = { workout: 50, meal: 5, perfectDay: 20, weighIn: 30, fullWeek: 100 }

export function levelFromXp(xp: number) {
  let lvl = 1
  let need = 150
  let rest = xp
  while (rest >= need && lvl < 60) {
    rest -= need
    lvl++
    need = 150 + 50 * (lvl - 1)
  }
  return { lvl, into: rest, need }
}

/** L'XP est dérivée des données, jamais stockée (anti-farming). */
export function computeXp(d: CharacterData, weeklyTarget: number) {
  let xp = 0
  xp += d.workouts.length * XP.workout
  xp += d.weighIns.length * XP.weighIn
  let mealChecks = 0
  let perfectDays = 0
  Object.values(d.meals).forEach((day) => {
    const n = Object.values(day).filter(Boolean).length
    mealChecks += n
    if (n >= 4) perfectDays++
  })
  xp += mealChecks * XP.meal + perfectDays * XP.perfectDay
  const byWeek: Record<string, number> = {}
  d.workouts.forEach((w) => {
    const k = isoWeek(w.day)
    byWeek[k] = (byWeek[k] || 0) + 1
  })
  const fullWeeks = Object.values(byWeek).filter((n) => n >= weeklyTarget).length
  xp += fullWeeks * XP.fullWeek
  return { xp, perfectDays, fullWeeks }
}
