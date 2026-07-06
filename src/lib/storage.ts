import type { CharacterData } from '../types'

const keyFor = (userId: string) => `ironquest-char-v1-${userId}`

/** Cache local du perso lié au compte connecté — accès instantané, la source de vérité reste Supabase. */
export function loadCachedCharacter(userId: string): CharacterData | null {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    return raw ? (JSON.parse(raw) as CharacterData) : null
  } catch {
    return null
  }
}

export function saveCachedCharacter(userId: string, data: CharacterData): boolean {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function clearCachedCharacter(userId: string): void {
  try {
    localStorage.removeItem(keyFor(userId))
  } catch {
    // rien à nettoyer
  }
}
