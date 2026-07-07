import { useState } from 'react'
import type { CharacterData } from '../../types'
import { getMeal, type GameCompute } from '../../lib/gameCompute'
import { computeTargetsDetailed } from '../../data/classes'
import { SWAPS, MENUS } from '../../data/menus'
import { DAYS_FR, DAYS_SHORT, dayKey, weekDates } from '../../lib/dates'
import { StatCard } from '../StatCard'
import { Disclosure } from '../Disclosure'
import { ShoppingTab } from './ShoppingTab'

const TIMING: [string, string][] = [
  ['Avant la séance (1h30-2h)', 'Un vrai repas avec glucides + protéines. Si séance le matin : banane + shake 45 min avant.'],
  ['Après la séance (0-2h)', "Protéines rapidement, puis un repas complet dans les 2 h. C'est la fenêtre où ton corps utilise le mieux ce que tu manges."],
  ['Avant de dormir', 'Une source de protéines au dîner suffit. Le sommeil (7h30-9h) fait le reste — c’est ton buff de régénération naturel.'],
  ['Jours de repos', 'Mêmes calories ! Le muscle se construit les jours OFF. Ne réduis jamais les portions un jour de repos.'],
]

const SUPPLEMENTS: [string, string, string][] = [
  ['Créatine monohydrate — UTILE', '3-5 g/jour, tous les jours. Le supplément le plus étudié au monde : +5-10 % de force, meilleure récupération. 15-20 €/6 mois.', '#57C88B'],
  ['Vitamine D — UTILE (octobre → avril)', "1 000-2 000 UI/jour. La majorité des gens en manquent l'hiver. Demande conseil à ton pharmacien.", '#57C88B'],
  ['Protéine en poudre — OPTIONNEL', 'Le plan atteint la cible sans. En dépannage : protéine végétale (pois/riz) ou whey isolate.', '#6FA8DC'],
  ['Gainers, BCAA, boosters — INUTILE', 'Les gainers = sucre hors de prix. Les BCAA ne servent à rien si tu manges assez de protéines. Garde tes pièces d’or.', '#E06C6C'],
]

const ARCH_EXPLAIN: Record<string, string> = {
  masse: 'un surplus qui construit sans (trop) stocker',
  seche: 'un déficit qui fait fondre le gras sans toucher au muscle',
  forme: 'un quasi-équilibre : tu te renforces sans faire bouger la balance',
}

interface NutritionTabProps {
  data: CharacterData
  game: GameCompute
  persist: (next: CharacterData) => void
}

