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
