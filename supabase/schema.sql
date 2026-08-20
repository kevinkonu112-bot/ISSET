-- ============================================================
-- ISSET — SCHÉMA FINAL (installation depuis une base vierge)
-- Sécurité basée sur les rôles (public.profiles.role) intégrée
-- dès la création — aucune migration corrective nécessaire.
--
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- Ce script est conçu pour être exécuté une seule fois sur une
-- base vierge, mais reste sûr à ré-exécuter (create if not exists,
-- create or replace, drop policy/trigger if exists, on conflict).
-- ============================================================


-- ================================================================
-- 0. EXTENSIONS
-- ================================================================
create extension if not exists "pgcrypto";


-- ================================================================
-- 1. TABLES (ordre respectant les dépendances de clés étrangères)
-- ================================================================

-- 1.1 PROFILES — rôle applicatif au-dessus de auth.users.
-- Le défaut 'editeur' est volontairement le rôle le MOINS
-- privilégié : personne ne devient admin sans action explicite.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editeur' check (role in ('admin', 'editeur')),
  created_at timestamptz not null default now()
);

-- 1.2 FILIERES
create table if not exists public.filieres (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nom text not null,
  description text,
  ordre int not null default 0,
  created_at timestamptz not null default now()
);

-- 1.3 SERIES (dépend de filieres)
create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  filiere_id uuid not null references public.filieres(id) on delete cascade,
  code text not null,                -- ex: "G1", "F2"
  slug text unique not null,         -- ex: "secretariat-bureautique"
  nom text not null,
  description text,
  objectifs text,
  competences text[],
  matieres text[],
  photo_url text,
  ordre int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 1.4 CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nom text not null
);

-- 1.5 CONTENTS (dépend de filieres, series, categories, profiles)
create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  slug text unique not null,
  description text,
  corps text,
  type text not null check (type in ('video','pdf','image','texte','annonce','cours','activite','evenement')),
  statut text not null default 'brouillon' check (statut in ('brouillon','publie','archive')),
  filiere_id uuid references public.filieres(id) on delete set null,
  serie_id uuid references public.series(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  auteur_id uuid references public.profiles(id) on delete set null,
  date_publication timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_contents_statut on public.contents(statut);
create index if not exists idx_contents_filiere on public.contents(filiere_id);
create index if not exists idx_contents_serie on public.contents(serie_id);

-- 1.6 MEDIA (dépend de contents)
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.contents(id) on delete cascade,
  bucket text not null default 'isset-media',
  path text not null,
  type text not null check (type in ('image','pdf','video','autre')),
  taille_octets bigint,
  nom_original text,
  created_at timestamptz not null default now()
);

-- 1.7 PARAMETRES
create table if not exists public.parametres (
  cle text primary key,
  valeur text
);


-- ================================================================
-- 2. DONNÉES DE DÉPART
-- ================================================================

