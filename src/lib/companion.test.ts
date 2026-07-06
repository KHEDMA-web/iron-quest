import { describe, expect, it } from 'vitest'
import { companionMood, companionStage, nextCompanionStage } from './companion'
import type { Streak } from './streak'

const streak = (partial: Partial<Streak>): Streak => ({ current: 0, longest: 0, activeToday: false, ...partial })

describe('companionStage', () => {
  it('starts as an egg at level 1', () => {
    expect(companionStage(1).name).toBe('Œuf mystérieux')
    expect(companionStage(3).name).toBe('Œuf mystérieux')
  })

  it('evolves at each level threshold', () => {
    expect(companionStage(4).name).toBe('Poussin téméraire')
    expect(companionStage(7).name).toBe('Renardeau')
    expect(companionStage(11).name).toBe('Loup')
    expect(companionStage(16).name).toBe('Griffon')
    expect(companionStage(22).name).toBe('Lion doré')
  })

  it('reaches its final form at level 30 and stays there', () => {
    expect(companionStage(30).name).toBe('Dragon')
    expect(companionStage(60).name).toBe('Dragon')
  })
})

describe('nextCompanionStage', () => {
  it('points to the next evolution', () => {
    expect(nextCompanionStage(1)?.minLevel).toBe(4)
    expect(nextCompanionStage(29)?.minLevel).toBe(30)
  })

  it('is null once the final form is reached', () => {
    expect(nextCompanionStage(30)).toBeNull()
    expect(nextCompanionStage(45)).toBeNull()
  })
})

describe('companionMood', () => {
  it('is content when the streak is active today', () => {
    expect(companionMood(streak({ activeToday: true, current: 3 }))).toBe('content')
  })

  it('is sad when the streak is at risk (not done today, but not broken yet)', () => {
    expect(companionMood(streak({ activeToday: false, current: 2 }))).toBe('triste')
  })

  it('is neutral when there is no streak at all', () => {
    expect(companionMood(streak({ activeToday: false, current: 0 }))).toBe('neutre')
  })
})
