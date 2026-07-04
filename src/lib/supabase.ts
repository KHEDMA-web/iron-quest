import { createClient } from '@supabase/supabase-js'
import type { CharacterData, LeaderboardEntry } from '../types'
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

/** Fire-and-forget : publie l'entrée de guilde du perso actif. Échec silencieux si Supabase n'est pas configuré. */
export async function syncLeaderboard(d: CharacterData): Promise<void> {
  if (!supabase || !d.profile) return
  const { xp } = computeXp(d, d.profile.days.length)
  const { lvl } = levelFromXp(xp)
  try {
    await supabase.from('leaderboard').upsert({
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
