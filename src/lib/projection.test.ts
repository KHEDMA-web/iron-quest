import { describe, expect, it } from 'vitest'
import { projection } from './projection'

const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString()

describe('projection', () => {
  it('returns null with fewer than 2 weigh-ins', () => {
    expect(projection([{ date: iso(0), weight: 80 }], 75, -1)).toBeNull()
  })

  it('returns null when the goal equals the start weight (dir 0)', () => {
    const weighIns = [{ date: iso(3), weight: 80 }, { date: iso(0), weight: 79 }]
    expect(projection(weighIns, 80, 0)).toBeNull()
  })

  it('estimates an arrival date when trending toward the goal', () => {
    const weighIns = [4, 3, 2, 1, 0].map((d) => ({ date: iso(d), weight: 84 - (4 - d) }))
    const p = projection(weighIns, 78, -1)
    expect(p).not.toBeNull()
    expect(p!.slope).toBeLessThan(0)
    expect(p!.date).not.toBeNull()
  })

  it('gives no arrival date when the trend goes the wrong way', () => {
    const weighIns = [4, 3, 2, 1, 0].map((d) => ({ date: iso(d), weight: 78 + (4 - d) }))
    const p = projection(weighIns, 70, -1)
    expect(p).not.toBeNull()
    expect(p!.date).toBeNull()
  })
})
