import type { CharacterData, Meal, Phase, Rank, Session } from '../types'
import { CLASSES } from '../data/classes'
import { MENUS } from '../data/menus'
import { SHOPPING } from '../data/shopping'
import { currentPhase, dayKey, isoWeek, weeksSince } from './dates'
import { computeXp, levelFromXp, RANKS, rankOf, XP } from './xp'
import { projection, type Projection } from './projection'

export interface Quest {
  name: string
  done: boolean
  xp: string
}

export interface Achievement {
  icon: string
  name: string
  desc: string
  done: boolean
}

export interface GameCompute {
  profile: NonNullable<CharacterData['profile']>
  cls: (typeof CLASSES)[keyof typeof CLASSES]
  trainDays: number[]
  weeklyTarget: number
  week: number
  phase: Phase
  tk: string
  dow: number
  isTrainDay: boolean
  doneToday: boolean
  session: Session
  current: number
  delta: number | null
  dir: number
  proj: Projection | null
  remaining: number
  reached: boolean
  xp: number
  lvl: number
  into: number
  need: number
  rank: Rank
  nextRank: Rank | undefined
  barbellPct: number
  barbellLabel: string
  meals: Meal[]
  mealsToday: Record<string, boolean>
  weekWorkouts: number
  weekWeighIn: boolean
  perfectToday: boolean
  shopWeek: string
  shopChecked: Record<string, boolean>
  shopTotal: number
  shopDone: number
  achievements: Achievement[]
  quests: Quest[]
}

export function applyExoName(data: CharacterData, name: string): string {
  return data.exoSwaps[name] || name
}

export function getMeal(data: CharacterData, dayIdx: number, m: Meal): Meal {
  const ov = data.mealOverrides[`${dayIdx}-${m.id}`]
  return ov ? { ...m, ...ov } : m
}

export function computeGame(data: CharacterData): GameCompute {
  const profile = data.profile!
  const cls = CLASSES[profile.cls]
  const trainDays = profile.days
  const weeklyTarget = trainDays.length

  const startW = profile.startWeight
  const goal = profile.goal
  const dir = Math.abs(goal - startW) < 0.5 ? 0 : Math.sign(goal - startW)

  const week = weeksSince(data.startDate!)
  const phase = currentPhase(week)
  const today = new Date()
  const tk = dayKey(today)
  const dow = today.getDay()
  const isTrainDay = trainDays.includes(dow)
  const doneToday = data.workouts.some((w) => w.day === tk)
  const phaseCount = data.workouts.filter((w) => w.phase === phase.id).length
  const session = phase.sessions[phaseCount % 4]

  const last = data.weighIns[data.weighIns.length - 1]
  const current = last ? last.weight : startW
  const prevW = data.weighIns[data.weighIns.length - 2]
  const delta = prevW ? Math.round((current - prevW.weight) * 10) / 10 : null
  const proj = projection(data.weighIns, goal, dir)
  const remaining = Math.round(Math.abs(goal - current) * 10) / 10
  const reached = dir !== 0 && (dir > 0 ? current >= goal : current <= goal)

  const { xp, perfectDays, fullWeeks } = computeXp(data, weeklyTarget)
  const { lvl, into, need } = levelFromXp(xp)
  const rank = rankOf(lvl)
  const nextRank = RANKS.find((r) => r.min > lvl)

  const barbellPct = dir === 0 ? into / need : Math.abs(current - startW) / Math.abs(goal - startW)
  const barbellLabel =
    dir === 0
      ? `NIVEAU ${lvl}`
      : `${Math.abs(Math.round((current - startW) * 10) / 10)} / ${Math.abs(Math.round((goal - startW) * 10) / 10)} KG`

  const meals = MENUS[dow].meals.map((m) => getMeal(data, dow, m))
  const mealsToday = data.meals[tk] || {}

  const shopWeek = `S${week}`
  const shopChecked = data.shopping[shopWeek] || {}
  const shopTotal = SHOPPING.reduce((s, [, items]) => s + items.length, 0)
  const shopDone = Object.values(shopChecked).filter(Boolean).length

  const wkIso = isoWeek(tk)
  const weekWorkouts = data.workouts.filter((w) => isoWeek(w.day) === wkIso).length
  const weekWeighIn = data.weighIns.some((w) => isoWeek(w.date.slice(0, 10)) === wkIso)
  const perfectToday = meals.every((m) => mealsToday[m.id])

  const achievements: Achievement[] = [
    { icon: '🩸', name: 'Premier sang', desc: 'Première séance terminée', done: data.workouts.length >= 1 },
    { icon: '🔟', name: "L'habitué", desc: '10 séances', done: data.workouts.length >= 10 },
    { icon: '🏋️', name: 'Machine de guerre', desc: '50 séances', done: data.workouts.length >= 50 },
    { icon: '💯', name: 'Vétéran du fer', desc: '100 séances', done: data.workouts.length >= 100 },
    { icon: '📅', name: 'Semaine parfaite', desc: `Une semaine à ${weeklyTarget}/${weeklyTarget} séances`, done: fullWeeks >= 1 },
    { icon: '🗓️', name: 'Le métronome', desc: '5 semaines parfaites', done: fullWeeks >= 5 },
    { icon: '🍽️', name: 'Discipline de moine', desc: '10 journées nutrition parfaites', done: perfectDays >= 10 },
    { icon: '⚖️', name: 'Suivi sérieux', desc: '8 pesées enregistrées', done: data.weighIns.length >= 8 },
    { icon: '🥈', name: 'Guerrier', desc: 'Atteindre le niveau 7', done: lvl >= 7 },
    { icon: '💎', name: 'Champion', desc: 'Atteindre le niveau 16', done: lvl >= 16 },
    { icon: '🏆', name: 'Quête accomplie', desc: `Atteindre ${goal} kg`, done: reached },
  ]

  const quests: Quest[] = [
    { name: `Séances de la semaine (${weekWorkouts}/${weeklyTarget})`, done: weekWorkouts >= weeklyTarget, xp: `+${XP.fullWeek} XP bonus` },
    { name: `Pesée hebdo ${weekWeighIn ? '(faite)' : '(à faire)'}`, done: weekWeighIn, xp: `+${XP.weighIn} XP` },
    {
      name: `Journée nutrition parfaite ${perfectToday ? '(faite)' : `(${Object.values(mealsToday).filter(Boolean).length}/${meals.length})`}`,
      done: perfectToday,
      xp: `+${XP.perfectDay} XP bonus`,
    },
  ]

  return {
    profile, cls, trainDays, weeklyTarget, week, phase, tk, dow, isTrainDay, doneToday, session,
    current, delta, dir, proj, remaining, reached, xp, lvl, into, need, rank, nextRank,
    barbellPct, barbellLabel, meals, mealsToday, weekWorkouts, weekWeighIn, perfectToday,
    shopWeek, shopChecked, shopTotal, shopDone, achievements, quests,
  }
}