export function NutritionTab({ data, game, persist }: NutritionTabProps) {
  const { profile, cls, weeklyTarget, tk } = game
  const [view, setView] = useState<'repas' | 'courses'>('repas')
  const [recipeDay, setRecipeDay] = useState(game.dow)

  const detail = computeTargetsDetailed(profile.cls, profile.startWeight, profile.height, profile.age, profile.sex)
  const perMeal = { kcal: Math.round(profile.kcal / 4), prot: Math.round(profile.prot / 4) }

  const weekOverview = weekDates().map((date) => {
    const dow = date.getDay()
    const menu = MENUS[dow]
    const checks = data.meals[dayKey(date)] || {}
    const done = menu.meals.filter((m) => checks[m.id]).length
    return { key: dayKey(date), dow, menu, checks, done, total: menu.meals.length }
  })
  const weekDone = weekOverview.reduce((s, d) => s + d.done, 0)
  const weekTotal = weekOverview.reduce((s, d) => s + d.total, 0)

  const recipeMenu = MENUS[recipeDay]

  return (
    <section>
      <div className="mb-3 flex gap-1 rounded-xl bg-surface p-1">
        {(
          [
            ['repas', '🍽️ Repas'],
            ['courses', '🛒 Courses'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            aria-pressed={view === id}
            className={`flex-1 rounded-lg py-2.5 font-display text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${
              view === id ? 'bg-accent text-[#1A1A1A]' : 'bg-transparent text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'courses' ? (
        <ShoppingTab data={data} game={game} persist={persist} />
      ) : (
        <>
      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">{cls.emoji} Tes cibles — calculées pour TOI</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          Réglage {cls.name} : {ARCH_EXPLAIN[cls.arch]}. Clique un chiffre pour voir le calcul complet.
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <StatCard label="Calories" value={`${profile.kcal}`} unit="kcal / jour" color="#FFB020">
            <span className="block">
              Métabolisme de base (Mifflin-St Jeor) : <b>{detail.bmr} kcal</b>
              <br />
              × 1,55 (activité, {weeklyTarget} séances/sem.) = <b>{detail.tdee} kcal</b> d'entretien
              <br />
              {detail.delta >= 0 ? '+' : ''}
              {detail.delta} kcal (réglage {cls.name}) → <b>{profile.kcal} kcal/jour</b>
            </span>
            <span className="mt-1.5 block text-muted">≈ {perMeal.kcal} kcal par repas sur 4 repas.</span>
          </StatCard>
          <StatCard label="Protéines" value={`${profile.prot}`} unit="g / jour" color="#57C88B">
            <span className="block">
              {detail.protPerKg} g/kg × {profile.startWeight} kg (poids de départ) → <b>{profile.prot} g/jour</b>
            </span>
            <span className="mt-1.5 block text-muted">
              ≈ {perMeal.prot} g par repas sur 4 repas — vise plutôt {perMeal.prot}-{perMeal.prot + 5} g.
            </span>
          </StatCard>
        </div>
        <p className="mt-2.5 text-[12.5px] text-blue">
          {cls.emoji} {cls.mealNote}
        </p>
      </div>

      <Disclosure icon="📅" title="Suivi des repas de la semaine" subtitle={`${weekDone}/${weekTotal} repas cochés cette semaine`} defaultOpen>
        {weekOverview.map(({ key, dow, menu, checks, done, total }) => {
          const isToday = key === tk
          return (
            <div key={key} className={`flex items-center justify-between gap-2 border-b border-line py-2 last:border-b-0 ${isToday ? 'text-accent' : 'text-ink'}`}>
              <span className="text-[12.5px] capitalize">
                {DAYS_FR[dow]}
                {isToday && <span className="text-muted"> · aujourd'hui</span>}
              </span>
              <span className="flex items-center gap-2">
                <span className="flex gap-1">
                  {menu.meals.map((m) => (
                    <span
                      key={m.id}
                      title={`${m.title} — ${checks[m.id] ? 'mangé' : 'pas encore'}`}
                      className={`h-2 w-2 rounded-full ${checks[m.id] ? 'bg-green' : 'bg-line'}`}
                    />
                  ))}
                </span>
                <span className="w-8 text-right text-[11px] text-muted">
                  {done}/{total}
                </span>
              </span>
            </div>
          )
        })}
        <p className="mt-2 text-[12px] text-muted">Coche tes repas au jour le jour dans l'onglet Jour — ce suivi se met à jour tout seul.</p>
      </Disclosure>

      <Disclosure icon="🍳" title="La recette de chaque repas" subtitle="Étapes de préparation, jour par jour">
        <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
          {DAYS_SHORT.map((short, i) => (
            <button
              key={short}
              onClick={() => setRecipeDay(i)}
              aria-pressed={recipeDay === i}
              className={`shrink-0 rounded-lg px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wide transition-colors duration-150 ${
                recipeDay === i ? 'bg-accent text-[#1A1A1A]' : 'bg-surface2 text-muted'
              }`}
            >
              {short}
            </button>
          ))}
        </div>
        {recipeMenu.meals.map((raw) => {
          const m = getMeal(data, recipeDay, raw)
          return (
            <div key={m.id} className="mb-3 border-b border-line pb-3 last:mb-0 last:border-b-0 last:pb-0">
              <p className="m-0 flex items-baseline justify-between gap-2">
                <span className="font-display text-[13.5px] font-semibold uppercase tracking-wide text-accent">{m.title}</span>
                <span className="whitespace-nowrap text-[11px] text-muted">
                  {m.kcal} kcal · {m.p} g P
                </span>
              </p>
              <p className="m-0 mt-1 text-[12.5px] text-muted">{m.items.join(' · ')}</p>
              <ol className="m-0 mt-1.5 list-decimal space-y-1 pl-4 text-[12.5px] leading-relaxed text-ink">
                {m.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          )
        })}
      </Disclosure>

      <Disclosure icon="💱" title="Introuvable ou trop cher ? Remplace." subtitle={`${SWAPS.length} équivalences malines`}>
        <p className="m-0 mb-2 text-[12.5px] leading-relaxed text-muted">
          Les menus sont des modèles, pas des dogmes. Échange avec ces équivalences, puis modifie le repas (bouton ✎ dans l'onglet Jour) pour que ça reste enregistré.
        </p>
        {SWAPS.map(([a, b]) => (
          <div key={a} className="mt-2">
            <p className="m-0 text-[13.5px] font-semibold text-accent">{a}</p>
            <p className="m-0 mt-0.5 text-[13px] leading-relaxed text-muted">→ {b}</p>
          </div>
        ))}
      </Disclosure>

      <Disclosure icon="⏱️" title="Le timing qui compte" subtitle="Avant/après séance, sommeil, jours off">
        {TIMING.map(([t, d]) => (
          <div key={t} className="mt-2 first:mt-0">
            <p className="m-0 text-[13.5px] font-semibold text-accent">{t}</p>
            <p className="m-0 mt-0.5 text-[13px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </Disclosure>

      <Disclosure icon="💊" title="Suppléments : le vrai du faux" subtitle="Ce qui marche, ce qui ne sert à rien">
        {SUPPLEMENTS.map(([t, d, col]) => (
          <div key={t} className="mt-2 first:mt-0">
            <p className="m-0 text-[13.5px] font-semibold" style={{ color: col }}>
              {t}
            </p>
            <p className="m-0 mt-0.5 text-[13px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </Disclosure>
        </>
      )}
    </section>
  )
}
