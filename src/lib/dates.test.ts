import { describe, expect, it } from 'vitest'
import { currentPhase, dayKey, isoWeek, monthCells, weekDates, weeksSince } from './dates'
import { PHASES } from '../data/phases'

describe('dayKey', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(dayKey(new Date(2026, 10, 30))).toBe('2026-11-30')
  })
})

describe('isoWeek', () => {
  it('groups dates in the same ISO week under the same key', () => {
    expect(isoWeek('2026-01-05')).toBe(isoWeek('2026-01-09'))
  })

  it('separates dates in different ISO weeks', () => {
    expect(isoWeek('2026-01-05')).not.toBe(isoWeek('2026-01-13'))
  })
})

describe('weeksSince', () => {
  it('returns 1 for a program that just started', () => {
    expect(weeksSince(new Date().toISOString())).toBe(1)
  })

  it('never returns less than 1', () => {
    const future = new Date(Date.now() + 7 * 86400000).toISOString()
    expect(weeksSince(future)).toBe(1)
  })
})

describe('currentPhase', () => {
  it('maps week numbers to the right phase', () => {
    expect(currentPhase(1).id).toBe(1)
    expect(currentPhase(4).id).toBe(1)
    expect(currentPhase(5).id).toBe(2)
    expect(currentPhase(16).id).toBe(2)
    expect(currentPhase(17).id).toBe(3)
    expect(currentPhase(500).id).toBe(3)
  })

  it('falls back to the last phase past its declared range', () => {
    expect(currentPhase(999999)).toBe(PHASES[2])
  })
})

describe('weekDates', () => {
  it('returns 7 consecutive days starting on Monday', () => {
    const days = weekDates(new Date(2026, 0, 8)) // jeudi 8 janvier 2026
    expect(days).toHaveLength(7)
    expect(days[0].getDay()).toBe(1)
    expect(days[6].getDay()).toBe(0)
    expect(dayKey(days[0])).toBe('2026-01-05')
    expect(dayKey(days[6])).toBe('2026-01-11')
  })

  it('keeps Sunday in the week that just ended, not the next one', () => {
    const days = weekDates(new Date(2026, 0, 11)) // dimanche 11 janvier 2026
    expect(dayKey(days[0])).toBe('2026-01-05')
    expect(dayKey(days[6])).toBe('2026-01-11')
  })
})

describe('monthCells', () => {
  it('pads the grid to full weeks starting on Monday', () => {
    // janvier 2026 : le 1er est un jeudi -> 3 cases vides avant, 31 jours, complété à 35
    const cells = monthCells(new Date(2026, 0, 15))
    expect(cells).toHaveLength(35)
    expect(cells[0]).toBeNull()
    expect(cells[1]).toBeNull()
    expect(cells[2]).toBeNull()
    expect(cells[3]).not.toBeNull()
    expect(dayKey(cells[3]!)).toBe('2026-01-01')
    expect(dayKey(cells[33]!)).toBe('2026-01-31')
    expect(cells[34]).toBeNull()
  })

  it('handles a month that starts exactly on Monday with no leading gap', () => {
    // juin 2026 : le 1er est un lundi
    const cells = monthCells(new Date(2026, 5, 1))
    expect(cells[0]).not.toBeNull()
    expect(dayKey(cells[0]!)).toBe('2026-06-01')
  })
})
