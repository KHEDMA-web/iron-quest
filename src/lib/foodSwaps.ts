import type { Meal } from '../types'
import { FOOD_SWAPS, type FoodSwap } from '../data/foodSwaps'

function replaceVariants(text: string, swap: FoodSwap): string {
  // Les variantes les plus longues d'abord (ex: "beurre de cacahuète" avant "cacahuète") pour ne
  // pas laisser de résidu ("...s") quand une variante est une sous-chaîne d'une autre.
  const ordered = [...swap.variants].sort((a, b) => b.length - a.length)
  let out = text
  for (const v of ordered) out = out.split(v).join(swap.replacement)
  return out
}

function containsAnyVariant(text: string, swap: FoodSwap): boolean {
  return swap.variants.some((v) => text.includes(v))
}

/** Applique les allergies/préférences actives à un repas : ingrédient remplacé partout (items,
 * recette) et kcal/protéines réajustés une seule fois par substitution qui touche ce repas. */
export function applyFoodSwaps(meal: Meal, active: Record<string, boolean>): Meal {
  const activeSwaps = FOOD_SWAPS.filter((s) => active[s.id])
  if (!activeSwaps.length) return meal

  let items = meal.items
  let steps = meal.steps
  let kcal = meal.kcal
  let p = meal.p

  for (const swap of activeSwaps) {
    const touched = items.some((i) => containsAnyVariant(i, swap)) || steps.some((s) => containsAnyVariant(s, swap))
    if (!touched) continue
    items = items.map((i) => replaceVariants(i, swap))
    steps = steps.map((s) => replaceVariants(s, swap))
    kcal += swap.deltaKcal
    p += swap.deltaProt
  }

  return items === meal.items && steps === meal.steps ? meal : { ...meal, items, steps, kcal, p }
}

/** Libellé de l'article de courses, remplacé si l'allergie/préférence associée est active. */
export function shoppingLabelFor(itemKey: string, defaultLabel: string, active: Record<string, boolean>): string {
  const swap = FOOD_SWAPS.find((s) => s.shoppingKey === itemKey && active[s.id])
  return swap ? swap.shoppingLabel : defaultLabel
}

/** Le FoodSwap associé à un article de courses, s'il y en a un (pour afficher un bouton 🔄 inline). */
export function foodSwapForShoppingKey(itemKey: string): FoodSwap | undefined {
  return FOOD_SWAPS.find((s) => s.shoppingKey === itemKey)
}
