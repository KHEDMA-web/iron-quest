import { describe, expect, it } from 'vitest'
import { projection } from './projection'

const day = (n: number) => new Date(2026, 0, 1 + n).toISOString()

describe('projection', () => {
  it('returns null with fewer than 2 weigh-ins', () => {
    expect(projection([{ date: day(0), weight: 80 }], 90, 1)).toBeNull()
  })

  it('returns null when there is no target direction (dir === 0)', () => {
    const weighIns = [
      { date: day(0), weight: 80 },
      { date: day(7), weight: 79 },
    ]
    expect(projection(weighIns, 80, 0)).toBeNull()
  })

  it('projects an arrival date when the trend matches the goal direction', () => {
    const weighIns = [
      { date: day(0), weight: 80 },
      { date: day(7), weight: 81 },
      { date: day(14), weight: 82 },
    ]
    const p = projection(weighIns, 90, 1)
    expect(p).not.toBeNull()
    expect(p!.slope).toBeGreaterThan(0)
    expect(p!.date).not.toBeNull()
  })

  it('has no arrival date when the trend goes the wrong way', () => {
    const weighIns = [
      { date: day(0), weight: 82 },
      { date: day(7), weight: 81 },
      { date: day(14), weight: 80 },
    ]
    const p = projection(weighIns, 90, 1)
    expect(p).not.toBeNull()
    expect(p!.date).toBeNull()
  })
})
