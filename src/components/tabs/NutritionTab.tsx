import type { GameCompute } from '../../lib/gameCompute'
import { SWAPS } from '../../data/menus'
import { Stat } from '../Gauge'

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

interface NutritionTabProps {
  game: GameCompute
}

export function NutritionTab({ game }: NutritionTabProps) {
  const { profile, cls, weeklyTarget } = game

  return (
    <section>
      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">{cls.emoji} Tes cibles — calculées pour TOI</p>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <Stat label="Calories" value={`${profile.kcal}`} unit="kcal / jour" color="#FFB020" />
          <Stat label="Protéines" value={`${profile.prot}`} unit="g / jour" color="#57C88B" />
        </div>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">
          Basé sur tes stats ({profile.height} cm, {profile.startWeight} kg de départ, {profile.age} ans) avec {weeklyTarget} séances/semaine
          {cls.arch === 'masse' && `, + un surplus de ~${cls.delta} kcal (réglage ${cls.name}) pour construire sans stocker.`}
          {cls.arch === 'seche' && `, − un déficit de ~${Math.abs(cls.delta)} kcal (réglage ${cls.name}) : le gras part, les protéines hautes gardent le muscle.`}
          {cls.arch === 'forme' && ` (réglage ${cls.name}) : proche de l'équilibre, tu te renforces sans bouger la balance.`}
        </p>
        <p className="mt-1.5 text-[12.5px] text-muted">{cls.mealNote}</p>
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">💱 Introuvable ou trop cher ? Remplace.</p>
        <p className="my-1 text-[12.5px] leading-relaxed text-muted">
          Les menus sont des modèles, pas des dogmes. Échange avec ces équivalences, puis modifie le repas (bouton ✎) pour que ça reste enregistré.
        </p>
        {SWAPS.map(([a, b]) => (
          <div key={a} className="mt-2">
            <p className="m-0 text-[13.5px] font-semibold text-accent">{a}</p>
            <p className="m-0 mt-0.5 text-[13px] leading-relaxed text-muted">→ {b}</p>
          </div>
        ))}
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">⏱️ Le timing qui compte</p>
        {TIMING.map(([t, d]) => (
          <div key={t} className="mt-2.5">
            <p className="m-0 text-[13.5px] font-semibold text-accent">{t}</p>
            <p className="m-0 mt-0.5 text-[13px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </div>

      <div className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <p className="m-0 font-display text-[14.5px] font-semibold uppercase tracking-wide">💊 Suppléments : le vrai du faux</p>
        {SUPPLEMENTS.map(([t, d, col]) => (
          <div key={t} className="mt-2.5">
            <p className="m-0 text-[13.5px] font-semibold" style={{ color: col }}>
              {t}
            </p>
            <p className="m-0 mt-0.5 text-[13px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
