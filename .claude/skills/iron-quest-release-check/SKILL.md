---
name: iron-quest-release-check
description: Use before committing or deploying IRON QUEST changes, or when the user asks to "check", "verify", or "make sure everything's green" — runs typecheck, lint, unit tests, and a production build in sequence and reports the first failure with the exact command to reproduce it.
---

# IRON QUEST — check avant commit/déploiement

Ce projet n'a pas de CI configurée : cette checklist est le seul filet avant de commit/déployer.
Exécuter chaque étape **dans cet ordre** (chaque étape est plus rapide que la suivante — on
échoue vite) et s'arrêter à la première erreur pour la corriger avant de continuer.

1. **Typecheck** — `npx tsc -b`
   Aucune sortie = OK. `noUnusedLocals`/`noUnusedParameters` sont actifs : un import ou une
   variable oubliée casse le build.
2. **Lint** — `npm run lint` (oxlint, config dans `.oxlintrc.json`)
3. **Tests unitaires** — `npm run test` (Vitest, fichiers `src/lib/*.test.ts`)
   Ces tests couvrent la logique pure (XP, niveaux, streak, projection de poids, dates) —
   c'est là que vivent les règles de jeu, donc c'est ce qu'il ne faut jamais casser en silence.
4. **Build de prod** — `npm run build` (= `tsc -b && vite build`)
   Vérifier qu'aucun nouveau warning de taille de chunk n'apparaît sans raison (le bundle actuel
   est ~600 kB, `recharts` en est la plus grosse part — un ajout de dépendance lourde doit être
   déclaré au user, pas juste installé silencieusement).

Si tout passe, résumer en une ligne : `tsc ✓ · lint ✓ · N tests ✓ · build ✓`. Ne pas proposer de
commit/push soi-même — c'est décidé par l'utilisateur.

## Si quelque chose échoue

- Échec typecheck/lint : corriger le fichier signalé, ne pas désactiver la règle sauf demande
  explicite de l'utilisateur.
- Échec test : lire le test avant de le changer — si le comportement testé a changé
  intentionnellement, mettre à jour le test ; si c'est une régression, corriger le code.
- Échec build uniquement (typecheck/lint/test verts) : généralement un souci d'import Vite ou
  d'asset manquant dans `public/` — regarder le message d'erreur de `vite build`, il est explicite.
