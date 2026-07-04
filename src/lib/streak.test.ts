import { describe, expect, it } from 'vitest'
import { computeStreak, streakMilestonesReached } from './streak'
import { emptyChar } from '../types'
import { dayKey } from './dates'

const dayBefore = (base: Date, n: number) => {
  const d = new Date(base)
  d.setDate(d.getDate() - n)
  return d
}

describe('computeStreak', () => {
  it('is zero for a character with no activity', () => {
    const s = computeStreak(emptyChar)
    expect(s).toEqual({ current: 0, longest: 0, activeToday: false })
  })

  it('counts consecutive days ending today', () => {
    const today = new Date()
    const data = {
      ...emptyChar,
      workouts: [0, 1, 2].map((n) => ({ day: dayKey(dayBefore(today, n)), phase: 1, session: 'UA', weights: {} })),
    }
    const s = computeStreak(data, today)
    expect(s.current).toBe(3)
    expect(s.longest).toBe(3)
    expect(s.activeToday).toBe(true)
  })

  it('grants a one-day grace period when today has no activity yet', () => {
    const today = new Date()
    const data = {
      ...emptyChar,
      workouts: [1, 2, 3].map((n) => ({ day: dayKey(dayBefore(today, n)), phase: 1, session: 'UA', weights: {} })),
    }
    const s = computeStreak(data, today)
    expect(s.activeToday).toBe(false)
    expect(s.current).toBe(3)
  })

  it('breaks the streak on a gap day', () => {
    const today = new Date()
    const data = {
      ...emptyChar,
      workouts: [0, 1, 3, 4].map((n) => ({ day: dayKey(dayBefore(today, n)), phase: 1, session: 'UA', weights: {} })),
    }
    const s = computeStreak(data, today)
    expect(s.current).toBe(2)
    expect(s.longest).toBe(2)
  })

  it('remembers the longest streak even after it has been broken', () => {
    const today = new Date()
    const data = {
      ...emptyChar,
      workouts: [0, 10, 11, 12, 13, 14].map((n) => ({ day: dayKey(dayBefore(today, n)), phase: 1, session: 'UA', weights: {} })),
    }
    const s = computeStreak(data, today)
    expect(s.current).toBe(1)
    expect(s.longest).toBe(5)
  })

  it('counts weigh-ins and checked meals as activity', () => {
    const today = new Date()
    const yesterday = dayBefore(today, 1)
    const data = {
      ...emptyChar,
      weighIns: [{ date: yesterday.toISOString(), weight: 80 }],
      meals: { [dayKey(today)]: { b: true } },
    }
    const s = computeStreak(data, today)
    expect(s.current).toBe(2)
  })
})

describe('streakMilestonesReached', () => {
  it('counts how many milestones a longest streak has cleared', () => {
    expect(streakMilestonesReached(0)).toBe(0)
    expect(streakMilestonesReached(3)).toBe(1)
    expect(streakMilestonesReached(10)).toBe(2)
    expect(streakMilestonesReached(100)).toBe(6)
    expect(streakMilestonesReached(1000)).toBe(6)
  })
})
