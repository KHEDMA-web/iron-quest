import { describe, expect, it } from 'vitest'
import { computeGame } from './gameCompute'
import { emptyChar, type CharacterData, type Profile } from '../types'
import { dayKey } from './dates'

const profile: Profile = {
  pseudo: 'testeur', cls: 'colosse', startWeight: 80, goal: 90, height: 180, age: 28, sex: 'H', days: [1, 3, 5], kcal: 2800, prot: 160,
}

function freshCharacter(overrides: Partial<CharacterData> = {}): CharacterData {
  return { ...emptyChar, profile, startDate: new Date().toISOString(), weighIns: [{ date: new Date().toISOString(), weight: 80 }], ...overrides }
}

describe('computeGame', () => {
  it('computes a coherent snapshot for a brand new character', () => {
    const game = computeGame(freshCharacter())
    expect(game.week).toBe(1)
    expect(game.phase.id).toBe(1)
    expect(game.lvl).toBe(1)
    expect(game.current).toBe(80)
    expect(game.dir).toBe(1)
    expect(game.remaining).toBe(10)
    expect(game.reached).toBe(false)
    expect(game.streak.current).toBeGreaterThanOrEqual(0)
  })

  it('marks the main quest as reached once the goal weight is crossed', () => {
    const data = freshCharacter({ weighIns: [{ date: new Date().toISOString(), weight: 91 }] })
    const game = computeGame(data)
    expect(game.reached).toBe(true)
    expect(game.remaining).toBe(1)
  })

  it('unlocks the first-workout achievement after logging one session', () => {
    const today = dayKey(new Date())
    const data = freshCharacter({ workouts: [{ day: today, phase: 1, session: 'UA', weights: { 'Développé couché haltères': 40 } }] })
    const game = computeGame(data)
    expect(game.doneToday).toBe(true)
    const firstBlood = game.achievements.find((a) => a.name === 'Premier sang')
    expect(firstBlood?.done).toBe(true)
  })

  it('keeps XP monotonic as more activity is logged', () => {
    const base = computeGame(freshCharacter()).xp
    const withWorkout = computeGame(freshCharacter({ workouts: [{ day: dayKey(new Date()), phase: 1, session: 'UA', weights: {} }] })).xp
    expect(withWorkout).toBeGreaterThan(base)
  })
})
