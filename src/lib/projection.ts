import type { WeighIn } from '../types'

export interface Projection {
  slope: number
  date: Date | null
}

/** Régression linéaire sur les 8 dernières pesées → tendance kg/jour + date d'arrivée estimée. */
export function projection(weighIns: WeighIn[], goal: number, dir: number): Projection | null {
  if (weighIns.length < 2 || dir === 0) return null
  const pts = weighIns.slice(-8).map((w) => ({ t: new Date(w.date).getTime() / 86400000, y: w.weight }))
  const n = pts.length
  const mx = pts.reduce((s, p) => s + p.t, 0) / n
  const my = pts.reduce((s, p) => s + p.y, 0) / n
  let num = 0
  let den = 0
  pts.forEach((p) => {
    num += (p.t - mx) * (p.y - my)
    den += (p.t - mx) ** 2
  })
  if (!den) return null
  const slope = num / den
  const lastPt = pts[n - 1]
  if (Math.sign(slope) !== dir || Math.abs(slope) < 0.001) return { slope, date: null }
  const days = (goal - lastPt.y) / slope
  if (days <= 0) return { slope, date: null }
  return { slope, date: new Date((lastPt.t + days) * 86400000) }
}
