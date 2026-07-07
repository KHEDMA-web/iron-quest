import { useState } from 'react'
import type { CharacterData, Meal } from '../../types'
import type { GameCompute } from '../../lib/gameCompute'
import { applyExoName } from '../../lib/gameCompute'
import { ALT } from '../../data/phases'
import { MENUS } from '../../data/menus'
import { DAYS_FR } from '../../lib/dates'
import { XP } from '../../lib/xp'
import { Gauge } from '../Gauge'

interface DayTabProps {
  data: CharacterData
  game: GameCompute
  persist: (next: CharacterData) => void
}

export function DayTab({ data, game, persist }: DayTabProps) {
  const { profile, cls, tk, dow, isTrainDay, doneToday, session, weekWorkouts, weeklyTarget, meals, mealsToday, quests } = game

  const [exoWeights, setExoWeights] = useState<Record<string, string>>({})
  const [exoDone, setExoDone] = useState<Record<string, boolean>>({})
  const [forceTrain, setForceTrain] = useState(false)
  const [editMeal, setEditMeal] = useState<string | null>(null)
  const [editItems, setEditItems] = useState('')
  const [editKcal, setEditKcal] = useState('')
  const [editProt, setEditProt] = useState('')
  const [swapExo, setSwapExo] = useState<string | null>(null)
  const [customExo, setCustomExo] = useState('')

  const setSwap = (orig: string, repl: string | null) => {
    const next = { ...data.exoSwaps }
    if (repl) next[orig] = repl
    else delete next[orig]
    persist({ ...data, exoSwaps: next })
    setSwapExo(null)
    setCustomExo('')
  }

  const finishWorkout = () => {
    const weights: Record<string, number> = {}
    session.exos.forEach(([name]) => {
      const applied = applyExoName(data, name)
      const v = parseFloat(String(exoWeights[applied] ?? '').replace(',', '.'))
      if (v > 0) weights[applied] = v
    })
    persist({
      ...data,
      workouts: [...data.workouts, { day: tk, phase: game.phase.id, session: session.key, weights }],
      lastWeights: { ...data.lastWeights, ...weights },
    })
    setExoWeights({})
    setExoDone({})
    setForceTrain(false)
  }

  const toggleMeal = (id: string) => persist({ ...data, meals: { ...data.meals, [tk]: { ...mealsToday, [id]: !mealsToday[id] } } })

  const openMealEditor = (m: (typeof meals)[number]) => {
    setEditMeal(m.id)
    setEditItems(m.items.join('\n'))
    setEditKcal(String(m.kcal))
    setEditProt(String(m.p))
  }

  const saveMealEdit = (mealId: string) => {
    const items = editItems.split('\n').map((s) => s.trim()).filter(Boolean)
    if (!items.length) return
    const base = meals.find((m) => m.id === mealId)!
    // Number.isFinite et pas || : un 0 explicite (repas allégé) doit être gardé.
    const kcalV = parseInt(editKcal, 10)
    const protV = parseInt(editProt, 10)
    persist({
      ...data,
      mealOverrides: {
        ...data.mealOverrides,
        [`${dow}-${mealId}`]: {
          items,
          kcal: Number.isFinite(kcalV) && kcalV >= 0 ? kcalV : base.kcal,
          p: Number.isFinite(protV) && protV >= 0 ? protV : base.p,
          custom: true,
        },
      },
    })
    setEditMeal(null)
  }

  const resetMeal = (mealId: string) => {
    const next = { ...data.mealOverrides }
    delete next[`${dow}-${mealId}`]
    persist({ ...data, mealOverrides: next })
    setEditMeal(null)
  }

  const swapMealFromDay = (mealId: string, otherDay: number) => {
    const src = MENUS[otherDay].meals.find((m) => m.id === mealId)
    if (!src) return
    persist({
      ...data,
      mealOverrides: { ...data.mealOverrides, [`${dow}-${mealId}`]: { items: src.items, kcal: src.kcal, p: src.p, steps: src.steps, from: MENUS[otherDay].name } },
    })
    setEditMeal(null)
  }

  /** Repioche une autre recette pour ce créneau (les 7 jours du plan + le pool de recettes
   * additionnelles, chargé à la demande pour ne pas alourdir le bundle initial) : ingrédients,
   * kcal et protéines changent avec. */
  const regenerateMeal = async (mealId: string) => {
    const current = meals.find((m) => m.id === mealId)
    if (!current) return
    const signature = current.items.join('|')
    const candidates: { menuName: string; meal: Omit<Meal, 'id'> }[] = []
    MENUS.forEach((mn) => {
      const m = mn.meals.find((x) => x.id === mealId)
      if (m && m.items.join('|') !== signature) candidates.push({ menuName: mn.name, meal: m })
    })
    const { RECIPE_POOL_B, RECIPE_POOL_D, RECIPE_POOL_L, RECIPE_POOL_S } = await import('../../data/recipePool')
    const pool = { b: RECIPE_POOL_B, l: RECIPE_POOL_L, s: RECIPE_POOL_S, d: RECIPE_POOL_D }[mealId] || []
    pool.forEach((r) => {
      if (r.meal.items.join('|') !== signature) candidates.push({ menuName: r.name, meal: r.meal })
    })
    if (!candidates.length) return
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
    persist({
      ...data,
      mealOverrides: {
        ...data.mealOverrides,
        [`${dow}-${mealId}`]: { items: pick.meal.items, kcal: pick.meal.kcal, p: pick.meal.p, steps: pick.meal.steps, from: `régénéré, ${pick.menuName.toLowerCase()}` },
      },
    })
  }

  const sum = (f: (m: (typeof meals)[number]) => number) => meals.filter((m) => mealsToday[m.id]).reduce((s, m) => s + (f(m) || 0), 0)

  return (
    <section>
      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🗡️ Quêtes de la semaine</p>
        {quests.map((q) => (
          <div key={q.name} className="flex items-center justify-between gap-2.5 py-1.5">
            <span className={`text-[13px] ${q.done ? 'text-green' : 'text-ink'}`}>
              {q.done ? '✓ ' : '○ '}
              {q.name}
            </span>
            <span className="whitespace-nowrap text-[11px] text-purple">{q.xp}</span>
          </div>
        ))}
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          Gains : séance +{XP.workout} XP · repas coché +{XP.meal} XP · pesée +{XP.weighIn} XP. L'XP se gagne en vrai, pas en cochant pour cocher 😉
        </p>
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🏋️ {DAYS_FR[dow].toUpperCase()}</p>
          <span className="text-xs text-muted">
            {weekWorkouts}/{weeklyTarget} séances
          </span>
        </div>

        {doneToday ? (
          <p className="mt-2 text-sm text-green">✓ Séance validée : +{XP.workout} XP. Maintenant : protéines, vrai repas dans les 2 h, 8 h de sommeil.</p>
        ) : isTrainDay || forceTrain ? (
          <>
            <p className="mb-0.5 mt-1.5 font-display text-[22px] font-semibold">{session.name}</p>
            <p className="mb-2.5 text-[12.5px] leading-relaxed text-muted">
              Échauffement : 5 min cardio + 2 séries légères du premier exo. ⇄ pour remplacer un exercice.
              {cls.extra && ` ${cls.emoji} Mission ${cls.name} : ${cls.extra}`}
            </p>
            {session.exos.map(([name, sets, rest, cue]) => {
              const applied = applyExoName(data, name)
              const swapped = applied !== name
              const lastW = data.lastWeights[applied]
              const done = !!exoDone[applied]
              const open = swapExo === name
              return (
                <div key={name}>
                  <div className={`mb-2 flex items-center gap-1.5 rounded-[10px] border bg-surface2 p-2.5 ${done ? 'border-green' : 'border-line'} ${open ? 'rounded-b-none' : ''}`}>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[14.5px] font-medium">{applied}</p>
                      {swapped && <p className="m-0 mt-0.5 text-[11px] text-blue">au lieu de : {name}</p>}
                      <p className="m-0 mt-0.5 font-display text-xs tracking-wide text-accent">
                        {sets} · repos {rest}
                      </p>
                      {lastW && (
                        <p className="m-0 mt-0.5 text-xs text-muted">
                          Dernière fois : {lastW} kg → vise <b className="text-green">{(lastW + 2.5).toFixed(1).replace(/\.0$/, '')} kg</b>
                        </p>
                      )}
                      {cue && !swapped && <p className="m-0 mt-0.5 text-[11.5px] italic text-muted">{cue}</p>}
                    </div>
                    <button
                      onClick={() => {
                        setSwapExo(open ? null : name)
                        setCustomExo('')
                      }}
                      aria-label={`Remplacer ${applied}`}
                      aria-expanded={open}
                      className="h-9 w-8 shrink-0 rounded-[9px] border border-line bg-transparent text-[15px] text-blue"
                    >
                      ⇄
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      inputMode="decimal"
                      placeholder={lastW ? String(lastW + 2.5) : 'kg'}
                      value={exoWeights[applied] ?? ''}
                      onChange={(e) => setExoWeights({ ...exoWeights, [applied]: e.target.value })}
                      aria-label={`Charge pour ${applied}`}
                      className="w-14 shrink-0 rounded-lg border border-line bg-bg px-1 py-2 text-center text-[15px] text-ink"
                    />
                    <button
                      onClick={() => setExoDone({ ...exoDone, [applied]: !done })}
                      aria-pressed={done}
                      aria-label={`${applied} terminé`}
                      className={`h-9 w-9 shrink-0 rounded-[9px] text-base font-bold ${done ? 'glow-green bg-green text-bg' : 'bg-surface2 text-muted'}`}
                    >
                      ✓
                    </button>
                  </div>
                  {open && (
                    <div className="mb-2 rounded-b-[10px] border border-t-0 border-line bg-bg p-3">
                      <p className="mb-1.5 text-[12.5px] text-muted">Remplacer par (même groupe musculaire) :</p>
                      {(ALT[name] || []).map((alt) => (
                        <button key={alt} onClick={() => setSwap(name, alt)} className="mb-1.5 mr-1.5 inline-block rounded-lg border border-line bg-surface2 px-3 py-1.5 text-[12.5px] text-ink">
                          {alt}
                        </button>
                      ))}
                      <div className="mt-1.5 flex gap-1.5">
                        <input
                          value={customExo}
                          onChange={(e) => setCustomExo(e.target.value)}
                          placeholder="Autre exercice…"
                          aria-label="Exercice de remplacement personnalisé"
                          className="min-w-0 flex-1 rounded-[10px] border border-line bg-surface2 px-2.5 py-2 text-[13px] text-ink"
                        />
                        <button onClick={() => customExo.trim() && setSwap(name, customExo.trim())} className="rounded-[10px] bg-accent px-3 py-2 text-xs font-semibold uppercase text-[#1A1A1A]">
                          OK
                        </button>
                      </div>
                      {swapped && (
                        <button onClick={() => setSwap(name, null)} className="mt-1.5 w-full rounded-[10px] border border-line px-4 py-1.5 text-xs text-muted">
                          Rétablir « {name} »
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            <button
              onClick={finishWorkout}
              className="mt-2.5 w-full rounded-[10px] bg-accent px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] transition-transform duration-100 active:scale-[0.97]"
            >
              TERMINER LA SÉANCE · +{XP.workout} XP
            </button>
          </>
        ) : (
          <>
            <p className="mb-1 mt-2 text-sm">
              Aujourd'hui : <b className="text-blue">repos</b> — c'est là que le personnage monte ses stats.
            </p>
            <p className="text-[12.5px] leading-relaxed text-muted">
              Prochaine séance : {DAYS_FR[game.trainDays.find((d) => d > dow) ?? game.trainDays[0]]} — {session.name}. Marche 20-30 min, étirements, et mange ton quota complet.
            </p>
            <button onClick={() => setForceTrain(true)} className="mt-2.5 w-full rounded-[10px] border border-line px-4 py-2.5 text-sm text-muted">
              Je veux m'entraîner quand même
            </button>
          </>
        )}
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">🍽️ Menu du {MENUS[dow].name.toLowerCase()}</p>
          <span className="text-[11.5px] text-muted">
            Tes cibles : {profile.kcal} kcal · {profile.prot} g P
          </span>
        </div>
        <div className="my-2.5">
          <Gauge label="Calories" value={sum((m) => m.kcal)} max={profile.kcal} unit="kcal" color="#FFB020" />
          <Gauge label="Protéines" value={sum((m) => m.p)} max={profile.prot} unit="g" color="#57C88B" />
        </div>
        <p className="mb-1.5 text-[12.5px] text-blue">
          {cls.emoji} {cls.mealNote}
        </p>
        {isTrainDay && <p className="mb-1.5 text-[12.5px] text-muted">Jour d'entraînement : déjeuner 1h30-2h avant la séance, protéines rapidement après, dîner complet le soir.</p>}

        {meals.map((m) => {
          const on = !!mealsToday[m.id]
          const modified = !!data.mealOverrides[`${dow}-${m.id}`]
          const editing = editMeal === m.id
          const skippable = m.shake && (cls.arch === 'seche' || (cls.arch === 'forme' && profile.cls !== 'ronin'))
          return (
            <div key={m.id} className={`mt-2 flex w-full flex-col rounded-[10px] border bg-surface2 p-3 text-ink ${on ? 'border-green' : 'border-line'} ${on && !editing ? 'opacity-70' : ''}`}>
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => toggleMeal(m.id)}
                  aria-pressed={on}
                  aria-label={`${m.title} mangé`}
                  className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 text-sm font-bold text-bg ${on ? 'glow-green' : ''}`}
                  style={{ background: on ? '#57C88B' : 'transparent', borderColor: on ? '#57C88B' : '#8B93A1' }}
                >
                  {on ? '✓' : ''}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className={`font-display text-[13.5px] uppercase tracking-wide ${on ? 'text-green' : 'text-ink'}`}>
                      {m.title}
                      {modified && <span className="text-[10px] text-blue"> · MODIFIÉ{m.from ? ` (${m.from})` : ''}</span>}
                      {skippable && <span className="text-[10px] text-red"> · À SAUTER ({cls.name})</span>}
                    </span>
                    <span className="whitespace-nowrap text-[11.5px] text-muted">
                      {m.kcal} kcal · {m.p} g P
                    </span>
                  </div>
                  {!editing && <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{m.items.join(' · ')}</p>}
                </div>
                <button
                  onClick={() => regenerateMeal(m.id)}
                  aria-label={`Régénérer ${m.title}`}
                  title="Piocher une autre recette pour ce repas (kcal/protéines recalculés)"
                  className="h-9 w-8 shrink-0 rounded-[9px] border border-line bg-transparent text-[15px] text-purple"
                >
                  🎲
                </button>
                <button
                  onClick={() => (editing ? setEditMeal(null) : openMealEditor(m))}
                  aria-label={`Modifier ${m.title}`}
                  aria-expanded={editing}
                  className="h-9 w-8 shrink-0 rounded-[9px] border border-line bg-transparent text-[15px] text-blue"
                >
                  ✎
                </button>
              </div>

              {editing && (
                <div className="mt-2.5 border-t border-line pt-2.5">
                  <p className="mb-1.5 text-[12.5px] text-muted">Un ingrédient par ligne :</p>
                  <textarea
                    value={editItems}
                    onChange={(e) => setEditItems(e.target.value)}
                    rows={4}
                    aria-label="Ingrédients du repas"
                    className="w-full resize-y rounded-[10px] border border-line bg-bg p-2.5 text-sm leading-relaxed text-ink"
                  />
                  <div className="mt-2 flex gap-2">
                    <label className="flex-1 text-[12.5px] text-muted">
                      kcal
                      <input type="number" value={editKcal} onChange={(e) => setEditKcal(e.target.value)} className="mt-1 w-full rounded-[10px] border border-line bg-surface2 px-2.5 py-2 text-sm text-ink" />
                    </label>
                    <label className="flex-1 text-[12.5px] text-muted">
                      protéines (g)
                      <input type="number" value={editProt} onChange={(e) => setEditProt(e.target.value)} className="mt-1 w-full rounded-[10px] border border-line bg-surface2 px-2.5 py-2 text-sm text-ink" />
                    </label>
                  </div>
                  <button onClick={() => saveMealEdit(m.id)} className="mt-2.5 w-full rounded-[10px] bg-accent px-4 py-2.5 text-[13px] font-semibold uppercase text-[#1A1A1A]">
                    Enregistrer ma version
                  </button>
                  <p className="mb-1 mt-2.5 text-[12.5px] text-muted">Ou prendre le même repas d'un autre jour :</p>
                  <div className="flex flex-wrap gap-1.5">
                    {MENUS.map(
                      (mn, i) =>
                        i !== dow &&
                        mn.meals.some((x) => x.id === m.id) && (
                          <button key={mn.name} onClick={() => swapMealFromDay(m.id, i)} className="inline-block rounded-lg border border-line bg-surface2 px-3 py-1.5 text-[12.5px] text-ink">
                            {mn.name}
                          </button>
                        ),
                    )}
                  </div>
                  {modified && (
                    <button onClick={() => resetMeal(m.id)} className="mt-2 w-full rounded-[10px] border border-line px-4 py-1.5 text-xs text-muted">
                      Rétablir le repas d'origine
                    </button>
                  )}
                  <p className="mt-2 text-[12.5px] text-muted">
                    S'applique à tous les {MENUS[dow].name.toLowerCase()}s. Vise ± le même total de kcal. Équivalences malines dans l'onglet Nutri.
                  </p>
                </div>
              )}
            </div>
          )
        })}
        <p className="mt-2 text-[12.5px] text-muted">💧 2,5-3 L d'eau. Viandes/poissons en poids cru.</p>
      </div>
    </section>
  )
}
