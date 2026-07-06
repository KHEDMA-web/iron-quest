import type { CharacterData, Store } from '../types'
import { emptyChar } from '../types'

const KEY = 'ironquest-v5'

/** Backfille les champs manquants d'un personnage (vieux schéma, JSON édité à la main). */
function normalizeChar(char: unknown): CharacterData {
  return { ...emptyChar, ...(char as Partial<CharacterData>) }
}

function normalizeProfiles(profiles: Record<string, unknown>): Record<string, CharacterData> {
  return Object.fromEntries(Object.entries(profiles).map(([id, c]) => [id, normalizeChar(c)]))
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { profiles: normalizeProfiles(parsed.profiles || {}), active: parsed.active || null }
    }
  } catch {
    // localStorage indisponible (navigation privée, quota...) : on repart à vide
  }
  return { profiles: {}, active: null }
}

export function saveStore(store: Store): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

/** Télécharge la sauvegarde complète (tous les personnages) en fichier JSON. */
export function exportStore() {
  const blob = new Blob([JSON.stringify({ version: KEY, ...loadStore() }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `iron-quest-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Restaure une sauvegarde exportée. Retourne le Store ou un message d'erreur. */
export function parseImportedStore(text: string): Store | string {
  try {
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || typeof parsed.profiles !== 'object' || parsed.profiles === null) {
      return "Ce fichier n'est pas une sauvegarde IRON QUEST valide."
    }
    for (const char of Object.values(parsed.profiles as Record<string, unknown>)) {
      if (!char || typeof char !== 'object' || !('profile' in char) || !('weighIns' in char)) {
        return 'Sauvegarde corrompue : un personnage est invalide.'
      }
    }
    return { profiles: normalizeProfiles(parsed.profiles), active: typeof parsed.active === 'string' ? parsed.active : null }
  } catch {
    return 'Fichier illisible : ce n’est pas du JSON valide.'
  }
}
