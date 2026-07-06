import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'

interface LevelUpBurstProps {
  level: number | null
  onDone: () => void
}

const PARTICLE_COLORS = ['var(--color-accent)', 'var(--color-purple)', 'var(--color-green)']
const PARTICLE_COUNT = 14
const DISPLAY_MS = 1650

export function LevelUpBurst({ level, onDone }: LevelUpBurstProps) {
  const particles = useMemo(() => {
    if (level === null) return []
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4
      const dist = 90 + Math.random() * 70
      return {
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        delay: Math.random() * 0.15,
      }
    })
  }, [level])

  useEffect(() => {
    if (level === null) return
    const t = setTimeout(onDone, DISPLAY_MS)
    return () => clearTimeout(t)
  }, [level, onDone])

  if (level === null) return null

  return (
    <div className="level-burst-wrap pointer-events-none fixed inset-0 z-[60] flex items-center justify-center" aria-hidden>
      <div className="level-burst-ring absolute h-40 w-40 rounded-full border-4 border-accent" />
      <div className="relative flex items-center justify-center">
        {particles.map((p) => (
          <span
            key={p.id}
            className="level-burst-particle absolute h-2 w-2 rounded-sm"
            style={
              {
                backgroundColor: p.color,
                animationDelay: `${p.delay}s`,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
              } as CSSProperties
            }
          />
        ))}
        <p className="level-burst-text glow-accent m-0 rounded-2xl border-2 border-accent bg-surface px-6 py-3 text-center font-display text-3xl font-bold uppercase tracking-wide text-accent">
          Niveau {level}
        </p>
      </div>
    </div>
  )
}
