# CLAUDE.md — IRON QUEST

Contexte pour Claude Code : ce fichier résume le projet, ses conventions et tout
le travail déjà fait sur la branche `claude/remaining-tasks-yfm7zn` (3 commits),
pour reprendre le développement sans re-découvrir le code.

## Projet

Coach muscu + nutrition gamifié en RPG (personnage, classes, XP, quêtes,
rangs, guilde). App mobile-first en français, données 100 % locales par
appareil (localStorage + IndexedDB), classement partagé optionnel via Supabase.

**Stack** : React 19 + TypeScript + Vite, Tailwind CSS 4 (`@theme` dans
`src/index.css`), Recharts (courbe de poids), vite-plugin-pwa (installable,
offline), Vitest, oxlint, CI GitHub Actions (`.github/workflows/ci.yml`).

## Commandes

```bash
npm run dev        # serveur de dev
npm run build      # tsc -b + vite build (+ génération service worker PWA)
npm run lint       # oxlint
npx vitest run     # 23 tests unitaires (lib/)
```

## Architecture

- `src/App.tsx` — root : charge le Store, route CharacterSelect ↔ Game.
- `src/components/CharacterSelect.tsx` — onboarding (objectif → classe → stats)
  et sélection multi-personnages.
- `src/components/Game.tsx` — header (rang, XP, streak 🔥, barre olympique),
  nav 6 onglets. Onglets lazy-loadés (code-splitting recharts).
- `src/components/tabs/` — DayTab (séance + repas du jour), WeightTab (pesées,
  courbe + projection, charges, photos), ProgramTab (3 phases + rappels +
  sauvegarde + gestion perso), NutritionTab, ShoppingTab, GuildTab.
- `src/components/GameFeedback.tsx` — toast +XP et modal de level-up.
- `src/components/ProgressPhotos.tsx` — photos avant/après (IndexedDB).
- `src/lib/` — logique pure testée : `xp.ts` (XP dérivée des données, jamais
  stockée — anti-triche), `gameCompute.ts` (état de jeu dérivé, memoïsé dans
  Game), `projection.ts` (régression linéaire du poids), `dates.ts`,
  `storage.ts` (localStorage + export/import JSON), `photos.ts` (IndexedDB),
  `reminders.ts` (notifications locales), `supabase.ts` (leaderboard).
- `src/data/` — classes/archétypes, menus, phases du programme, courses.

## Conventions et pièges connus (IMPORTANT)

- **Dates** : les jours sont des clés locales `YYYY-MM-DD` via `dayKey()`.
  `isoWeek()` parse les composants **à la main** — ne jamais revenir à
  `new Date('YYYY-MM-DD')` relu avec des getters locaux (décale d'un jour à
  l'ouest d'UTC ; bug corrigé, verrouillé par `dates.test.ts` qui tourne en CI
  sous 3 fuseaux). Pour une pesée (`weighIns[].date` = ISO UTC), toujours
  dériver le jour local : `dayKey(new Date(w.date))`.
- **Falsy zero** : ne jamais utiliser `|| defaut` sur des valeurs numériques
  saisies par l'utilisateur (0 kcal est légitime) → `Number.isFinite(v)`.
- **Notifications** : uniquement via `src/lib/reminders.ts` qui passe par le
  service worker (`reg.showNotification`) — `new Notification()` en contexte
  page **crashe sur Android Chrome**. Ne marquer "envoyé" qu'après succès.
- **Sauvegardes** : tout personnage chargé/importé est normalisé avec
  `{ ...emptyChar, ...char }` (`normalizeProfiles` dans storage.ts) pour
  backfiller les champs manquants d'un vieux schéma. Clé : `ironquest-v5`.
- **Photos** : IndexedDB `ironquest-photos`, indexées par
  `pseudo.toLowerCase()` (= id du store). `deleteAllPhotos(id)` est appelé à la
  suppression du personnage — maintenir ce couplage si l'identité change.
- **Polices** : auto-hébergées via `@fontsource/*` (offline + pas de requête
  Google bloquante). Ne pas réintroduire d'`@import` réseau dans index.css.
- **Perf** : `computeGame` est memoïsé (`useMemo` sur `data`, remplacé
  immutablement à chaque persist). Le chartData du graphe et LiftProgress sont
  aussi memoïsés — garder ce pattern pour tout nouveau calcul dérivé.
- **XP** : toujours dérivée (`computeXp`), jamais persistée. Le feedback visuel
  (toast/level-up) diffe l'XP recalculée dans Game via un ref.

## Travail réalisé sur cette branche (vs main)

`main` = portage initial de l'artefact. Les 3 commits de la branche :

1. **`4c82c86` Polish + infra** : layout onboarding centré (plus d'écran à
   moitié vide), fix du wrap header mobile, toast +XP et modal de level-up
   animés, hauts faits avec progression (`current/target`), code-splitting des
   onglets (lazy + Suspense), 19 tests unitaires initiaux, CI GitHub Actions
   (lint + test + build), PWA complète (manifest, icônes, service worker).
2. **`3d27adb` 6 features** : projection du poids tracée en pointillés sur la
   courbe jusqu'à l'objectif, streak 🔥 de semaines pleines dans le header,
   export/import JSON de la sauvegarde (ProgramTab), progression des charges
   par exercice (WeightTab), rappels locaux opt-in (séance du jour + pesée
   hebdo, max 1/jour/type), photos de progression avant/après (IndexedDB,
   compression canvas 900px JPEG).
3. **`3d43ee8` Revue complète + 10 fixes** : revue ligne par ligne du codebase
   entier (8 angles). Corrigés : timezone isoWeek, pesée hebdo en jour local,
   crash notifications Android, affichage cible de charge corrompu
   (`String(15.03).replace('.0','')` → « 153 kg »), 0 kcal explicite écrasé,
   boucle de crash sur import de vieux schéma, photos héritées entre
   personnages au même pseudo, polices auto-hébergées, memoïsations,
   déduplication du bucketing par semaine. 23 tests verts sous UTC /
   America/New_York / Pacific/Auckland.

## Non fait / choix assumés

- Classement de guilde : nécessite `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
  dans `.env` (voir README + `supabase/schema.sql`). Sans clés, mode dégradé.
- Le chunk recharts (~360 kB) est précaché par la PWA : trade-off offline
  voulu, ne pas « optimiser » sans décision.
- Boilerplate file-input dupliqué entre ProgramTab et ProgressPhotos
  (cosmétique, extraction possible en `FilePickerButton`).
- Pas de vrais comptes : le pseudo est l'identité (design d'origine, voir la
  note de sécurité du README).