insert into public.parametres (cle, valeur) values
  ('adresse', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('email', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('telephone_secondaire', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('whatsapp', '22899107362'),
  ('horaires', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('facebook', ''),
  ('instagram', ''),
  ('histoire', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('mission', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('vision', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('valeurs', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('mot_directeur', '[À RENSEIGNER PAR L''ADMINISTRATEUR]'),
  ('conditions_admission', '[Informations à compléter par l''administration]'),
  ('agence_credit', '[À RENSEIGNER]')
on conflict (cle) do nothing;

insert into public.filieres (slug, nom, description, ordre) values
  ('economique', 'Filière Économique', 'Secrétariat, comptabilité, commerce & marketing', 1),
  ('industrielle', 'Filière Industrielle', 'Électronique, électrotechnique, génie civil', 2)
on conflict (slug) do nothing;

insert into public.series (filiere_id, code, slug, nom, ordre)
select f.id, v.code, v.slug, v.nom, v.ordre
from (values
  ('economique',  'G1', 'secretariat-bureautique', 'Secrétariat bureautique', 1),
  ('economique',  'G2', 'comptabilite',            'Comptabilité',            2),
  ('economique',  'G3', 'commerce-marketing',      'Commerce & Marketing',    3),
  ('industrielle','F2', 'electronique',            'Électronique',            1),
  ('industrielle','F3', 'electrotechnique',        'Électrotechnique',        2),
  ('industrielle','F4', 'genie-civil',             'Génie civil',             3)
) as v(fslug, code, slug, nom, ordre)
join public.filieres f on f.slug = v.fslug
on conflict (slug) do nothing;

insert into public.categories (slug, nom) values
  ('cours', 'Cours'),
  ('video', 'Vidéo pédagogique'),
  ('document', 'Document'),
  ('projet', 'Projet étudiant'),
  ('actualite', 'Actualité'),
  ('evenement', 'Événement'),
  ('annonce', 'Annonce')
on conflict (slug) do nothing;


-- ================================================================
-- 3. FONCTIONS
-- ================================================================

-- 3.1 set_updated_at — met à jour la colonne updated_at automatiquement
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 3.2 is_admin() — SECURITY DEFINER : contourne le RLS de "profiles"
-- pour éviter toute récursion quand cette fonction est appelée
-- depuis une policy portant sur la table "profiles" elle-même.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 3.3 is_editeur_or_admin() — même principe, rôle éditeur ou admin.
create or replace function public.is_editeur_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editeur')
  );
$$;

-- 3.4 handle_new_user() — provisionne automatiquement le profil de
-- tout nouveau compte auth.users avec le rôle 'editeur' EN DUR.
-- Aucune valeur n'est lue depuis les métadonnées fournies par
-- l'utilisateur : impossible de s'auto-attribuer un rôle.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.email, 'editeur')
  on conflict (id) do nothing;
  return new;
end;
$$;


-- ================================================================
-- 4. TRIGGERS
-- ================================================================

drop trigger if exists trg_series_updated_at on public.series;
create trigger trg_series_updated_at before update on public.series
  for each row execute function public.set_updated_at();

drop trigger if exists trg_contents_updated_at on public.contents;
create trigger trg_contents_updated_at before update on public.contents
  for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ================================================================
-- 5. ROW LEVEL SECURITY
-- ================================================================

alter table public.profiles enable row level security;
alter table public.filieres enable row level security;
alter table public.series enable row level security;
alter table public.categories enable row level security;
alter table public.contents enable row level security;
alter table public.media enable row level security;
alter table public.parametres enable row level security;

-- ----------------------------------------------------------------
-- 5.1 FILIERES / SERIES / CATEGORIES
-- Lecture publique totale. Écriture réservée à l'admin (données
-- structurelles rarement modifiées, jamais par un éditeur).
-- ----------------------------------------------------------------
drop policy if exists "Lecture publique filieres" on public.filieres;
create policy "Lecture publique filieres" on public.filieres
  for select using (true);

drop policy if exists "Admin gere filieres" on public.filieres;
create policy "Admin gere filieres" on public.filieres
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Lecture publique series" on public.series;
create policy "Lecture publique series" on public.series
  for select using (true);

drop policy if exists "Admin gere series" on public.series;
create policy "Admin gere series" on public.series
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Lecture publique categories" on public.categories;
create policy "Lecture publique categories" on public.categories
  for select using (true);

drop policy if exists "Admin gere categories" on public.categories;
create policy "Admin gere categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------
-- 5.2 CONTENTS
-- Visiteur : lit uniquement les contenus statut = 'publie'.
-- Éditeur/Admin : lisent tout (y compris brouillons), créent,
-- modifient. Seul l'admin supprime.
-- ----------------------------------------------------------------
drop policy if exists "Lecture publique contenus publies" on public.contents;
create policy "Lecture publique contenus publies" on public.contents
  for select using (statut = 'publie');

drop policy if exists "Contenus visibles admin editeur" on public.contents;
create policy "Contenus visibles admin editeur" on public.contents
  for select using (public.is_editeur_or_admin());

drop policy if exists "Contenus crees par editeur admin" on public.contents;
create policy "Contenus crees par editeur admin" on public.contents
  for insert with check (public.is_editeur_or_admin());

drop policy if exists "Contenus modifies par editeur admin" on public.contents;
create policy "Contenus modifies par editeur admin" on public.contents
  for update using (public.is_editeur_or_admin()) with check (public.is_editeur_or_admin());

drop policy if exists "Contenus supprimes par admin" on public.contents;
create policy "Contenus supprimes par admin" on public.contents
  for delete using (public.is_admin());

-- ----------------------------------------------------------------
-- 5.3 MEDIA
-- Visiteur : lit uniquement les médias liés à un contenu publié.
-- Éditeur/Admin : lisent tout, créent, modifient. Suppression :
-- admin, ou éditeur SEULEMENT sur les médias de ses propres contenus.
-- ----------------------------------------------------------------
drop policy if exists "Lecture publique media" on public.media;
create policy "Lecture publique media" on public.media
  for select using (
    exists (select 1 from public.contents c where c.id = content_id and c.statut = 'publie')
  );

drop policy if exists "Media visibles admin editeur" on public.media;
create policy "Media visibles admin editeur" on public.media
  for select using (public.is_editeur_or_admin());

drop policy if exists "Media crees par editeur admin" on public.media;
create policy "Media crees par editeur admin" on public.media
  for insert with check (public.is_editeur_or_admin());

drop policy if exists "Media modifies par editeur admin" on public.media;
create policy "Media modifies par editeur admin" on public.media
  for update using (public.is_editeur_or_admin()) with check (public.is_editeur_or_admin());

drop policy if exists "Media supprimes par admin ou auteur" on public.media;
create policy "Media supprimes par admin ou auteur" on public.media
  for delete using (
    public.is_admin()
    or (
      public.is_editeur_or_admin()
      and exists (
        select 1 from public.contents c
        where c.id = media.content_id and c.auteur_id = auth.uid()
      )
    )
  );

-- ----------------------------------------------------------------
-- 5.4 PARAMETRES
-- Lecture publique (nécessaire pour afficher coordonnées, mission,
-- etc. sur le site public). Écriture réservée à l'admin.
-- ----------------------------------------------------------------
drop policy if exists "Lecture publique parametres" on public.parametres;
create policy "Lecture publique parametres" on public.parametres
  for select using (true);

drop policy if exists "Admin gere parametres" on public.parametres;
create policy "Admin gere parametres" on public.parametres
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------
-- 5.5 PROFILES
-- Chacun lit son propre profil. L'admin lit/gère tous les profils
-- (attribution des rôles). Aucun visiteur ni éditeur ne peut
-- modifier un rôle, le sien ou celui d'un autre.
-- ----------------------------------------------------------------
drop policy if exists "Utilisateur voit son propre profil" on public.profiles;
create policy "Utilisateur voit son propre profil" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Admin gere profils" on public.profiles;
create policy "Admin gere profils" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());


-- ================================================================
-- 6. STORAGE — bucket "isset-media" + policies
-- ================================================================

insert into storage.buckets (id, name, public, file_size_limit)
values ('isset-media', 'isset-media', true, 209715200) -- 200 Mo max/fichier
on conflict (id) do nothing;

-- Lecture publique du bucket (nécessaire pour afficher images/PDF/
-- vidéos publiés directement dans le navigateur, sans authentification).
drop policy if exists "Lecture publique du bucket isset-media" on storage.objects;
create policy "Lecture publique du bucket isset-media" on storage.objects
  for select using (bucket_id = 'isset-media');

-- Upload réservé aux éditeurs et admins.
drop policy if exists "Upload reserve editeur admin" on storage.objects;
create policy "Upload reserve editeur admin" on storage.objects
  for insert with check (
    bucket_id = 'isset-media' and public.is_editeur_or_admin()
  );

-- Suppression réservée à l'admin, ou à l'éditeur sur SES PROPRES
-- fichiers (Supabase renseigne automatiquement owner = auth.uid()
-- de l'utilisateur qui a fait l'upload).
drop policy if exists "Suppression admin ou proprietaire" on storage.objects;
create policy "Suppression admin ou proprietaire" on storage.objects
  for delete using (
    bucket_id = 'isset-media'
    and (public.is_admin() or owner = auth.uid())
  );
