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
  const d = new Date(dstr)
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const ys = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return `${date.getUTCFullYear()}-${Math.ceil(((date.getTime() - ys.getTime()) / 86400000 + 1) / 7)}`
}
