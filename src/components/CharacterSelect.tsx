import { useState } from 'react'
import type { ArchId, ClassId, CharacterData, Store } from '../types'
import { emptyChar } from '../types'
import { ARCHS, CLASSES, computeTargets } from '../data/classes'
import { DAYS_SHORT } from '../lib/dates'
import { computeXp, levelFromXp, rankOf } from '../lib/xp'

interface CharacterSelectProps {
  store: Store
  saveErr: boolean
  onSelect: (id: string) => void
  onCreate: (id: string, char: CharacterData) => void
}

export function CharacterSelect({ store, saveErr, onSelect, onCreate }: CharacterSelectProps) {
  const profList = Object.entries(store.profiles)
  const [creating, setCreating] = useState(false)

  const [obArch, setObArch] = useState<ArchId | null>(null)
  const [obClass, setObClass] = useState<ClassId | null>(null)
  const [obPseudo, setObPseudo] = useState('')
  const [obWeight, setObWeight] = useState('')
  const [obGoal, setObGoal] = useState('')
  const [obHeight, setObHeight] = useState('')
  const [obAge, setObAge] = useState('')
  const [obSex, setObSex] = useState<'H' | 'F'>('H')
  const [obDays, setObDays] = useState<number[]>([1, 2, 4, 5])
  const [obErr, setObErr] = useState('')

  const cls = obClass ? CLASSES[obClass] : null
  const w = parseFloat(String(obWeight).replace(',', '.'))

  const resetOnboarding = () => {
    setCreating(false)
    setObArch(null)
    setObClass(null)
    setObPseudo('')
    setObWeight('')
    setObGoal('')
    setObHeight('')
    setObAge('')
    setObDays([1, 2, 4, 5])
    setObErr('')
  }

  const submit = () => {
    if (!cls) return
    const g = parseFloat(String(obGoal).replace(',', '.'))
    const h = parseInt(obHeight, 10)
    const a = parseInt(obAge, 10)
    if (!obPseudo.trim()) return setObErr('Il te faut un pseudo !')
    if (!w || w < 35 || w > 250) return setObErr('Poids entre 35 et 250 kg.')
    if (!h || h < 120 || h > 230) return setObErr('Taille entre 120 et 230 cm.')
    if (!a || a < 14 || a > 90) return setObErr('Âge entre 14 et 90 ans.')
    if (!g || g < 35 || g > 250) return setObErr('Écris ton objectif de poids (en kg).')
    if (obDays.length < 3) return setObErr("Choisis au moins 3 jours d'entraînement.")
    const id = obPseudo.trim().toLowerCase()
    if (store.profiles[id]) return setObErr('Ce pseudo existe déjà sur cet appareil.')
    const t = computeTargets(cls.id, w, h, a, obSex)
    const char: CharacterData = {
      ...emptyChar,
      profile: { pseudo: obPseudo.trim(), cls: cls.id, startWeight: w, goal: g, height: h, age: a, sex: obSex, days: obDays, ...t },
      startDate: new Date().toISOString(),
      weighIns: [{ date: new Date().toISOString(), weight: w }],
    }
    onCreate(id, char)
    resetOnboarding()
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[520px] flex-col justify-center px-3.5 pb-10 pt-4">
      <div className="pt-6 text-center">
        <p className="m-0 font-display text-[11.5px] font-semibold tracking-[2.5px] text-accent">IRON QUEST</p>
        <h1 className="m-0 mt-0.5 font-display text-[38px] font-bold leading-tight">
          {creating || !profList.length ? 'CRÉE TON PERSONNAGE' : 'CHOISIS TON PERSONNAGE'}
        </h1>
      </div>

      {saveErr && <p className="mt-2.5 rounded-2xl border border-line bg-surface p-4 text-sm text-red">Sauvegarde échouée — réessaie.</p>}

      {!creating && profList.length > 0 && (
        <div className="mt-3.5">
          {profList.map(([id, d]) => {
            const c = CLASSES[d.profile!.cls]
            const { xp } = computeXp(d, d.profile!.days.length)
            const { lvl } = levelFromXp(xp)
            const r = rankOf(lvl)
            const lw = d.weighIns[d.weighIns.length - 1]
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className="mb-2 flex w-full items-center gap-3 rounded-2xl border-2 border-line bg-surface px-3.5 py-3 text-ink"
              >
                <span className="text-3xl">{c.emoji}</span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-display text-[17px] font-semibold">
                    {d.profile!.pseudo} <span className="text-xs text-accent">· {c.name}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {r.icon} {r.name} · niv. {lvl} · {lw ? lw.weight.toFixed(1) : d.profile!.startWeight} kg → objectif {d.profile!.goal} kg
                  </span>
                </span>
                <span className="text-lg text-accent">▶</span>
              </button>
            )
          })}
          <button onClick={() => setCreating(true)} className="mt-1.5 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted">
            ＋ Nouveau personnage (un pote, un autre objectif…)
          </button>
        </div>
      )}

      {(creating || !profList.length) && (
        <div className="mt-3.5">
          <p className="m-0 mb-2.5 text-center text-xs text-muted">1 · Ton objectif</p>
          <div className="flex gap-1.5">
            {ARCHS.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setObArch(a.id)
                  setObClass(null)
                  setObGoal('')
                  setObErr('')
                }}
                aria-pressed={obArch === a.id}
                className={`flex-1 rounded-[10px] border px-1 py-3 text-center ${
                  obArch === a.id ? 'border-accent bg-surface2 text-ink' : 'border-line bg-transparent text-muted'
                }`}
              >
                <span className="block text-[22px]">{a.emoji}</span>
                <span className="mt-0.5 block text-[11.5px] leading-tight">{a.name}</span>
              </button>
            ))}
          </div>

          {obArch && (
            <>
              <p className="m-0 my-3.5 text-center text-xs text-muted">2 · Ta classe (3 styles de jeu pour cet objectif)</p>
              {Object.values(CLASSES)
                .filter((c) => c.arch === obArch)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setObClass(c.id)
                      setObGoal('')
                      setObErr('')
                    }}
                    aria-pressed={obClass === c.id}
                    className={`mb-2 flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-ink ${
                      obClass === c.id ? 'border-accent bg-surface2' : 'border-line bg-surface'
                    }`}
                  >
                    <span className="text-3xl">{c.emoji}</span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-display text-[17px] font-semibold">
                        {c.name} <span className="text-xs text-accent">· {c.sub}</span>
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{c.desc}</span>
                      {c.extra && <span className="mt-0.5 block text-[11.5px] leading-snug text-blue">Mission de classe : {c.extra}</span>}
                    </span>
                  </button>
                ))}
            </>
          )}

          {cls && (
            <>
              <p className="m-0 my-4 text-center text-xs text-muted">3 · Tes stats (pour calculer TES calories)</p>
              <input
                value={obPseudo}
                onChange={(e) => setObPseudo(e.target.value.slice(0, 16).replace(/[\s/\\'"]/g, ''))}
                placeholder="Ton pseudo de joueur"
                aria-label="Pseudo"
                className="mb-2 w-full rounded-[10px] border border-line bg-surface2 px-3.5 py-3 text-base text-ink"
              />
              <div className="mb-2 flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={obWeight}
                  onChange={(e) => {
                    setObWeight(e.target.value)
                    const ww = parseFloat(e.target.value.replace(',', '.'))
                    if (ww && !obGoal) setObGoal(String(Math.round(cls.goalHint(ww) * 10) / 10))
                  }}
                  placeholder="Poids (kg)"
                  aria-label="Poids actuel en kg"
                  className="min-w-0 flex-1 rounded-[10px] border border-line bg-surface2 px-3.5 py-3 text-base text-ink"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={obHeight}
                  onChange={(e) => setObHeight(e.target.value)}
                  placeholder="Taille (cm)"
                  aria-label="Taille en cm"
                  className="min-w-0 flex-1 rounded-[10px] border border-line bg-surface2 px-3.5 py-3 text-base text-ink"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={obAge}
                  onChange={(e) => setObAge(e.target.value)}
                  placeholder="Âge"
                  aria-label="Âge"
                  className="min-w-0 flex-1 rounded-[10px] border border-line bg-surface2 px-3.5 py-3 text-base text-ink"
                />
              </div>
              <div className="mb-2 flex gap-2">
                {(['H', 'F'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setObSex(v)}
                    aria-pressed={obSex === v}
                    className={`flex-1 rounded-[10px] border px-4 py-2.5 text-sm ${
                      obSex === v ? 'border-accent text-ink' : 'border-line text-muted'
                    }`}
                  >
                    {v === 'H' ? 'Homme' : 'Femme'}
                  </button>
                ))}
              </div>

              <p className="m-0 my-3.5 text-center text-xs text-muted">4 · TON objectif de poids (c'est toi qui décides)</p>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={obGoal}
                onChange={(e) => setObGoal(e.target.value)}
                placeholder={w ? `Suggestion : ${cls.goalHint(w)} kg` : 'Objectif (kg)'}
                aria-label="Poids objectif en kg"
                className="w-full rounded-[10px] border border-line bg-surface2 px-3.5 py-3 text-base text-ink"
              />

              <p className="m-0 my-3.5 text-center text-xs text-muted">5 · Tes jours d'entraînement (3 à 5)</p>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                  const on = obDays.includes(d)
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        const next = on ? obDays.filter((x) => x !== d) : [...obDays, d]
                        if (next.length >= 1 && next.length <= 5) setObDays(next.sort())
                      }}
                      aria-pressed={on}
                      className={`h-11 w-11 rounded-[10px] border font-display text-[12.5px] font-semibold ${
                        on ? 'border-accent bg-accent text-[#1A1A1A]' : 'border-line bg-surface2 text-muted'
                      }`}
                    >
                      {DAYS_SHORT[d]}
                    </button>
                  )
                })}
              </div>
              <p className="mt-1.5 text-center text-xs text-muted">
                {obDays.length} jour{obDays.length > 1 ? 's' : ''}/semaine · évite 2 jours de suite si possible (récupération)
              </p>

              {w > 0 && parseInt(obHeight, 10) > 0 && parseInt(obAge, 10) > 0 && (() => {
                const t = computeTargets(cls.id, w, parseInt(obHeight, 10), parseInt(obAge, 10), obSex)
                return (
                  <p className="mt-2.5 text-center text-xs text-accent">
                    → Tes cibles calculées : <b>{t.kcal} kcal</b> et <b>{t.prot} g de protéines</b> / jour
                  </p>
                )
              })()}

              {obErr && <p className="mt-2 text-center text-sm text-red">{obErr}</p>}
              <button onClick={submit} className="mt-3 w-full rounded-[10px] bg-accent px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]">
                LANCER LA PARTIE {cls.emoji}
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                ⚠️ Classement entre amis : ton pseudo, ta classe, ton niveau et ton XP seront visibles par tous ceux qui utilisent cette appli. Poids, mensurations et repas restent privés.
              </p>
            </>
          )}
          {profList.length > 0 && (
            <button
              onClick={() => {
                setCreating(false)
                setObArch(null)
                setObClass(null)
                setObErr('')
              }}
              className="mt-2.5 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted"
            >
              ← Retour à la sélection
            </button>
          )}
        </div>
      )}
    </div>
  )
}
