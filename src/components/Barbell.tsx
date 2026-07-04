const ACCENT = '#FFB020'
const ACCENT_DARK = '#3A2F14'

interface BarbellProps {
  pct: number
  label: string
}

/** Barre olympique signature : se charge de plaques selon la progression. */
export function Barbell({ pct, label }: BarbellProps) {
  const per = 5
  const plates = Math.max(0, Math.min(1, pct)) * per
  const pw = 13
  const gap = 3
  const H = 82
  const cy = H / 2

  const mk = (x: number, frac: number, k: string) => (
    <rect
      key={k}
      className="plate"
      x={x}
      y={cy - 27}
      width={pw}
      height={54}
      rx="3"
      fill={ACCENT}
      opacity={frac < 1 ? 0.25 + 0.6 * frac : 1}
      stroke={ACCENT_DARK}
      strokeWidth="1"
      style={frac >= 1 ? { filter: 'drop-shadow(0 0 4px rgba(255,176,32,0.9))' } : undefined}
    />
  )

  const L = []
  const R = []
  for (let i = 0; i < per; i++) {
    const f = Math.max(0, Math.min(1, plates - i))
    if (f <= 0) break
    L.push(mk(42 + i * (pw + gap), f, 'L' + i))
    R.push(mk(358 - pw - i * (pw + gap), f, 'R' + i))
  }

  return (
    <svg viewBox={`0 0 400 ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      <rect x="10" y={cy - 4} width="380" height="8" rx="4" fill="#4A5364" />
      <rect x="28" y={cy - 7} width="6" height="14" rx="2" fill="#5B6678" />
      <rect x="366" y={cy - 7} width="6" height="14" rx="2" fill="#5B6678" />
      {L}
      {R}
      <text
        x="200"
        y={cy + 5}
        textAnchor="middle"
        fontFamily="'Oswald',sans-serif"
        fontSize="16"
        fontWeight="600"
        fill="#EDEFF3"
        letterSpacing="1"
      >
        {label}
      </text>
    </svg>
  )
}
