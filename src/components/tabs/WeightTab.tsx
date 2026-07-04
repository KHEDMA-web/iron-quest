import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CharacterData } from '../../types'
import type { GameCompute } from '../../lib/gameCompute'
import { fmtDate } from '../../lib/dates'
import { XP } from '../../lib/xp'

interface WeightTabProps {
  data: CharacterData
  game: GameCompute
  persist: (next: CharacterData) => void
}

export function WeightTab({ data, game, persist }: WeightTabProps) {
  const { current, proj, dir, profile } = game
  const [input, setInput] = useState('')

  const addWeighIn = () => {
    const w = parseFloat(String(input).replace(',', '.'))
    if (!w || w < 35 || w > 250) return
    persist({ ...data, weighIns: [...data.weighIns, { date: new Date().toISOString(), weight: Math.round(w * 10) / 10 }] })
    setInput('')
  }

  const deleteWeighIn = (index: number) => persist({ ...data, weighIns: data.weighIns.filter((_, j) => j !== index) })

  const chartData = data.weighIns.map((w) => ({ name: fmtDate(w.date), poids: w.weight }))
  const goal = profile.goal
  const yMin = Math.min(profile.startWeight, goal, current) - 2
  const yMax = Math.max(profile.startWeight, goal, current) + 2

  return (
    <section>
      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">
          Pesée de la semaine <span className="text-[11px] text-purple">+{XP.weighIn} XP</span>
        </p>
        <p className="text-[12.5px] leading-relaxed text-muted">Toujours le même jour, le matin à jeun. Une seule par semaine — le poids fluctue trop au quotidien.</p>
        <div className="mt-2.5 flex gap-2">
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            placeholder={`Ex : ${current.toFixed(1)}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWeighIn()}
            aria-label="Poids en kilogrammes"
            className="min-w-0 flex-1 rounded-[10px] border border-line bg-surface2 px-3.5 py-3 text-base text-ink"
          />
          <button onClick={addWeighIn} className="rounded-[10px] bg-accent px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]">
            OK
          </button>
        </div>
      </div>

      {chartData.length >= 2 && (
        <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
          <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">Ta courbe</p>
          <div className="h-[220px] w-full">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#2E3644" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#8B93A1', fontSize: 11 }} />
                <YAxis domain={[yMin, yMax]} tick={{ fill: '#8B93A1', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#242A35', border: '1px solid #2E3644', borderRadius: 8, color: '#EDEFF3' }} />
                <ReferenceLine y={goal} stroke="#FFB020" strokeDasharray="6 4" label={{ value: `${goal} kg`, fill: '#FFB020', fontSize: 11, position: 'insideTopRight' }} />
                <Line type="monotone" dataKey="poids" stroke="#FFB020" strokeWidth={2.5} dot={{ r: 3, fill: '#FFB020' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {proj && dir !== 0 && (
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
              {proj.date ? (
                <>
                  Rythme : <b className="text-accent">{Math.abs(proj.slope * 30).toFixed(1)} kg/mois</b>.
                  {dir > 0 && proj.slope * 30 > 1.3 && ' ⚠️ Un peu vite — au-delà de ~1,3 kg/mois, une part croissante est du gras. Retire ~200 kcal/jour.'}
                  {dir > 0 && proj.slope * 30 <= 1.3 && ' Rythme idéal pour du muscle propre, continue pareil.'}
                  {dir < 0 && Math.abs(proj.slope * 30) > 4 && ' ⚠️ Trop rapide — tu risques de perdre du muscle. Remange ~200 kcal/jour.'}
                  {dir < 0 && Math.abs(proj.slope * 30) <= 4 && ' Bon rythme de sèche : le muscle reste, le gras part.'}
                </>
              ) : dir > 0 ? (
                "Stagnation → ajoute 300 kcal/jour : +30 g d'avoine et +10 g de beurre de cacahuète dans le shake. Re-regarde dans 2 semaines."
              ) : (
                'Stagnation → retire 200 kcal/jour (réduis les féculents du dîner) et vérifie que tu comptes bien tout. Re-regarde dans 2 semaines.'
              )}
            </p>
          )}
        </div>
      )}

      {data.weighIns.length > 0 && (
        <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
          <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">Historique</p>
          {[...data.weighIns].reverse().map((w, ri) => {
            const i = data.weighIns.length - 1 - ri
            return (
              <div key={w.date + i} className="flex items-center justify-between gap-2.5 border-b border-line py-2.5 last:border-b-0">
                <span className="text-[13px] text-muted">{fmtDate(w.date)}</span>
                <span className="font-semibold">{w.weight.toFixed(1)} kg</span>
                <button onClick={() => deleteWeighIn(i)} aria-label={`Supprimer la pesée du ${fmtDate(w.date)}`} className="bg-transparent px-1.5 py-0.5 text-sm text-muted">
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
