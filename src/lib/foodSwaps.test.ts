import { describe, expect, it } from 'vitest'
import { applyFoodSwaps, foodSwapForShoppingKey, shoppingLabelFor } from './foodSwaps'
import type { Meal } from '../types'

const shakeMeal: Meal = {
  id: 's',
  title: 'Shake bâtisseur',
  kcal: 630,
  p: 30,
  shake: true,
  items: ['300 ml lait de soja', '1 banane', "60 g flocons d'avoine", '25 g beurre de cacahuète'],
  steps: ['Mets le lait de soja, la banane, les flocons d’avoine et le beurre de cacahuète dans un blender.'],
}

const cajouMeal: Meal = {
  id: 'b',
  title: 'Petit-déjeuner',
  kcal: 820,
  p: 40,
  items: ['3 œufs au plat', '80 g pain complet', '1 banane', '30 g noix de cajou'],
  steps: ['Sers avec la banane et les noix de cajou.'],
}

describe('applyFoodSwaps', () => {
  it('returns the meal unchanged when no swap is active', () => {
    expect(applyFoodSwaps(shakeMeal, {})).toBe(shakeMeal)
  })

  it('does not crash on a character saved before foodSwaps existed (undefined, not {})', () => {
    expect(applyFoodSwaps(shakeMeal, undefined)).toBe(shakeMeal)
  })

  it('leaves an untouched meal unchanged even with swaps active', () => {
    const untouched: Meal = { ...shakeMeal, id: 'x', items: ['2 pavés de saumon'], steps: [] }
    expect(applyFoodSwaps(untouched, { soja: true })).toBe(untouched)
  })

  it('replaces soy milk everywhere without changing macros (near-equivalent substitute)', () => {
    const out = applyFoodSwaps(shakeMeal, { soja: true })
    expect(out.items.some((i) => i.includes('lait de soja'))).toBe(false)
    expect(out.items.some((i) => i.includes('lait d’avoine protéiné'))).toBe(true)
    expect(out.steps[0]).toContain('lait d’avoine protéiné')
    expect(out.kcal).toBe(630)
    expect(out.p).toBe(30)
  })

  it('replaces the longer variant first so no residual text is left ("noix de cajou" vs "noix")', () => {
    const out = applyFoodSwaps(cajouMeal, { 'fruits-a-coque': true })
    expect(out.items.find((i) => i.includes('30 g'))).toBe('30 g graines de courge')
    expect(out.steps[0]).toBe('Sers avec la banane et les graines de courge.')
    expect(out.kcal).toBe(820 - 15)
    expect(out.p).toBe(40 + 2)
  })

  it('applies each active swap delta once per meal even if the ingredient appears in both items and steps', () => {
    const out = applyFoodSwaps(shakeMeal, { cacahuete: true })
    expect(out.kcal).toBe(630) // deltaKcal is 0 for this swap, but should not be added twice
    expect(out.items.every((i) => !i.includes('cacahuète'))).toBe(true)
    expect(out.steps[0]).not.toContain('cacahuète')
  })

  it('stacks multiple simultaneous swaps on the same meal', () => {
    const out = applyFoodSwaps(shakeMeal, { soja: true, cacahuete: true })
    expect(out.items.join(' ')).not.toMatch(/lait de soja|cacahuète/)
    expect(out.items.join(' ')).toContain('lait d’avoine protéiné')
    expect(out.items.join(' ')).toContain('purée de graines de tournesol')
  })
})

describe('shoppingLabelFor / foodSwapForShoppingKey', () => {
  it('returns the default label when the swap is inactive', () => {
    expect(shoppingLabelFor('soja', 'Lait de soja — 4 briques', {})).toBe('Lait de soja — 4 briques')
  })

  it('does not crash when active is undefined (old saved character)', () => {
    expect(shoppingLabelFor('soja', 'Lait de soja — 4 briques', undefined)).toBe('Lait de soja — 4 briques')
  })

  it('returns the swapped label when active', () => {
    expect(shoppingLabelFor('soja', 'Lait de soja — 4 briques', { soja: true })).toBe('Lait d’avoine protéiné — 4 briques')
  })

  it('finds the FoodSwap for a known shopping key and returns undefined otherwise', () => {
    expect(foodSwapForShoppingKey('soja')?.id).toBe('soja')
    expect(foodSwapForShoppingKey('riz')).toBeUndefined()
  })
})
