# Journal de refonte — IRON QUEST

Résumé de la session de refonte : ce qui a été fait, et ce qui reste ouvert.

## Fait

### Contenu de jeu
- Système de **streak** (`src/lib/streak.ts`) : jours consécutifs actifs (séance, repas coché
  ou pesée), avec tolérance d'un jour, record qui ne recule jamais. Paliers (3/7/14/30/60/100 j)
  donnant un bonus d'XP réel, cohérent partout (jeu, classement de guilde).
- 7 nouveaux hauts faits (streaks, cuisinier, ravitailleur, immortel, maître…), et système de
  **rareté** (Commun/Rare/Épique/Légendaire) affiché en "cartes de loot" dans l'onglet Guilde.
- Système de **toasts** pour level-up et hauts faits nouvellement débloqués.
- **Recettes** : chaque repas des 7 menus a maintenant de vraies étapes de préparation
  (`src/data/menus.ts`), consultables jour par jour dans Nutrition.
- **Suivi hebdo des repas** dans Nutrition : vue semaine avec un point par repas coché.
- Bouton **🎲 Régénérer** sur chaque repas (onglet Jour) : pioche une autre recette du plan
  pour ce créneau, kcal/protéines recalculés automatiquement.
- **Calendrier mensuel** dans Programme : dashboard avec navigation mois par mois, un point
  par jour (séance faite / prévue / off).

### Navigation / structure
- Réduit de 6 à **4 onglets, tous avec libellé texte** (Jour, Programme, Nutrition, Guilde) —
  avant, Courses et Guilde n'avaient qu'un emoji, source de confusion.
- **Poids n'est plus un onglet** : accessible via un clic sur le pseudo/avatar dans le header,
  qui ouvre un écran **Profil** (rang/niveau/XP/streak + pesée/courbe/historique + changer ou
  supprimer le personnage).
- **Nutrition et Courses fusionnés** en un seul onglet avec bascule Repas/Courses.
- Guilde réordonnée : Hauts faits (toujours du contenu) → Rangs → Classement/explication.

### Robustesse & structure du code
- `ErrorBoundary` React (plus d'écran blanc en cas de crash).
- Vitest installé, **36 tests unitaires** sur toute la logique de jeu pure (xp, streak, dates,
  projection, gameCompute, classes).
- Extraction de hooks (`useCharacterStore`, `useToasts`, `useGameEvents`) et de composants
  (`GameHeader`, `ProfileScreen`, `StatCard`, `Disclosure`, `CalendarMonth`, `ToastStack`).
- `lang="fr"` sur `index.html` (était `en`), meta description/theme-color/OG tags.

### Design visuel
- Langage "loot" cohérent via 4 classes CSS réutilisables (`glow-accent/green/purple/blue`,
  `pulse-glow` dans `src/index.css`) appliqué à : avatar, barre d'XP, streak, cartes stats du
  Profil, hauts faits à rareté, Barbell, toasts, sélection de classe, coches terminées.
- Transitions/animations : changement d'onglet, plaques de la Barbell, apparition des toasts.

### Compagnon
- **Mascotte évolutive** (`src/lib/companion.ts`, `src/components/CompanionCard.tsx`) : évolue par palier de
  niveau (œuf → poussin → renardeau → loup → griffon → lion doré → dragon), humeur dérivée du streak en cours
  (content/neutre/triste, jamais stockée — même logique anti-triche que l'XP). Affichée en haut de l'écran
  Profil.

### Comptes joueurs (Supabase Auth)
- **Vrais comptes email + mot de passe** remplacent le pseudo-comme-identité : écran de connexion/inscription
  (`src/components/AuthScreen.tsx`, `src/lib/auth.ts`), **1 compte = 1 personnage**.
- Le perso (séances, repas, poids…) est sauvegardé dans Supabase (table `characters`, une ligne par compte),
  avec un cache `localStorage` par compte pour rester réactif hors-ligne — voir `src/hooks/useCharacterStore.ts`.
- `supabase/schema.sql` réécrit (v2) : `characters` + `leaderboard` indexées par `user_id`, RLS restreinte à
  `auth.uid()` (avant : écriture du classement ouverte à tous, pseudo comme clé primaire). Pseudo unique,
  vérifié à la création (`isPseudoAvailable`) et contraint en base.
- Le bouton « Changer de personnage » du Profil devient **« Se déconnecter »** (cohérent avec 1 compte = 1
  perso) ; l'onboarding (`CharacterSelect`) ne fait plus que créer le perso du compte connecté (plus de liste
  multi-perso par appareil).

### Skills Claude Code (`.claude/skills/`)
- `iron-quest-content` : conventions pour ajouter classes/menus/exercices/achievements sans
  casser les sauvegardes existantes.
- `iron-quest-release-check` : checklist tsc → lint → test → build avant commit/déploiement.

## Reste à faire / ouvert

- **Retour utilisateur sur l'intensité du style RPG** : à ajuster (plus discret ou plus
  flashy) une fois testé en usage réel — c'est un premier passage, pas figé.
- **Taille du bundle** : `vite build` avertit qu'un chunk dépasse 500 kB (recharts est la plus
  grosse dépendance). Pas traité cette session — à faire via code-splitting si ça devient un
  vrai problème de perf sur mobile.
- **Accessibilité approfondie** : les bases sont là (aria-label, focus-visible, rôles ARIA sur
  les onglets), mais pas d'audit complet (lecteur d'écran, navigation clavier bout en bout).
- **Style RPG pas encore poussé partout** : Programme (hors calendrier) et Courses gardent
  encore le style "carte plate" d'origine — à harmoniser si la direction actuelle est validée.
- **PWA/offline** : jamais évoqué comme demande explicite ; l'app reste mobile-first et le cache local permet
  de continuer à jouer brièvement hors-ligne, mais elle nécessite désormais un compte Supabase Auth pour se
  connecter — installable en PWA avec vraie stratégie offline serait une suite logique si utile.
- **Multi-perso par appareil supprimé** : avant, un même appareil pouvait héberger plusieurs persos (ex. deux
  potes sur le même téléphone). Avec 1 compte = 1 perso, chacun doit se déconnecter/reconnecter avec son
  propre compte pour jouer sur le même appareil — à revoir si cet usage revient.
- **Confirmation email Supabase** : par défaut Supabase exige de cliquer un lien de confirmation avant de
  pouvoir se connecter après inscription ; à désactiver dans Authentication → Settings pour un onboarding
  entre amis sans friction (voir README).
