-- ============================================================
-- ISSET — Migration 002 : RLS basée sur le rôle réel (profiles)
--
-- ⚠️ HISTORIQUE / DOCUMENTATION UNIQUEMENT.
-- Pour une INSTALLATION NEUVE (base Supabase vierge), n'exécutez
-- PAS ce fichier : exécutez directement supabase/schema.sql, qui
-- contient déjà cette sécurité basée sur les rôles dès la création.
--
-- Ce fichier 002 n'est utile que si vous avez un projet Supabase
-- existant qui a été provisionné avec une TRÈS ANCIENNE version de
-- schema.sql utilisant auth.role() = 'authenticated'. Dans ce cas
-- précis (base déjà en production avec des données), exécutez ce
-- fichier pour corriger les policies sans perdre de données.
--
-- IDEMPOTENTE : peut être exécutée plusieurs fois sans risque.
-- Ne modifie AUCUNE donnée existante (filieres, series, contents...).
-- ============================================================

-- ------------------------------------------------------------
-- 1. FONCTIONS UTILITAIRES (SECURITY DEFINER)
-- SECURITY DEFINER est indispensable ici : sans cela, une policy
-- sur "profiles" qui interroge "profiles" provoquerait une
-- récursion infinie (la fonction doit pouvoir lire la table
-- profiles en contournant elle-même le RLS).
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 2. FILIERES / SERIES / CATEGORIES
-- Données structurelles : réservées à l'admin. Lecture publique
-- déjà assurée par les policies "Lecture publique ..." existantes
-- (non touchées ici).
-- ------------------------------------------------------------
drop policy if exists "Admin gere filieres" on public.filieres;
create policy "Admin gere filieres" on public.filieres
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin gere series" on public.series;
create policy "Admin gere series" on public.series
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin gere categories" on public.categories;
create policy "Admin gere categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 3. CONTENTS — admin ET editeur peuvent créer/modifier ;
-- seul l'admin peut supprimer. La policy globale "for all"
-- précédente est remplacée par 4 policies distinctes.
-- ------------------------------------------------------------
drop policy if exists "Admin gere contenus" on public.contents;

create policy "Contenus visibles admin editeur" on public.contents
  for select using (public.is_editeur_or_admin());

create policy "Contenus crees par editeur admin" on public.contents
  for insert with check (public.is_editeur_or_admin());

create policy "Contenus modifies par editeur admin" on public.contents
  for update using (public.is_editeur_or_admin()) with check (public.is_editeur_or_admin());

create policy "Contenus supprimes par admin" on public.contents
  for delete using (public.is_admin());

-- ------------------------------------------------------------
-- 4. MEDIA — mêmes principes ; la suppression est autorisée à
-- l'admin, ou à l'éditeur SEULEMENT sur les fichiers liés à un
-- contenu dont il est l'auteur (évite qu'un éditeur supprime les
-- fichiers d'un collègue).
-- ------------------------------------------------------------
drop policy if exists "Admin gere media" on public.media;

create policy "Media visibles admin editeur" on public.media
  for select using (public.is_editeur_or_admin());

create policy "Media crees par editeur admin" on public.media
  for insert with check (public.is_editeur_or_admin());

create policy "Media modifies par editeur admin" on public.media
  for update using (public.is_editeur_or_admin()) with check (public.is_editeur_or_admin());

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

-- ------------------------------------------------------------
-- 5. PARAMETRES — réglages globaux du site : admin uniquement.
-- ------------------------------------------------------------
drop policy if exists "Admin gere parametres" on public.parametres;
create policy "Admin gere parametres" on public.parametres
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 6. PROFILES — chacun voit son propre profil ; l'admin voit et
-- gère tous les profils (attribution des rôles). Personne d'autre
-- ne peut créer/modifier un profil via l'API publique (la création
-- initiale se fait via le service_role dans create-admin.ts, qui
-- contourne le RLS de toute façon).
-- ------------------------------------------------------------
drop policy if exists "Admin voit son profil" on public.profiles;
create policy "Utilisateur voit son propre profil" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Admin gere profils" on public.profiles;
create policy "Admin gere profils" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 7. PROVISIONING AUTOMATIQUE — tout nouveau compte auth.users
-- reçoit par défaut le rôle le MOINS privilégié ('editeur'), afin
-- qu'un compte créé par erreur ou par un autre canal que
-- create-admin.ts n'obtienne jamais 'admin' implicitement.
-- create-admin.ts fait ensuite un upsert explicite vers 'admin'.
-- ------------------------------------------------------------
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 8. STORAGE — upload réservé à editeur/admin ; suppression
-- réservée à l'admin, ou à l'éditeur sur SES PROPRES fichiers
-- (Supabase renseigne automatiquement storage.objects.owner avec
-- l'auth.uid() de l'utilisateur qui a fait l'upload).
-- ------------------------------------------------------------
drop policy if exists "Upload reserve aux authentifies" on storage.objects;
create policy "Upload reserve editeur admin" on storage.objects
  for insert with check (
    bucket_id = 'isset-media' and public.is_editeur_or_admin()
  );

drop policy if exists "Suppression reservee aux authentifies" on storage.objects;
create policy "Suppression admin ou proprietaire" on storage.objects
  for delete using (
    bucket_id = 'isset-media'
    and (public.is_admin() or owner = auth.uid())
  );

-- La lecture publique du bucket ("Lecture publique du bucket
-- isset-media") n'est pas modifiée : elle reste ouverte à tous.
