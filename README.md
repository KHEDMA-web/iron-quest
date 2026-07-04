# IRON QUEST

Coach + nutritionniste de poche transformé en jeu de rôle : personnage, classes, XP dérivée de vraies actions (séances, repas, pesées), programme de musculation en 3 phases, menus sans lactose personnalisés, suivi de poids avec projection, et classement de guilde entre amis.

Portage React (Vite + TypeScript + Tailwind CSS 4) de l'artefact original `iron-quest.jsx`.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 (thème dark « salle de sport »)
- Recharts (courbe de poids)
- Supabase (classement de guilde partagé)

## Démarrer

```bash
npm install
npm run dev
```

Le personnage et sa progression sont stockés en local (`localStorage`), par appareil.

## Classement de guilde (Supabase)

Le classement partagé entre joueurs a besoin d'un projet Supabase :

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Exécuter `supabase/schema.sql` dans l'éditeur SQL du projet (table `leaderboard` + policies RLS).
3. Copier `.env.example` en `.env` et renseigner `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (Project Settings → API).

Sans ces variables, l'appli fonctionne normalement en local mais l'onglet Guilde affiche un message indiquant que le classement partagé n'est pas configuré.

**Note de sécurité héritée du design d'origine** : il n'y a pas de vrais comptes — le pseudo est l'identité. Deux joueurs avec le même pseudo écrasent la même entrée de classement (voir `supabase/schema.sql`).
