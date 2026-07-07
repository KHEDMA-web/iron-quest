# CLAUDE.md — IRON QUEST

Contexte pour Claude Code : ce fichier résume le projet, ses conventions et les
pièges connus, pour reprendre le développement sans re-découvrir le code.

## Projet

Coach muscu + nutrition gamifié en RPG (personnage, classes, XP, quêtes,
rangs, guilde). App mobile-first en français. **1 compte Supabase Auth = 1
personnage** (email + mot de passe) ; le perso est sauvegardé côté Supabase
(table `characters`), avec un cache `localStorage` par compte pour rester
réactif hors-ligne. Classement de guilde partagé entre comptes. Photos de
progression en local (IndexedDB, jamais synchronisées).

**Stack** : React 19 + TypeScript + Vite, Tailwind CSS 4 (`@theme` dans
`src/index.css`), Recharts (courbe de poids, lazy-loadé), Supabase (auth +
leaderboard), vite-plugin-pwa (installable, offline), Vitest, oxlint, CI
GitHub Actions (`.github/workflows/ci.yml`).

## Commandes

```bash
npm run dev         # serveur de dev
npm run build       # tsc -b + vite build (+ génération service worker PWA)
npm run lint        # oxlint
npm run test        # vitest run — 53 tests unitaires (src/lib/*.test.ts)
npm run test:watch  # vitest en mode watch
```

