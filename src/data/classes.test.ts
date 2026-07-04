import { describe, expect, it } from 'vitest'
import { computeTargets, computeTargetsDetailed } from './classes'

describe('computeTargets / computeTargetsDetailed', () => {
  it('agree on kcal and protein', () => {
    const detailed = computeTargetsDetailed('colosse', 80, 180, 28, 'H')
    const short = computeTargets('colosse', 80, 180, 28, 'H')
    expect(short).toEqual({ kcal: detailed.kcal, prot: detailed.prot })
  })

  it('applies the class delta and protein-per-kg to build the target', () => {
    const d = computeTargetsDetailed('colosse', 80, 180, 28, 'H')
    const rawBmr = 10 * 80 + 6.25 * 180 - 5 * 28 + 5
    expect(d.bmr).toBe(Math.round(rawBmr))
    expect(d.tdee).toBe(Math.round(rawBmr * 1.55))
    expect(d.delta).toBe(450)
    expect(d.prot).toBe(Math.round((80 * 2.0) / 5) * 5)
  })

  it('never proposes fewer than 1500 kcal even on a deep deficit', () => {
    const d = computeTargetsDetailed('assassin', 45, 150, 60, 'F')
    expect(d.kcal).toBeGreaterThanOrEqual(1500)
  })
})
