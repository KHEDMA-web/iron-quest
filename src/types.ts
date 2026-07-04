export type Sex = 'H' | 'F'
export type ArchId = 'masse' | 'seche' | 'forme'
export type ClassId =
  | 'colosse' | 'titan' | 'spartiate'
  | 'assassin' | 'rodeur' | 'moine'
  | 'gardien' | 'paladin' | 'ronin'

export interface Arch {
  id: ArchId
  emoji: string
  name: string
  verb: string
}

export interface ClassDef {
  id: ClassId
  arch: ArchId
  emoji: string
  name: string
  sub: string
  desc: string
  delta: number
  protPerKg: number
  goalHint: (w: number) => number
  mealNote: string
  extra: string | null
}

export interface Profile {
  pseudo: string
  cls: ClassId
  startWeight: number
  goal: number
  height: number
  age: number
  sex: Sex
  days: number[]
  kcal: number
  prot: number
}

export interface Meal {
  id: string
  title: string
  kcal: number
  p: number
  items: string[]
  shake?: boolean
  custom?: boolean
  from?: string
}

export interface DayMenu {
  name: string
  meals: Meal[]
}

export interface MealOverride {
  items: string[]
  kcal: number
  p: number
  custom?: boolean
  from?: string
}

export interface WorkoutLog {
  day: string
  phase: number
  session: string
  weights: Record<string, number>
}

export interface WeighIn {
  date: string
  weight: number
}

export interface CharacterData {
  profile: Profile | null
  startDate: string | null
  weighIns: WeighIn[]
  workouts: WorkoutLog[]
  lastWeights: Record<string, number>
  meals: Record<string, Record<string, boolean>>
  shopping: Record<string, Record<string, boolean>>
  mealOverrides: Record<string, MealOverride>
  exoSwaps: Record<string, string>
}

export interface Store {
  profiles: Record<string, CharacterData>
  active: string | null
}

/** [nom, séries×reps, repos, consigne] */
export type Exercise = [string, string, string, string]

export interface Session {
  key: string
  name: string
  exos: Exercise[]
}

export interface Phase {
  id: number
  from: number
  to: number
  title: string
  intro: string
  sessions: Session[]
}

export interface Rank {
  min: number
  name: string
  icon: string
}

export interface LeaderboardEntry {
  pseudo: string
  cls: ClassId
  lvl: number
  xp: number
  weeks: number
  workouts: number
  updatedAt: string
}

export const emptyChar: CharacterData = {
  profile: null,
  startDate: null,
  weighIns: [],
  workouts: [],
  lastWeights: {},
  meals: {},
  shopping: {},
  mealOverrides: {},
  exoSwaps: {},
}
