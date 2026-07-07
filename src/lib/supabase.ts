import { createClient } from '@supabase/supabase-js'
import type { CharacterData, LeaderboardEntry } from '../types'
import { emptyChar } from '../types'
import { weeksSince } from './dates'
import { computeXp, levelFromXp } from './xp'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && anonKey ? createClient(url, anonKey) : null

interface LeaderboardRow {
  pseudo: string
  cls: string
  lvl: number
  xp: number
  weeks: number
  workouts: number
  updated_at: string
}

const fromRow = (r: LeaderboardRow): LeaderboardEntry => ({
  pseudo: r.pseudo,
  cls: r.cls as LeaderboardEntry['cls'],
  lvl: r.lvl,
  xp: r.xp,
  weeks: r.weeks,
  workouts: r.workouts,
  updatedAt: r.updated_at,
})

/** Fire-and-forget : publie l'entrée de guilde du compte connecté. Échec silencieux si Supabase n'est pas configuré. */
export async function syncLeaderboard(userId: string, d: CharacterData): Promise<void> {
  if (!supabase || !d.profile) return
  const { xp } = computeXp(d, d.profile.days.length)
  const { lvl } = levelFromXp(xp)
  try {
    await supabase.from('leaderboard').upsert({
      user_id: userId,
      pseudo: d.profile.pseudo,
      cls: d.profile.cls,
      lvl,
      xp,
      weeks: d.startDate ? weeksSince(d.startDate) : 1,
      workouts: d.workouts.length,
      updated_at: new Date().toISOString(),
    })
  } catch {
    // classement indisponible, on continue sans bloquer le jeu local
  }
}

export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('xp', { ascending: false })
      .limit(50)
    if (error || !data) return []
    return (data as LeaderboardRow[]).map(fromRow)
  } catch {
    return []
  }
}

/** `false` seulement si le pseudo est confirmé pris ; `true` par défaut (hors ligne, pas configuré, erreur réseau). */
export async function isPseudoAvailable(pseudo: string): Promise<boolean> {
  if (!supabase) return true
  try {
    const { count, error } = await supabase.from('leaderboard').select('pseudo', { count: 'exact', head: true }).ilike('pseudo', pseudo)
    if (error) return true
    return (count ?? 0) === 0
  } catch {
    return true
  }
}

export async function loadCharacter(userId: string): Promise<CharacterData | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('characters').select('data').eq('user_id', userId).maybeSingle()
    if (error || !data) return null
    // Backfille les champs manquants d'un perso sauvegardé avant l'ajout d'un nouveau champ
    // (ex: foodSwaps) — même normalisation que le cache local (voir lib/storage.ts).
    return { ...emptyChar, ...(data.data as Partial<CharacterData>) }
  } catch {
    return null
  }
}

/** Fire-and-forget : sauvegarde le perso dans le compte. Échec silencieux, le cache local reste la source immédiate. */
export async function saveCharacterRemote(userId: string, char: CharacterData): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('characters').upsert({ user_id: userId, data: char, updated_at: new Date().toISOString() })
  } catch {
    // sauvegarde cloud indisponible, le cache local prend le relais
  }
}

export async function deleteCharacterRemote(userId: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('characters').delete().eq('user_id', userId)
    await supabase.from('leaderboard').delete().eq('user_id', userId)
  } catch {
    // suppression cloud indisponible
  }
}
