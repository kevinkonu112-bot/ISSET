# ISSET — Site web officiel

Institutions Scientifiques Supérieures et d'Enseignement Technique — Lomé, Togo.

Ce dépôt contient un site web **complet et fonctionnel** : site public + CMS +
base de données + authentification + espace administrateur. Rien n'est simulé :
chaque fonctionnalité décrite ci-dessous fonctionne réellement une fois les
services externes configurés (voir Étape 1 et 2 ci-dessous).

---

## 1. Stack utilisée

| Brique | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 14** (App Router, TypeScript) | Rendu hybride (SEO + rapidité), écosystème mature, hébergement gratuit simple sur Vercel |
| Style | **Tailwind CSS** | Développement rapide, cohérence visuelle, performance |
| Animations | CSS + `IntersectionObserver` (composant `Reveal`) | Fluide, léger, respecte `prefers-reduced-motion` |
| Base de données | **Supabase (PostgreSQL)** | Base relationnelle réelle, gratuite pour démarrer, RLS (sécurité au niveau des lignes) |
| Authentification | **Supabase Auth** | Mots de passe hachés côté serveur, sessions sécurisées, aucune donnée sensible dans le frontend |
| Stockage de fichiers | **Supabase Storage** | Upload d'images/PDF/vidéos, URLs publiques ou protégées, pas de gestion serveur de fichiers |
| Hébergement | **Vercel** | Déploiement gratuit, HTTPS automatique, adapté à Next.js |

Aucune clé secrète n'est écrite dans le code : tout passe par des variables
d'environnement (`.env.local` en local, "Environment Variables" sur Vercel).

---

## 2. Architecture du projet

```
isset/
├── app/                      # Pages (App Router)
│   ├── page.tsx              # Accueil
│   ├── a-propos/             # Présentation, mission, vision, valeurs
│   ├── filieres/
│   │   ├── page.tsx          # Explorateur interactif des filières
│   │   └── [filiere]/[serie]/page.tsx   # Page détaillée d'une série
│   ├── actualites/           # Actualités & événements
│   ├── galerie/               # Galerie avec visualisation plein écran
│   ├── admission/            # Conditions et étapes d'inscription
│   ├── contact/               # Coordonnées + formulaire
│   └── admin/                 # Espace administrateur (protégé)
│       ├── login/
│       ├── dashboard/
│       ├── contenus/          # CRUD + upload de fichiers
│       ├── actualites/
│       ├── galerie/
│       ├── series/            # Édition des textes de chaque série
│       └── parametres/        # Coordonnées, réseaux sociaux, textes globaux
├── components/                 # Composants réutilisables (Header, Footer, etc.)
├── lib/
│   ├── data.ts                 # Structure fixe des filières/séries
│   ├── contents.ts             # Requêtes vers les contenus publiés
│   └── supabase/                # Clients Supabase (navigateur / serveur)
├── middleware.ts                # Protège /admin (redirection si non connecté)
├── supabase/schema.sql          # Schéma complet de la base + RLS + données de départ
├── scripts/create-admin.ts       # Génère le compte administrateur initial
└── .env.example                  # Modèle des variables d'environnement
```

### Modèle de données (résumé)

```
filieres (Économique / Industrielle)
   └── series (G1, G2, G3, F2, F3, F4)
         └── contents (cours, vidéo, pdf, image, annonce, événement, activité, texte)
               ├── media (fichiers réels stockés dans Supabase Storage)
               └── statut : brouillon | publie | archive
parametres  (coordonnées, réseaux sociaux, textes institutionnels — clé/valeur)
profiles    (rôle des comptes administrateurs)
```

---

## 3. Fonctionnalités réalisées

- Page d'accueil avec hero, présentation, filières, actualités, CTA admission
- Explorateur interactif des filières → séries (panneau dynamique, sans rechargement)
- Page détaillée par série : présentation, compétences, cours, vidéos, PDF, galerie, actualités liées
- Actualités & événements dynamiques
- Galerie avec visualisation plein écran (lightbox clavier/tactile)
- Page admission avec conditions administrables
- Formulaire de contact (envoi direct vers WhatsApp, prérempli)
- Bouton WhatsApp flottant sur tout le site (numéro : +228 99 10 73 62)
- Navigation responsive avec menu mobile et header sticky
- Espace admin protégé par une authentification réelle (Supabase Auth)
- Gestion de contenus : créer / modifier / publier / dépublier / supprimer
- Upload réel de fichiers (image, PDF, vidéo) vers Supabase Storage
- Édition des textes de chaque série et des paramètres globaux du site
- SEO : sitemap.xml, robots.txt, métadonnées, Open Graph, Twitter Card
- Accessibilité : contrastes, `aria-label`, focus visible, `prefers-reduced-motion`
- Aucune donnée inventée : toutes les informations non fournies affichent
  `[À RENSEIGNER PAR L'ADMINISTRATEUR]`

---

## 4. Services externes nécessaires (gratuits pour démarrer)

