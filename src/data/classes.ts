import type { Arch, ArchId, ClassDef, ClassId } from '../types'

export const ARCHS: Arch[] = [
  { id: 'masse', emoji: '💪', name: 'Prendre du muscle', verb: 'à prendre' },
  { id: 'seche', emoji: '🔥', name: 'Perdre du gras', verb: 'à perdre' },
  { id: 'forme', emoji: '⚖️', name: 'Rester en forme', verb: 'de maintien' },
]

export const CLASSES: Record<ClassId, ClassDef> = {
  colosse: {
    id: 'colosse', arch: 'masse', emoji: '⚔️', name: 'Le Colosse', sub: 'Force brute',
    desc: 'Tu vis pour la barre. Surplus solide, charges lourdes, records de force avant tout.',
    delta: 450, protPerKg: 2.0, goalHint: (w) => w + 10,
    mealNote: 'Menus tels quels, shake compris. Ton arme : le surplus.',
    extra: 'Prends tes temps de repos COMPLETS sur les gros exos (3 min) : la force se construit reposé.',
  },
  titan: {
    id: 'titan', arch: 'masse', emoji: '🗿', name: 'Le Titan', sub: 'Masse maximale',
    desc: 'Tu veux prendre le plus possible. Gros surplus, grosses portions, croissance avant tout.',
    delta: 550, protPerKg: 2.2, goalHint: (w) => w + 12,
    mealNote: "Menus tels quels + 1 collation en plus (fruit + poignée de cacahuètes). Manger, c'est ta mission.",
    extra: "Ne saute JAMAIS un repas. Si le poids monte trop vite (>1,5 kg/mois), l'appli te le dira dans Poids.",
  },
  spartiate: {
    id: 'spartiate', arch: 'masse', emoji: '🏛️', name: 'Le Spartiate', sub: 'Muscle esthétique',
    desc: 'Tu construis sec : du muscle sans (trop de) gras. Lean bulk patient et propre.',
    delta: 300, protPerKg: 2.0, goalHint: (w) => w + 8,
    mealNote: 'Menus tels quels mais shake allégé (sans beurre de cacahuète) : surplus modéré, prise propre.',
    extra: "Finis chaque séance par 10 min d'abdos/gainage.",
  },
  assassin: {
    id: 'assassin', arch: 'seche', emoji: '🗡️', name: "L'Assassin", sub: 'Sèche efficace',
    desc: 'Tu tailles dans le gras en gardant le muscle. Déficit franc + protéines hautes.',
    delta: -450, protPerKg: 2.2, goalHint: (w) => w - 8,
    mealNote: 'Mêmes menus MAIS : saute le shake et divise les féculents par 2.',
    extra: 'Ajoute 20 min de cardio en fin de séance.',
  },
  rodeur: {
    id: 'rodeur', arch: 'seche', emoji: '🏹', name: 'Le Rôdeur', sub: 'Cardio & endurance',
    desc: "Tu perds du gras en bougeant beaucoup. La dépense d'abord, l'assiette ensuite.",
    delta: -350, protPerKg: 2.0, goalHint: (w) => w - 8,
    mealNote: "Saute le shake, réduis les féculents d'un tiers.",
    extra: 'Ajoute 2 sorties cardio (course, vélo, foot…) de 30-45 min dans ta semaine, les jours off.',
  },
  moine: {
    id: 'moine', arch: 'seche', emoji: '🧘', name: 'Le Moine', sub: 'Perte durable',
    desc: 'Doucement mais sûrement. Petit déficit, zéro frustration, des habitudes qui durent à vie.',
    delta: -300, protPerKg: 2.0, goalHint: (w) => w - 6,
    mealNote: "Saute le shake. Pas d'interdits : la régularité bat la perfection.",
    extra: '8 000 pas par jour minimum — la marche est ton arme secrète.',
  },
  gardien: {
    id: 'gardien', arch: 'forme', emoji: '🛡️', name: 'Le Gardien', sub: 'Équilibre général',
    desc: 'Tu maintiens et tu te renforces. Équilibre, régularité, solidité.',
    delta: 0, protPerKg: 1.6, goalHint: (w) => w,
    mealNote: 'Mêmes menus sans le shake. Ta quête : la régularité, pas la balance.',
    extra: null,
  },
  paladin: {
    id: 'paladin', arch: 'forme', emoji: '✨', name: 'Le Paladin', sub: 'Santé & longévité',
    desc: "Tu t'entraînes pour être bien dans 40 ans : dos solide, cœur en forme, corps mobile.",
    delta: 0, protPerKg: 1.6, goalHint: (w) => w,
    mealNote: 'Mêmes menus sans le shake ; maximise légumes et poissons gras.',
    extra: '10 min de mobilité/étirements chaque jour, même les jours off.',
  },
  ronin: {
    id: 'ronin', arch: 'forme', emoji: '🥷', name: 'Le Ronin', sub: 'Athlétique & explosif',
    desc: 'Tu veux être rapide, puissant, fonctionnel. La performance avant l’apparence.',
    delta: 100, protPerKg: 1.8, goalHint: (w) => w + 2,
    mealNote: 'Mêmes menus avec un demi-shake (sans avoine).',
    extra: "Ajoute sprints courts ou corde à sauter en fin d'échauffement (5 min).",
  },
}

export const archOf = (clsId: ClassId): Arch => {
  const arch: ArchId = CLASSES[clsId]?.arch ?? 'masse'
  return ARCHS.find((a) => a.id === arch)!
}

export interface TargetsDetail {
  bmr: number
  tdee: number
  delta: number
  kcal: number
  protPerKg: number
  prot: number
}

/** Mifflin-St Jeor × activité modérée + delta de classe, avec le détail du calcul (pour l'affichage). */
export function computeTargetsDetailed(cls: ClassId, w: number, h: number, age: number, sex: 'H' | 'F'): TargetsDetail {
  const bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'F' ? -161 : 5)
  const tdee = bmr * 1.55
  const { delta, protPerKg } = CLASSES[cls]
  const kcal = Math.max(1500, Math.round((tdee + delta) / 50) * 50)
  const prot = Math.round((w * protPerKg) / 5) * 5
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), delta, kcal, protPerKg, prot }
}

export function computeTargets(cls: ClassId, w: number, h: number, age: number, sex: 'H' | 'F') {
  const { kcal, prot } = computeTargetsDetailed(cls, w, h, age, sex)
  return { kcal, prot }
}
