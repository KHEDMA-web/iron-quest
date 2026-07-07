const ACCENT = '#FFB020'
const ACCENT_DARK = '#3A2F14'
const RAIL = '#4A5364'
const COLLAR = '#5B6678'
const GHOST = '#2E3644'

interface BarbellProps {
  pct: number
  label: string
}

/** Barre olympique signature : se charge de plaques (pleine largeur, emplacements vides visibles
 * dès 0 %) selon la progression vers l'objectif de poids. */
export function Barbell({ pct, label }: BarbellProps) {
  const per = 5
  const loaded = Math.max(0, Math.min(1, pct)) * per
  const pw = 24
  const gap = 5
  const step = pw + gap
  const centerGapHalf = 18
  const H = 84
  const cy = H / 2

  const frontier = Math.min(per - 1, Math.floor(loaded))

  const plate = (x: number, frac: number, glow: boolean, key: string) => {
    if (frac <= 0) {
      return (
        <rect
          key={key}
          x={x}
          y={cy - 27}
          width={pw}
          height={54}
          rx="4"
          fill="none"
          stroke={GHOST}
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
      )
    }
    return (
      <rect
        key={key}
        className="plate"
        x={x}
        y={cy - 27}
        width={pw}
        height={54}
        rx="4"
        fill={ACCENT}
        opacity={0.35 + 0.65 * frac}
        stroke={ACCENT_DARK}
        strokeWidth="1.5"
        style={glow ? { filter: 'drop-shadow(0 0 6px rgba(255,176,32,0.85))' } : undefined}
      />
    )
  }

  const L = []
  const R = []
  for (let i = 0; i < per; i++) {
    const f = Math.max(0, Math.min(1, loaded - i))
    const glow = f > 0 && i === frontier
    L.push(plate(200 - centerGapHalf - i * step - pw, f, glow, 'L' + i))
    R.push(plate(200 + centerGapHalf + i * step, f, glow, 'R' + i))
  }

  return (
    <div className="text-center">
      <p className="m-0 font-display text-[15px] font-bold tracking-wide text-ink">{label}</p>
      <svg viewBox={`0 0 400 ${H}`} className="mt-0.5 h-auto w-full" role="presentation" aria-hidden="true">
        <rect x="14" y={cy - 3} width="372" height="6" rx="3" fill={RAIL} />
        <rect x="6" y={cy - 10} width="8" height="20" rx="2" fill={COLLAR} />
        <rect x="386" y={cy - 10} width="8" height="20" rx="2" fill={COLLAR} />
        <line x1="196" y1={cy - 8} x2="196" y2={cy + 8} stroke={GHOST} strokeWidth="2" />
        <line x1="200" y1={cy - 8} x2="200" y2={cy + 8} stroke={GHOST} strokeWidth="2" />
        <line x1="204" y1={cy - 8} x2="204" y2={cy + 8} stroke={GHOST} strokeWidth="2" />
        {L}
        {R}
      </svg>
    </div>
  )
}
