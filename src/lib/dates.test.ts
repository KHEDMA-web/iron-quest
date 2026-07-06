import { describe, expect, it } from 'vitest'
import { dayKey, isoWeek } from './dates'

describe('isoWeek', () => {
  it('buckets a date into its ISO week regardless of the local timezone', () => {
    // Lundi 6 juillet 2026. Avant le fix, new Date('2026-07-06') (UTC minuit)
    // relu avec les getters locaux reculait d'un jour à l'ouest d'UTC,
    // envoyant le lundi dans la semaine ISO précédente.
    expect(isoWeek('2026-07-06')).toBe(isoWeek('2026-07-12')) // lundi et dimanche de la même semaine
    expect(isoWeek('2026-07-05')).not.toBe(isoWeek('2026-07-06')) // dimanche vs lundi = semaines différentes
  })

  it('accepts full ISO timestamps by using only the date part', () => {
    expect(isoWeek('2026-07-06T23:59:00.000Z')).toBe(isoWeek('2026-07-06'))
  })

  it('agrees with dayKey round-trips', () => {
    const today = new Date()
    expect(isoWeek(dayKey(today))).toMatch(/^\d{4}-\d{1,2}$/)
  })
})

describe('dayKey', () => {
  it('formats using the local calendar day', () => {
    expect(dayKey(new Date(2026, 6, 6))).toBe('2026-07-06')
  })
})
