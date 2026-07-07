export interface FoodSwap {
  id: string
  label: string
  reason: string
  /** Sous-chaînes exactes (telles qu'écrites dans menus.ts) à remplacer, insensible à la casse. */
  variants: string[]
  replacement: string
  /** Ajustement approx. kcal/protéines appliqué une fois par repas contenant l'ingrédient. */
  deltaKcal: number
  deltaProt: number
  shoppingKey: string
  shoppingLabel: string
}

/**
 * Liste volontairement restreinte aux allergènes/intolérances qui reviennent vraiment dans les
 * menus (pas de champ libre : les deltas kcal/protéines ne peuvent être fiables que sur des
 * substituts connus à l'avance). Activer une entrée remplace l'ingrédient partout où il apparaît
 * (recette du jour, repas de la semaine, liste de courses) — voir lib/foodSwaps.ts.
 */
export const FOOD_SWAPS: FoodSwap[] = [
  {
    id: 'soja',
    label: 'Lait de soja',
    reason: 'allergie ou intolérance au soja',
    variants: ['lait de soja'],
    replacement: 'lait d’avoine protéiné',
    deltaKcal: 0,
    deltaProt: 0,
    shoppingKey: 'soja',
    shoppingLabel: 'Lait d’avoine protéiné — 4 briques',
  },
  {
    id: 'oeufs',
    label: 'Œufs',
    reason: 'allergie aux œufs',
    variants: ['œufs', 'œuf'],
    replacement: 'tofu (ferme ou soyeux selon la recette)',
    deltaKcal: 0,
    deltaProt: 0,
    shoppingKey: 'oeufs',
    shoppingLabel: 'Tofu ferme + soyeux — 800 g',
  },
  {
    id: 'cacahuete',
    label: 'Cacahuète / beurre de cacahuète',
    reason: 'allergie à l’arachide',
    variants: ['beurre de cacahuète', 'cacahuètes', 'cacahuète'],
    replacement: 'purée de graines de tournesol',
    deltaKcal: 0,
    deltaProt: 0,
    shoppingKey: 'pb',
    shoppingLabel: 'Purée de graines de tournesol — 500 g',
  },
  {
    id: 'fruits-a-coque',
    label: 'Amandes / noix / noix de cajou',
    reason: 'allergie aux fruits à coque',
    variants: ['noix de cajou', 'amandes', 'noix'],
    replacement: 'graines de courge',
    deltaKcal: -15,
    deltaProt: 2,
    shoppingKey: 'amandes',
    shoppingLabel: 'Graines de courge — 300 g',
  },
  {
    id: 'poisson',
    label: 'Saumon / thon / sardines',
    reason: 'allergie ou aversion au poisson',
    variants: ['saumon', 'thon', 'sardines'],
    replacement: 'poulet ou dinde',
    deltaKcal: -30,
    deltaProt: 5,
    shoppingKey: 'saumon',
    shoppingLabel: 'Poulet ou dinde (remplace le poisson) — 400 g',
  },
]
