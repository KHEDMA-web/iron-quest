import { describe, expect, it } from 'vitest'
import { computeXp, levelFromXp, rankOf, RANKS, XP } from './xp'
import { emptyChar } from '../types'

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

describe('rankOf', () => {
  it('picks the highest rank reached', () => {
    expect(rankOf(1).name).toBe('Recrue')
    expect(rankOf(6).name).toBe('Soldat')
    expect(rankOf(30).name).toBe('Légende')
    expect(rankOf(1000).name).toBe(RANKS[RANKS.length - 1].name)
  })
})

describe('computeXp', () => {
  it('is zero for a fresh character', () => {
    const { xp, perfectDays, fullWeeks, streakMilestones } = computeXp(emptyChar, 4)
    expect(xp).toBe(0)
    expect(perfectDays).toBe(0)
    expect(fullWeeks).toBe(0)
    expect(streakMilestones).toBe(0)
  })

  it('awards xp for workouts and weigh-ins', () => {
    const data = {
      ...emptyChar,
      workouts: [{ day: '2026-01-01', phase: 1, session: 'UA', weights: {} }],
      weighIns: [{ date: '2026-01-01T08:00:00Z', weight: 80 }],
    }
    const { xp } = computeXp(data, 4)
    expect(xp).toBe(XP.workout + XP.weighIn)
  })

  it('awards a perfect-day bonus once 4+ meals are checked in a day', () => {
    const data = { ...emptyChar, meals: { '2026-01-01': { b: true, l: true, s: true, d: true } } }
    const { xp, perfectDays } = computeXp(data, 4)
    expect(perfectDays).toBe(1)
    expect(xp).toBe(4 * XP.meal + XP.perfectDay)
  })
})
