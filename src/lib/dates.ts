import type { Phase } from '../types'
import { PHASES } from '../data/phases'

export const dayKey = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

export const DAYS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
export const DAYS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

export const weeksSince = (startISO: string) =>
  Math.max(1, Math.floor((Date.now() - new Date(startISO).getTime()) / (7 * 86400000)) + 1)

/** Les 7 dates (lundi → dimanche) de la semaine ISO contenant `base`. */
export function weekDates(base: Date = new Date()): Date[] {
  const monday = new Date(base)
  const isoDow = monday.getDay() || 7 // 1 (lundi) .. 7 (dimanche)
  monday.setDate(monday.getDate() - isoDow + 1)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

/** Grille de calendrier (lundi → dimanche) du mois de `viewed` : `null` pour les cases hors-mois. */
export function monthCells(viewed: Date): (Date | null)[] {
  const year = viewed.getFullYear()
  const month = viewed.getMonth()
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7 // 0 = lundi
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export const currentPhase = (week: number): Phase =>
  PHASES.find((p) => week >= p.from && week <= p.to) || PHASES[2]

export const isoWeek = (dstr: string) => {
  // Parse les composants à la main : new Date('YYYY-MM-DD') serait interprété
  // en UTC minuit puis relu en heure locale, décalant d'un jour à l'ouest d'UTC.
  const [y, m, dd] = dstr.slice(0, 10).split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, dd))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const ys = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return `${date.getUTCFullYear()}-${Math.ceil(((date.getTime() - ys.getTime()) / 86400000 + 1) / 7)}`
}
