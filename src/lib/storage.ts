import type { CharacterData } from '../types'
import { emptyChar } from '../types'

const keyFor = (userId: string) => `ironquest-char-v1-${userId}`

/** Backfille les champs manquants d'un personnage (vieux schéma, JSON édité à la main). */
function normalizeChar(char: unknown): CharacterData {
  return { ...emptyChar, ...(char as Partial<CharacterData>) }
}

/** Cache local du perso lié au compte connecté — accès instantané, la source de vérité reste Supabase. */
export function loadCachedCharacter(userId: string): CharacterData | null {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    return raw ? normalizeChar(JSON.parse(raw)) : null
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

/** Télécharge la sauvegarde du personnage courant en fichier JSON (migration d'appareil). */
export function exportCharacter(data: CharacterData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `iron-quest-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Restaure une sauvegarde exportée. Retourne le personnage ou un message d'erreur. */
export function parseImportedCharacter(text: string): CharacterData | string {
  try {
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || !('profile' in parsed) || !('weighIns' in parsed)) {
      return "Ce fichier n'est pas une sauvegarde IRON QUEST valide."
    }
    return normalizeChar(parsed)
  } catch {
    return 'Fichier illisible : ce n’est pas du JSON valide.'
  }
}
