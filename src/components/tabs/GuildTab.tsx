import { useState } from 'react'
import type { GameCompute } from '../../lib/gameCompute'
import type { LeaderboardEntry } from '../../types'
import { CLASSES } from '../../data/classes'
import { RANKS, rankOf } from '../../lib/xp'
import { loadLeaderboard, supabase } from '../../lib/supabase'

interface GuildTabProps {
  game: GameCompute
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
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">⚔️ Ta guilde</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          Partage cette appli à tes potes : chacun crée SON personnage avec SON objectif (masse, sèche ou forme), et tout le monde apparaît dans le même classement — l'XP ne ment pas. (Visible :
          pseudo, classe, niveau, XP. Poids et repas restent privés.)
        </p>
        {!supabase && (
          <p className="mt-2 text-[12.5px] leading-relaxed text-red">
            Classement partagé pas encore configuré (variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes).
          </p>
        )}
        <button onClick={refresh} className="mt-2.5 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted">
          {loading ? 'Chargement…' : '🔄 Actualiser le classement'}
        </button>
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🏆 Classement</p>
        {loading && <p className="mt-2 text-[12.5px] text-muted">Chargement…</p>}
        {!loading && board && board.length === 0 && (
          <p className="mt-2 text-[12.5px] text-muted">Personne pour l'instant. Fais une action (séance, pesée…) pour t'inscrire, et invite tes potes !</p>
        )}
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

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🎖️ Hauts faits</p>
        {achievements.map((a) => (
          <div key={a.name} className={`flex items-center gap-2.5 py-1.5 ${a.done ? '' : 'opacity-45'}`}>
            <span className="w-7 text-lg">{a.done ? a.icon : '🔒'}</span>
            <span className="flex-1">
              <span className={`text-[13.5px] ${a.done ? 'font-semibold text-ink' : 'font-normal text-muted'}`}>{a.name}</span>
              <span className="block text-[11.5px] text-muted">{a.desc}</span>
            </span>
            {a.done && <span className="text-[13px] text-green">✓</span>}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🎖️ Les rangs</p>
        {RANKS.map((r) => (
          <div key={r.name} className="flex items-center justify-between py-1.5">
            <span className={`text-[13.5px] ${lvl >= r.min ? 'text-ink' : 'text-muted'}`}>
              {r.icon} {r.name} {rankOf(lvl).name === r.name && <b className="text-accent">← toi</b>}
            </span>
            <span className="text-xs text-muted">niv. {r.min}+</span>
          </div>
        ))}
      </div>
    </section>
  )
}
