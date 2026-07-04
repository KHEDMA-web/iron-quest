---
name: iron-quest-content
description: Use when adding or editing IRON QUEST game content — classes, phases/exercises, menus, shopping list, achievements, ranks, or XP values — so new content follows the existing data shape, French tone, and game-balance invariants instead of drifting from them.
---

# IRON QUEST — édition de contenu de jeu

IRON QUEST est un coach fitness gamifié (React/TS/Vite, tout le texte utilisateur est en
français). Le contenu de jeu vit entièrement dans `src/data/*.ts` et `src/lib/*.ts`, jamais
codé en dur dans les composants. Avant de modifier une de ces zones, lire le fichier concerné
en entier pour matcher le ton et la structure existants.

## Où vit quoi

| Contenu | Fichier | Notes |
|---|---|---|
| Classes (archétypes de jeu) | `src/data/classes.ts` | `CLASSES` : chaque entrée a `delta` (kcal vs TDEE) et `protPerKg`. Garder `delta` cohérent avec `arch` (masse > 0, seche < 0, forme ≈ 0). |
| Phases & séances de musculation | `src/data/phases.ts` | `PHASES[].sessions[].exos` : tuples `[nom, séries×reps, repos, consigne]`. `ALT` liste les exercices de remplacement — ajouter la réciproque si on ajoute un exo. |
| Menus | `src/data/menus.ts` | `MENUS[getDay()]` : 4 repas/jour, `id` stable (`b`/`l`/`s`/`d`) car réutilisé comme clé d'override (`mealOverrides`). Ne jamais renommer un `id` existant : ça casse les overrides déjà sauvegardés des joueurs. |
| Liste de courses | `src/data/shopping.ts` | Quantités calées sur les 7 menus, catégorie par catégorie. |
| Achievements / Quests / Streak | `src/lib/gameCompute.ts`, `src/lib/streak.ts` | Un achievement = `{ icon, name, desc, done }`, `done` doit être **dérivé** des données (`data.workouts.length`, `streak.longest`…), jamais un booléen stocké. |
| Rangs & XP | `src/lib/xp.ts` | `RANKS` (paliers de niveau) et `XP` (barème de gains). |

## Invariants à respecter

- **L'XP est toujours dérivée, jamais stockée** (commentaire explicite dans `xp.ts` : anti-farming).
  Un nouvel achievement ou un nouveau palier doit se calculer à partir de `CharacterData`
  existant, pas d'un nouveau champ mutable coché par le joueur.
- **`computeXp` est un point de vérité unique** : le classement de guilde (`lib/supabase.ts`)
  et la liste de sélection de personnage (`CharacterSelect.tsx`) l'appellent directement. Si un
  nouveau bonus d'XP doit apparaître partout de façon cohérente, il doit être ajouté *dans*
  `computeXp`, pas seulement dans `computeGame`.
- **Les `id` de repas et les clés d'exercice sont des clés de sauvegarde.** Elles sont utilisées
  comme clés dans `mealOverrides`, `exoSwaps`, `lastWeights`. Renommer un `id`/nom d'exercice
  existant orpheline les données déjà sauvegardées des joueurs — ajouter plutôt une nouvelle
  entrée, ou migrer explicitement dans `lib/storage.ts`.
- **Ton du texte** : tutoiement, second degré RPG assumé (« Ta quête », « Mission de classe »,
  emojis en préfixe de titre de section), jamais culpabilisant sur la nutrition (cf. le repas
  libre du samedi dans `menus.ts`).
- **Cohérence nutritionnelle** : `computeTargets()` (`classes.ts`) applique `delta` en kcal/jour
  et `protPerKg` en g/kg — si une classe change de profil (masse/sèche/forme), vérifier que
  `goalHint()` (suggestion de poids objectif) reste dans le même sens que `delta`.

## Après une modification de contenu

1. `npx tsc -b` — les data files sont typés strictement (`ClassDef`, `Phase`, `DayMenu`…).
2. `npm run test` — `src/lib/*.test.ts` couvre XP, streak, projection, dates et le calcul de jeu ;
   un nouveau palier ou barème doit avoir un test si la logique n'est pas triviale.
3. Vérifier à l'œil dans le navigateur (`npm run dev`) l'onglet concerné (Jour/Prog/Nutri/Guilde).
