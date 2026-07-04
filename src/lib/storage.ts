import type { Store } from '../types'

const KEY = 'ironquest-v5'

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { profiles: parsed.profiles || {}, active: parsed.active || null }
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
