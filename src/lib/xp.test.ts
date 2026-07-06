import { describe, expect, it } from 'vitest'
import { computeXp, levelFromXp, rankOf, XP } from './xp'
import { emptyChar } from '../types'

describe('rankOf', () => {
  it('returns Recrue below level 4', () => {
    expect(rankOf(1).name).toBe('Recrue')
    expect(rankOf(3).name).toBe('Recrue')
  })

  it('returns the highest rank whose threshold is met', () => {
    expect(rankOf(4).name).toBe('Soldat')
    expect(rankOf(10).name).toBe('Guerrier')
    expect(rankOf(30).name).toBe('Légende')
    expect(rankOf(99).name).toBe('Légende')
  })
})

describe('levelFromXp', () => {
  it('starts at level 1 with 150 xp needed', () => {
    expect(levelFromXp(0)).toEqual({ lvl: 1, into: 0, need: 150 })
  })

  it('levels up once the threshold is crossed', () => {
    expect(levelFromXp(150)).toEqual({ lvl: 2, into: 0, need: 200 })
    expect(levelFromXp(149)).toEqual({ lvl: 1, into: 149, need: 150 })
  })

  it('caps at level 60', () => {
    expect(levelFromXp(1_000_000).lvl).toBe(60)
  })
})

describe('computeXp', () => {
  it('is zero for a fresh character', () => {
    expect(computeXp(emptyChar, 4)).toEqual({ xp: 0, perfectDays: 0, fullWeeks: 0 })
  })

  it('sums workout and weigh-in xp', () => {
    const data = {
      ...emptyChar,
      workouts: [
        { day: '2026-07-06', phase: 1, session: 'Haut A', weights: {} },
        { day: '2026-07-07', phase: 1, session: 'Bas A', weights: {} },
      ],
      weighIns: [{ date: '2026-07-06T00:00:00.000Z', weight: 80 }],
    }
    const { xp } = computeXp(data, 4)
    expect(xp).toBe(2 * XP.workout + 1 * XP.weighIn)
  })

  it('counts a perfect day once 4+ meals are checked', () => {
    const data = {
      ...emptyChar,
      meals: { '2026-07-06': { a: true, b: true, c: true, d: true } },
    }
    const { xp, perfectDays } = computeXp(data, 4)
    expect(perfectDays).toBe(1)
    expect(xp).toBe(4 * XP.meal + XP.perfectDay)
  })

  it('awards a full-week bonus once workouts in a week reach the target', () => {
    const data = {
      ...emptyChar,
      workouts: [
        { day: '2026-07-06', phase: 1, session: 'Haut A', weights: {} },
        { day: '2026-07-07', phase: 1, session: 'Bas A', weights: {} },
      ],
    }
    const { fullWeeks } = computeXp(data, 2)
    expect(fullWeeks).toBe(1)
  })
})