Avant tout commit/déploiement, utiliser le skill `iron-quest-release-check`
(tsc → lint → test → build, dans cet ordre, on s'arrête à la première erreur).

## Architecture

- `src/App.tsx` — root : `useAuth` (session Supabase) + `useCharacterStore`
  (perso du compte connecté), route AuthScreen ↔ CharacterSelect ↔ Game.
- `src/components/AuthScreen.tsx` — connexion/inscription email+mot de passe.
- `src/components/CharacterSelect.tsx` — onboarding (objectif → classe →
  stats) : crée le perso du compte déjà authentifié (plus de multi-perso par
  appareil, voir `lib/auth.ts` pour la vérification de pseudo unique).
- `src/components/Game.tsx` — état du jeu (`computeGame`, memoïsé), toasts XP
  + hauts faits (`useGameEvents`/`useToasts`/`ToastStack`), burst de level-up
  (`LevelUpBurst`), vérifie les rappels au montage (`checkReminders`). Nav 4
  onglets (Jour/Programme/Nutrition/Guilde) + écran Profil (accessible via le
  header, pas un onglet).
- `src/components/GameHeader.tsx` — avatar/rang/XP/streak jour, cliquable
  pour ouvrir `ProfileScreen`.
- `src/components/ProfileScreen.tsx` — fiche de perso (rang/niveau/streak/
  hauts faits), `CompanionCard` (mascotte évolutive), `WeightTab` (pesée +
  courbe + charges + photos), déconnexion/suppression du perso. **Lazy-loadé**
  depuis `Game.tsx` car il tire `WeightTab` → recharts (~360 kB) : ne pas le
  rendre statique sans réintroduire ce poids dans le bundle initial.
- `src/components/tabs/` — DayTab (séance + repas du jour), ProgramTab
  (3 phases + calendrier mensuel + rappels opt-in + export/import JSON),
  NutritionTab (+ ShoppingTab fusionné dedans via bascule), WeightTab
  (pesées, courbe + projection pointillée, charges par exercice, photos),
  GuildTab (hauts faits à rareté → rangs → classement).
- `src/lib/` — logique pure testée : `xp.ts` (XP dérivée, jamais stockée —
  anti-triche), `gameCompute.ts` (état de jeu dérivé, deux streaks distincts,
  cf. Conventions), `streak.ts` (streak jours), `projection.ts` (régression
  linéaire du poids), `dates.ts`, `companion.ts` (évolution/humeur de la
  mascotte), `storage.ts` (cache local par compte + export/import JSON),
  `photos.ts` (IndexedDB), `reminders.ts` (notifications locales via service
  worker), `auth.ts` (Supabase Auth + unicité du pseudo), `supabase.ts`
  (persistance du perso + leaderboard).
- `src/data/` — classes/archétypes, menus, phases du programme, courses.

## Conventions et pièges connus (IMPORTANT)

- **Deux streaks distincts, ne pas les confondre** : `game.streak` (objet
  `Streak` de `lib/streak.ts` — jours consécutifs avec une action, tolérance
  1 jour, alimente hauts faits/XP/quêtes/toasts) et `game.weekStreak` (number,
  semaines pleines consécutives à l'objectif de séances, dérivé du `byWeek`
  de `computeXp`). Ils ont existé sous le même nom `streak` après un merge
  git silencieux (deux déclarations `const`/`let` incompatibles) — si un futur
  merge/rebase touche `gameCompute.ts`, vérifier qu'aucune des deux ne
  réapparaît fusionnée avec l'autre.
- **Dates** : les jours sont des clés locales `YYYY-MM-DD` via `dayKey()`.
  `isoWeek()` parse les composants **à la main** — ne jamais revenir à
  `new Date('YYYY-MM-DD')` relu avec des getters locaux (décale d'un jour à
  l'ouest d'UTC ; bug corrigé, verrouillé par `dates.test.ts` sous 3 fuseaux).
  Pour une pesée (`weighIns[].date` = ISO UTC), toujours dériver le jour
  local : `dayKey(new Date(w.date))`.
- **Falsy zero** : ne jamais utiliser `|| defaut` sur des valeurs numériques
  saisies par l'utilisateur (0 kcal est légitime) → `Number.isFinite(v)`.
- **Notifications** : uniquement via `src/lib/reminders.ts` qui passe par le
  service worker (`reg.showNotification`) — `new Notification()` en contexte
  page **crashe sur Android Chrome**. Ne marquer "envoyé" qu'après succès.
- **Sauvegardes** : `loadCachedCharacter`/`parseImportedCharacter` normalisent
  toujours avec `{ ...emptyChar, ...char }` pour backfiller un vieux schéma ou
  un JSON édité à la main. Clé de cache : `ironquest-char-v1-${userId}`.
- **Photos** : IndexedDB `ironquest-photos`, indexées par
  `pseudo.toLowerCase()`. `deleteAllPhotos(pseudo)` est appelé à la
  suppression du personnage (`useCharacterStore.deleteCharacter`) — si
  l'identité change un jour (ex: pseudo éditable), maintenir ce couplage.
- **Polices** : auto-hébergées via `@fontsource/*` (offline + pas de requête
  Google bloquante). Ne pas réintroduire d'`@import` réseau dans index.css.
- **Perf** : `computeGame` est memoïsé (`useMemo` sur `data` dans `Game.tsx`,
  remplacé immutablement à chaque persist). `chartData` (WeightTab) et
  `LiftProgress` sont aussi memoïsés — garder ce pattern pour tout nouveau
  calcul dérivé. `ProfileScreen` est lazy-loadé (voir Architecture) : ne pas
  le rendre statique dans `Game.tsx`.
- **XP** : toujours dérivée (`computeXp`), jamais persistée. Les toasts
  level-up/hauts faits sont détectés par diff dans `useGameEvents` (comparaison
  avec la valeur précédente via `useRef`), pas stockés.
- **Toasts/level-up** : un seul système (`useToasts` + `ToastStack` +
  `LevelUpBurst` + `useGameEvents`). Ne pas en recréer un second en parallèle.

## Non fait / choix assumés

- Classement de guilde : nécessite `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
  dans `.env` (voir README + `supabase/schema.sql`). Sans clés, mode dégradé.
- Le chunk recharts (~360 kB, dans `ProfileScreen`) est précaché par la PWA :
  trade-off offline voulu, ne pas « optimiser » sans décision.
- Boilerplate file-input dupliqué entre ProgramTab (import sauvegarde) et
  ProgressPhotos (cosmétique, extraction possible en `FilePickerButton`).
- Multi-perso par appareil supprimé (1 compte = 1 perso) : deux personnes sur
  le même téléphone doivent se déconnecter/reconnecter chacune avec son
  compte.
- Confirmation email Supabase à désactiver manuellement (Authentication →
  Settings) pour un onboarding entre amis sans friction — voir README.

## Backlog (P1→P3, non urgent)

### P1 — fiabilité
1. **Tests composants** (React Testing Library + jsdom) : onboarding complet,
   terminer une séance (+50 XP), cocher un repas, éditer un repas à 0 kcal,
   import d'une sauvegarde invalide → message d'erreur. La logique pure est
   testée, les composants ne le sont pas.
2. **Migration de schéma versionnée** : la clé de cache est
   `ironquest-char-v1-${userId}` figée ; ajouter un champ `version` + fonction
   de migration plutôt que de compter uniquement sur la normalisation
   emptyChar.

### P2 — produit
3. **Icônes SVG cohérentes** à la place des emoji (💪🔥⚔️🛒 rendent
   différemment selon l'OS). Un set custom = identité visuelle propre.
4. **Détail des charges par exercice** : tap sur une ligne de « Tes charges »
   (WeightTab) → mini-graphe de progression de cet exo dans le temps.
5. **Rappels plus riches** : après 7 jours d'inactivité, notification « ton
   streak est en danger » ; heure de rappel configurable.
6. **Comparateur de photos amélioré** : slider avant/après superposé,
   choix manuel des deux photos comparées (aujourd'hui : première vs dernière).
7. **Partage de résultats** : générer une image (canvas) « niveau X, +N kg,
   streak Y semaines » à partager, sans exposer les données privées.

### P3 — plus tard
8. Extraire `FilePickerButton` (dédup ProgramTab/ProgressPhotos).
9. Sons/haptique optionnels sur level-up (navigator.vibrate).
10. Mode « nouvelle quête » guidé quand l'objectif de poids est atteint
    (aujourd'hui : simple message, l'utilisateur doit recréer un perso pour
    changer d'objectif — permettre d'éditer l'objectif en place).
11. i18n si audience non francophone (tout le texte est en dur en français).
12. PWA/offline : l'app nécessite un compte Supabase Auth pour se connecter ;
    une vraie stratégie offline (au-delà du cache local de lecture/écriture
    différée) reste à évaluer si le besoin se confirme.
