-- IRON QUEST — schéma v2 : identité par compte (Supabase Auth) au lieu du pseudo seul.
-- À exécuter une fois dans l'éditeur SQL du projet Supabase (Database > SQL Editor).
--
-- ⚠️ Si tu avais déjà exécuté l'ancienne version de ce fichier (schéma v1, pseudo comme clé
-- primaire du classement), ce script supprime et recrée les tables : le classement existant
-- sera réinitialisé. Pense aussi à activer le provider "Email" dans Authentication > Providers.

drop table if exists public.leaderboard;
drop table if exists public.characters;

-- Perso complet (séances, repas, poids…) lié au compte — permet de retrouver son perso
-- sur un autre appareil en se reconnectant.
create table public.characters (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.characters enable row level security;

create policy "characters_select_own" on public.characters
  for select using (auth.uid() = user_id);

create policy "characters_insert_own" on public.characters
  for insert with check (auth.uid() = user_id);

create policy "characters_update_own" on public.characters
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "characters_delete_own" on public.characters
  for delete using (auth.uid() = user_id);

-- Classement de guilde partagé : 1 ligne par compte, pseudo unique et affiché publiquement.
create table public.leaderboard (
  user_id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null unique,
  cls text not null,
  lvl integer not null default 1,
  xp integer not null default 0,
  weeks integer not null default 1,
  workouts integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.leaderboard enable row level security;

-- Lecture publique : le classement est visible par tout le monde.
create policy "leaderboard_select_public" on public.leaderboard
  for select using (true);

-- Écriture réservée au propriétaire du compte : impossible de modifier la ligne d'un autre joueur.
create policy "leaderboard_insert_own" on public.leaderboard
  for insert with check (auth.uid() = user_id);

create policy "leaderboard_update_own" on public.leaderboard
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
