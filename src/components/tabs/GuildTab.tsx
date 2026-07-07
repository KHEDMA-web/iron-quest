import { useState } from 'react'
import type { AchievementTier, GameCompute } from '../../lib/gameCompute'
import type { LeaderboardEntry } from '../../types'
import { CLASSES } from '../../data/classes'
import { RANKS, rankOf } from '../../lib/xp'
import { loadLeaderboard, supabase } from '../../lib/supabase'

interface GuildTabProps {
  game: GameCompute
}

const TIER_STYLE: Record<AchievementTier, { border: string; glow: string; label: string; text: string }> = {
  commun: { border: 'border-line', glow: '', label: 'Commun', text: 'text-ink' },
  rare: { border: 'border-blue/50', glow: 'glow-blue', label: 'Rare', text: 'text-blue' },
  epique: { border: 'border-purple/50', glow: 'glow-purple', label: 'Épique', text: 'text-purple' },
  legendaire: { border: 'border-accent/50', glow: 'glow-accent', label: 'Légendaire', text: 'text-accent' },
}

export function GuildTab({ game }: GuildTabProps) {
  const { profile, lvl, achievements } = game
  const [board, setBoard] = useState<LeaderboardEntry[] | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    setLoading(true)
    setBoard(await loadLeaderboard())
    setLoading(false)
  }

  return (
    <section>
      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">
          🎖️ Hauts faits <span className="text-xs font-normal text-muted">— {achievements.filter((a) => a.done).length}/{achievements.length}</span>
        </p>
        <div className="mt-2.5 flex flex-col gap-2">
          {achievements.map((a) => {
            const tier = TIER_STYLE[a.tier]
            return (
              <div
                key={a.name}
                className={`flex items-center gap-2.5 rounded-[10px] border bg-surface2 px-3 py-2 ${a.done ? `${tier.border} ${tier.glow}` : 'border-line opacity-45'}`}
              >
                <span className="w-7 text-lg">{a.done ? a.icon : '🔒'}</span>
                <span className="min-w-0 flex-1">
                  <span className={`text-[13.5px] ${a.done ? `font-semibold ${tier.text}` : 'font-normal text-muted'}`}>{a.name}</span>
                  <span className="block text-[11.5px] text-muted">{a.desc}</span>
                  {!a.done && (
                    <span className="mt-1 flex items-center gap-1.5">
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-surface2">
                        <span className="block h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${Math.min(100, (a.current / a.target) * 100)}%` }} />
                      </span>
                      <span className="shrink-0 text-[10px] tabular-nums text-muted">
                        {a.current}/{a.target}
                      </span>
                    </span>
                  )}
                </span>
                <span className={`shrink-0 text-[10px] uppercase tracking-wide ${a.done ? tier.text : 'text-muted'}`}>{tier.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🎗️ Les rangs</p>
        {RANKS.map((r) => (
          <div key={r.name} className="flex items-center justify-between py-1.5">
            <span className={`text-[13.5px] ${lvl >= r.min ? 'text-ink' : 'text-muted'}`}>
              {r.icon} {r.name} {rankOf(lvl).name === r.name && <b className="text-accent">← toi</b>}
            </span>
            <span className="text-xs text-muted">niv. {r.min}+</span>
          </div>
        ))}
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">⚔️ Ta guilde</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          Partage IRON QUEST à tes potes : chacun crée son perso, et tout le monde apparaît ici dans le même classement par XP.
        </p>
        {!supabase && (
          <p className="mt-2 text-[12.5px] leading-relaxed text-red">Classement partagé pas encore configuré (variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes).</p>
        )}
        <button onClick={refresh} className="mt-2.5 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted">
          {loading ? 'Chargement…' : '🔄 Actualiser le classement'}
        </button>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🏆 Classement</p>
        {loading && <p className="mt-2 text-[12.5px] text-muted">Chargement…</p>}
        {!loading && board && board.length === 0 && (
          <p className="mt-2 text-[12.5px] text-muted">Personne pour l'instant. Fais une action (séance, pesée…) pour t'inscrire, et invite tes potes !</p>
        )}
        {!loading && !board && <p className="mt-2 text-[12.5px] text-muted">Clique « Actualiser le classement » ci-dessus pour le charger.</p>}
        {!loading &&
          board &&
          board.map((p, i) => {
            const pc = CLASSES[p.cls] || CLASSES.colosse
            const pr = rankOf(p.lvl || 1)
            const me = p.pseudo === profile.pseudo
            return (
              <div key={p.pseudo + i} className={`flex items-center justify-between gap-2.5 rounded-lg px-2 py-2.5 ${me ? 'bg-surface2' : ''}`}>
                <span className={`w-6 font-display text-[15px] ${i === 0 ? 'text-accent' : 'text-muted'}`}>{i === 0 ? '👑' : `#${i + 1}`}</span>
                <span className="min-w-0 flex-1">
                  <span className={`text-sm ${me ? 'font-bold' : 'font-medium'}`}>
                    {pc.emoji} {p.pseudo}
                    {me && ' (toi)'}
                  </span>
                  <span className="block text-[11px] text-muted">
                    {pr.icon} {pr.name} · {p.workouts || 0} séances · sem. {p.weeks || 1}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-display text-base font-semibold text-purple">niv. {p.lvl || 1}</span>
                  <span className="text-[10.5px] text-muted">{p.xp || 0} XP</span>
                </span>
              </div>
            )
          })}
      </div>
    </section>
  )
}