1. **Supabase** — base de données, authentification, stockage de fichiers
2. **Vercel** — hébergement du site
3. Un compte **GitHub** (recommandé, pour connecter le dépôt à Vercel)

---

## 5. Variables d'environnement nécessaires

À définir en local dans `.env.local` (copier `.env.example`) et dans Vercel
(Project Settings → Environment Variables) :

```
NEXT_PUBLIC_SUPABASE_URL=...          # Supabase > Project Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # Supabase > Project Settings > API (clé "anon public")
SUPABASE_SERVICE_ROLE_KEY=...         # Supabase > Project Settings > API (clé "service_role" — SECRÈTE, jamais publique)
NEXT_PUBLIC_WHATSAPP_NUMBER=22899107362
NEXT_PUBLIC_SITE_URL=https://votre-domaine.vercel.app
```

⚠️ `SUPABASE_SERVICE_ROLE_KEY` ne doit **jamais** être commitée sur GitHub ni
exposée côté navigateur — elle n'est utilisée que dans `scripts/create-admin.ts`
(exécuté localement) et éventuellement dans du code serveur futur.

---

## 6. Étapes de déploiement — guide complet pas à pas

### Étape 1 — Créer le projet Supabase

1. Allez sur **https://supabase.com** → *Start your project* → créez un compte
   (email ou GitHub).
