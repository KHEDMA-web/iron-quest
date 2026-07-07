import { describe, expect, it } from 'vitest'
import { computeGame } from './gameCompute'
import { dayKey } from './dates'
import { computeTargets } from '../data/classes'
import { emptyChar, type CharacterData } from '../types'

function makeChar(overrides: Partial<CharacterData> = {}): CharacterData {
  const w = 80
  const h = 178
  const age = 30
  const t = computeTargets('colosse', w, h, age, 'H')
  return {
    ...emptyChar,
    profile: { pseudo: 'test', cls: 'colosse', startWeight: w, goal: 90, height: h, age, sex: 'H', days: [1, 2, 4, 5], ...t },
    startDate: new Date().toISOString(),
    weighIns: [{ date: new Date().toISOString(), weight: w }],
    ...overrides,
  }
}

describe('computeGame', () => {
  it('starts a fresh character at level 1 with no achievements done', () => {
    const game = computeGame(makeChar())
    expect(game.lvl).toBe(1)
    expect(game.xp).toBe(30) // 1 weigh-in
    expect(game.achievements.every((a) => !a.done)).toBe(true)
    expect(game.reached).toBe(false)
  })

  it('marks "Premier sang" done and reports achievement progress', () => {
    const game = computeGame(
      makeChar({
        workouts: [{ day: '2026-07-06', phase: 1, session: 'Haut A', weights: {} }],
      }),
    )
    const firstBlood = game.achievements.find((a) => a.name === 'Premier sang')!
    expect(firstBlood.done).toBe(true)
    const habitue = game.achievements.find((a) => a.name === "L'habitué")!
    expect(habitue.done).toBe(false)
    expect(habitue.current).toBe(1)
    expect(habitue.target).toBe(10)
  })

  it('reaches the goal once current weight passes it', () => {
    const game = computeGame(
      makeChar({
        weighIns: [{ date: new Date().toISOString(), weight: 91 }],
      }),
    )
    expect(game.reached).toBe(true)
    expect(game.remaining).toBe(1)
  })

  it('unlocks the first-workout achievement after logging one session', () => {
    const today = dayKey(new Date())
    const data = makeChar({ workouts: [{ day: today, phase: 1, session: 'Haut A', weights: {} }] })
    const game = computeGame(data)
    expect(game.doneToday).toBe(true)
    const firstBlood = game.achievements.find((a) => a.name === 'Premier sang')
    expect(firstBlood?.done).toBe(true)
  })

  it('keeps XP monotonic as more activity is logged', () => {
    const base = computeGame(makeChar()).xp
    const withWorkout = computeGame(makeChar({ workouts: [{ day: dayKey(new Date()), phase: 1, session: 'Haut A', weights: {} }] })).xp
    expect(withWorkout).toBeGreaterThan(base)
  })

  it('counts consecutive full training weeks as a week-streak', () => {
    const now = Date.now()
    const iso = (daysAgo: number) => dayKey(new Date(now - daysAgo * 86400000))
    // 2 workouts/week target, filled for this week and last week
    const workouts = [iso(0), iso(1), iso(7), iso(8)].map((day) => ({ day, phase: 1, session: 'Haut A', weights: {} }))
    const game = computeGame(makeChar({ workouts, profile: { ...makeChar().profile!, days: [1, 2] } }))
    expect(game.weekStreak).toBeGreaterThanOrEqual(1)
  })

  it('has zero week-streak for a fresh character', () => {
    expect(computeGame(makeChar()).weekStreak).toBe(0)
  })

  it('computes delta between the last two weigh-ins', () => {
    const now = new Date()
    const before = new Date(now.getTime() - 7 * 86400000)
    const game = computeGame(
      makeChar({
        weighIns: [
          { date: before.toISOString(), weight: 80 },
          { date: now.toISOString(), weight: 81.5 },
        ],
      }),
    )
    expect(game.delta).toBe(1.5)
  })
})
