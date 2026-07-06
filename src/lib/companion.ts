import type { Streak } from './streak'

export type CompanionMood = 'content' | 'neutre' | 'triste'

export interface CompanionStage {
  minLevel: number
  emoji: string
  name: string
}

/** Évolue avec le niveau du personnage — même logique d'escalade que les rangs (xp.ts). */
export const COMPANION_STAGES: CompanionStage[] = [
  { minLevel: 1, emoji: '🥚', name: 'Œuf mystérieux' },
  { minLevel: 4, emoji: '🐣', name: 'Poussin téméraire' },
  { minLevel: 7, emoji: '🦊', name: 'Renardeau' },
  { minLevel: 11, emoji: '🐺', name: 'Loup' },
  { minLevel: 16, emoji: '🦅', name: 'Griffon' },
  { minLevel: 22, emoji: '🦁', name: 'Lion doré' },
  { minLevel: 30, emoji: '🐉', name: 'Dragon' },
]

export const companionStage = (lvl: number): CompanionStage => [...COMPANION_STAGES].reverse().find((s) => lvl >= s.minLevel)!

/** La prochaine forme, ou `null` si la forme finale est déjà atteinte. */
export function nextCompanionStage(lvl: number): CompanionStage | null {
  return COMPANION_STAGES.find((s) => s.minLevel > lvl) ?? null
}

/** Humeur dérivée de la série en cours — jamais stockée, comme l'XP (anti-triche/déco). */
export function companionMood(streak: Streak): CompanionMood {
  if (streak.activeToday) return 'content'
  if (streak.current > 0) return 'triste'
  return 'neutre'
}

export const COMPANION_FLAVOR: Record<CompanionMood, string> = {
  content: 'Plein d’énergie aujourd’hui — il sent que tu progresses.',
  triste: "Il t'attend... ne casse pas la série !",
  neutre: 'Fais une action pour le réveiller.',
}
