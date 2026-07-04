-- IRON QUEST — table du classement de guilde partagé.
-- À exécuter une fois dans l'éditeur SQL du projet Supabase (Database > SQL Editor).

create table if not exists public.leaderboard (
  pseudo text primary key,
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

-- Écriture publique : pas de comptes/auth (comme l'artefact d'origine), le pseudo
-- EST l'identité. Une collision de pseudo écrase l'entrée existante — c'est un
-- choix de design assumé, à revoir si de vrais comptes sont ajoutés un jour.
create policy "leaderboard_upsert_public" on public.leaderboard
  for insert with check (true);

create policy "leaderboard_update_public" on public.leaderboard
  for update using (true) with check (true);