2. Cliquez sur **New project**. Choisissez un nom (ex. `isset-togo`), un mot
   de passe de base de données (notez-le), et une région proche (Europe de
   l'Ouest recommandée).
3. Une fois le projet créé, allez dans **SQL Editor** (menu de gauche) →
   *New query*, collez tout le contenu du fichier `supabase/schema.sql` de ce
   projet, puis cliquez sur **Run**. Cela crée toutes les tables, la sécurité
   (RLS), le bucket de stockage et les données de départ (2 filières, 6 séries).
4. Allez dans **Project Settings → API**. Notez :
   - *Project URL* → `NEXT_PUBLIC_SUPABASE_URL`
   - *anon public* → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - *service_role* → `SUPABASE_SERVICE_ROLE_KEY` (gardez-la secrète)

### Étape 2 — Créer le compte administrateur initial

En local, sur votre ordinateur :

```bash
git clone <votre-dépôt>       # ou décompressez le ZIP fourni
cd isset
npm install
cp .env.example .env.local     # puis renseignez les 3 clés Supabase obtenues à l'étape 1
npm run create-admin
```

Le terminal affiche **une seule fois** :

```
ADMIN USERNAME (email) : admin@isset-togo.local
TEMPORARY PASSWORD     : ********************
```

**Notez ces identifiants immédiatement** (ils ne sont stockés nulle part en
clair). Vous pourrez changer le mot de passe depuis Supabase → Authentication
→ Users, ou en ajoutant une page "changer mon mot de passe" plus tard.

### Étape 3 — Déployer sur Vercel

1. Mettez le code sur GitHub (créez un dépôt, poussez le contenu du dossier
   `isset/`).
2. Allez sur **https://vercel.com** → créez un compte (idéalement avec GitHub,
   ça simplifie l'import).
3. **Add New → Project** → sélectionnez votre dépôt GitHub `isset`.
4. Dans **Environment Variables**, ajoutez les 5 variables listées à la
   section 5 (les mêmes que dans `.env.local`, plus `NEXT_PUBLIC_SITE_URL`
   avec l'URL que Vercel vous attribuera, ex. `https://isset-togo.vercel.app`).
5. Cliquez sur **Deploy**. Après 1 à 2 minutes, votre site est en ligne.
6. (Optionnel) Dans **Project Settings → Domains**, ajoutez votre propre nom
   de domaine (ex. `isset.tg`) si vous en achetez un.

### Étape 4 — Tester

1. Ouvrez `https://votre-site.vercel.app/admin/login`
2. Connectez-vous avec les identifiants générés à l'étape 2
3. Créez un contenu, importez une image/PDF/vidéo, publiez-le
4. Retournez sur le site public : le contenu apparaît sur la page de la série
   concernée (ou dans Actualités / Galerie selon son type)

---

## 7. Identifiants administrateur de test

Aucun identifiant n'est écrit en dur dans ce projet, pour des raisons de
sécurité. Ils sont générés par vous-même à l'Étape 2 ci-dessus, en exécutant :

```bash
npm run create-admin
```

## 8. URL de connexion admin

```
https://votre-site.vercel.app/admin/login
```

---

## 9. Procédures d'utilisation courantes

### Publier un cours

1. `/admin/contenus` → **Nouveau contenu**
2. Titre, description, Type = *Cours*, associer une Série
3. **Créer le contenu** → l'icône œil permet ensuite de **Publier**

### Publier une vidéo

1. `/admin/contenus` → **Nouveau contenu**
2. Type = *Vidéo*, sélectionner le fichier vidéo (upload vers Supabase Storage)
3. Créer puis publier — la vidéo apparaît sur la page de la série (lecture en
   différé, pas de préchargement automatique)

### Publier un PDF

1. `/admin/contenus` → **Nouveau contenu**
2. Type = *PDF*, sélectionner le fichier, associer une série si pertinent
3. Créer puis publier — le document est téléchargeable depuis la page publique

### Modifier une filière ou une série

1. `/admin/series`
2. Modifiez la *Présentation* et les *Objectifs* de la série concernée
3. **Enregistrer** — le texte est immédiatement visible sur la page publique
   de la série

### Modifier les coordonnées (adresse, email, horaires, réseaux sociaux)

1. `/admin/parametres`
2. Modifiez les champs concernés
3. **Enregistrer les paramètres**

### Publier une actualité / un événement

1. `/admin/actualites` → **Nouveau contenu**
2. Type = *Annonce* ou *Événement*
3. Créer puis publier

### Ajouter une photo à la galerie

1. `/admin/galerie` → **Nouveau contenu**
2. Type = *Image*, sélectionner la photo
3. Créer puis publier — elle apparaît dans `/galerie`

---

## 10. Éléments restant à fournir par le directeur

Ces informations n'ont volontairement **pas été inventées**. Elles doivent
être fournies puis saisies dans `/admin/parametres` et `/admin/series` (ou
directement dans la base si préféré) :

- Histoire complète de l'établissement, mission, vision, valeurs
- Mot du directeur (texte + photo)
- Adresse exacte, email officiel, horaires d'ouverture
- Liens réseaux sociaux (Facebook, Instagram...)
- Conditions d'admission précises et documents requis
- Contenu pédagogique réel : cours, vidéos, PDF, photos par série
- Nom de l'agence/développeur pour la mention en pied de page
- Éventuel logo officiel (actuellement un monogramme "I" générique est utilisé)
- Statistiques réelles si l'établissement souhaite en afficher (nombre
  d'élèves, taux de réussite, partenariats...) — aucune n'a été inventée

---

## 11. Rôles et permissions

La sécurité par rôle (`public.profiles.role`) est intégrée **dès la
création** dans `supabase/schema.sql` — il n'y a rien à corriger après
l'installation initiale.

| Action | Visiteur | Editeur | Admin |
|---|---|---|---|
| Lire filières / séries / catégories | ✅ | ✅ | ✅ |
| Lire contenus **publiés** | ✅ | ✅ | ✅ |
| Lire contenus (tous statuts, y compris brouillons) | ❌ | ✅ | ✅ |
| Créer / modifier un contenu ou un média | ❌ | ✅ | ✅ |
| Supprimer un contenu | ❌ | ❌ | ✅ |
| Supprimer un média | ❌ | seulement les siens | ✅ |
| Gérer filières / séries / catégories | ❌ | ❌ | ✅ |
| Gérer les paramètres du site | ❌ | ❌ | ✅ |
| Gérer les comptes / rôles (`profiles`) | ❌ | ❌ | ✅ |
| Upload de fichiers (Storage) | ❌ | ✅ | ✅ |
| Suppression de fichiers (Storage) | ❌ | seulement les siens | ✅ |

Tout nouveau compte créé dans `auth.users` reçoit automatiquement le rôle
`editeur` par défaut (trigger `handle_new_user`) — jamais `admin` de manière
implicite. Seul `scripts/create-admin.ts`, exécuté avec la clé
`service_role`, peut promouvoir un compte au rôle `admin`.

`supabase/migrations/002_role_based_rls.sql` est conservé uniquement comme
documentation historique pour d'anciens projets déjà provisionnés avec une
version antérieure du schéma — il n'est pas nécessaire pour une nouvelle
installation.

---

## 12. Sécurité — ce qui a été mis en place

- Mots de passe jamais stockés en clair (hachage géré par Supabase Auth)
- Aucun identifiant ni secret dans le code source
- Toutes les routes `/admin/*` protégées par un middleware serveur
  (redirection automatique vers `/admin/login` si non connecté)
- Row Level Security (RLS) activée sur **toutes** les tables : le public ne
  peut lire que les contenus au statut `publie` ; seuls les utilisateurs
  authentifiés peuvent créer/modifier/supprimer
- Bucket de stockage : upload/suppression réservés aux utilisateurs
  authentifiés, lecture publique uniquement pour les fichiers déjà publiés
- Taille de fichier limitée à 200 Mo par upload (configurable dans
  `supabase/schema.sql`)
- Variables sensibles exclusivement via variables d'environnement

## 13. Limites connues / prochaines améliorations possibles

- Pas encore de page "changer mon mot de passe" dans l'admin (à faire depuis
  le dashboard Supabase pour l'instant)
- Pas de compression/redimensionnement automatique des images à l'upload
  (à ajouter si le volume de photos devient important)
- Pas de système de rôles fins (tous les comptes admin ont les mêmes droits)
- Le formulaire de contact envoie vers WhatsApp ; un envoi par email
  pourrait être ajouté (nécessite un service d'envoi d'emails, ex. Resend)
