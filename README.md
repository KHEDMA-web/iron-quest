# IRON QUEST

Coach + nutritionniste de poche transformé en jeu de rôle : personnage, classes, XP dérivée de vraies actions (séances, repas, pesées), programme de musculation en 3 phases, menus sans lactose personnalisés, suivi de poids avec projection, et classement de guilde entre amis.

Portage React (Vite + TypeScript + Tailwind CSS 4) de l'artefact original `iron-quest.jsx`.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 (thème dark « salle de sport »)
- Recharts (courbe de poids)
- Supabase (comptes joueurs + classement de guilde partagé)

## Démarrer

```bash
npm install
npm run dev
```

Le jeu nécessite un compte (voir section suivante) ; le personnage et sa progression sont sauvegardés dans le
compte, avec un cache local (`localStorage`) par appareil pour la réactivité hors-ligne.

## Compte & classement de guilde (Supabase)

Le jeu a besoin d'un compte (email + mot de passe) pour jouer : **1 compte = 1 personnage**. Le perso (séances,
repas, poids…) est sauvegardé dans le compte (table `characters`), ce qui permet de se reconnecter depuis un
autre appareil et de retrouver sa progression. Un cache local (`localStorage`) garde l'appli réactive même en
cas de coupure réseau ponctuelle.

Configuration nécessaire :

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans **Authentication → Providers**, vérifier que le provider **Email** est actif. Pour un usage entre amis
   sans friction, tu peux désactiver "Confirm email" (Authentication → Settings) pour que les comptes soient
   utilisables immédiatement après inscription ; sinon chacun doit cliquer le lien reçu par mail avant de
   pouvoir se connecter.
3. Exécuter `supabase/schema.sql` dans l'éditeur SQL du projet (tables `characters` + `leaderboard`, policies
   RLS restreintes à `auth.uid()`).
4. Copier `.env.example` en `.env` et renseigner `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (Project
   Settings → API).

Sans ces variables, l'écran de connexion s'affiche mais indique que le compte n'est pas configuré sur cette
installation — l'appli ne peut pas être jouée sans Supabase.

**Identité** : le pseudo choisi à la création du perso est unique dans tout le classement (vérifié à la
création, contrainte `unique` en base) et sert uniquement d'affichage — l'identité réelle est le compte
(`auth.uid()`). Les policies RLS empêchent un compte de modifier les données ou l'entrée de classement d'un
autre compte.
