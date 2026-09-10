# GéoEmploi

**Offres d'emploi géolocalisées — démonstrateur technique**

Réalisé pour la Direction Numérique et Innovation, Ministère du Job et Bonheur.
Référence du cahier des charges : **JEB/DNI/2026-001**, version 1.0.

> **Démonstrateur technique.** Cette application ne constitue pas un service public en
> exploitation. Les données qu'elle contient sont des données de démonstration.

---

## Accès

| Ressource | Lien |
|---|---|
| Application | https://survivor-pool-temp.vercel.app/ |
| Documentation de l'API | https://survivor-pool-temp.vercel.app/api/docs |
| Spécification OpenAPI 3.0 | https://survivor-pool-temp.vercel.app/api/openapi.json |
| Page Transparence | https://survivor-pool-temp.vercel.app/transparence |

---

## Le service

GéoEmploi permet la consultation d'offres d'emploi géolocalisées sur une carte, la
création de comptes demandeur d'emploi et employeur, et la publication d'offres par les
employeurs.

**Pour les visiteurs**
- Consultation de la carte et des offres **sans compte ni inscription**
- Recherche des offres à proximité, sur activation explicite de la géolocalisation
- Fiche détaillée par offre : intitulé, employeur, type de contrat, commune, rayon

**Pour les employeurs**
- Publication d'offres géolocalisées, **gratuite et sans abonnement**
- Géocodage automatique de la commune à la publication
- Tableau de bord : nombre de vues par offre, statut de modération

**Pour l'administration**
- Modération des offres : publication, mise en attente, signalement
- Gestion des comptes : suspension et réactivation
- Journal d'audit horodaté et attribué de chaque action administrative

---

## Conformité

La protection des données a été traitée comme une contrainte de conception, pas comme
une couche ajoutée en fin de projet.

| Engagement | Mise en œuvre |
|---|---|
| Consultation libre | Aucune authentification requise pour la carte et les offres |
| Position du visiteur | **Jamais** enregistrée : ni en base, ni en cookie, ni transmise au serveur |
| Position et compte | **Jamais** liées : la géolocalisation fonctionne à l'identique connecté ou non |
| Précision de localisation | Centroïde de la commune, jamais l'adresse exacte |
| Consentement | Notice affichée avant **chaque** demande de position, aucune case pré-cochée |
| Refus de la géolocalisation | Le service reste pleinement utilisable, aucune page d'erreur |
| Portabilité (art. 20) | Export des données personnelles depuis l'interface, format JSON |
| Mots de passe | Hachés (bcrypt, salés), jamais retournés par aucun endpoint |

### Livrables juridiques et d'accessibilité

| Document | Objet |
|---|---|
| [`docs/AIPD.md`](docs/AIPD.md) | Analyse d'impact relative à la protection des données (art. 35) |
| [`docs/RGPD_FICHE_TRAITEMENT.md`](docs/RGPD_FICHE_TRAITEMENT.md) | Fiche de registre de traitement (art. 30) |
| [`docs/CONSENTEMENT_TABLEAU.md`](docs/CONSENTEMENT_TABLEAU.md) | Comportement de l'application avec et sans position, captures à l'appui |
| [`docs/RGAA_AUDIT.md`](docs/RGAA_AUDIT.md) | Audit d'accessibilité RGAA, auto-conduit, 10 critères |
| [`docs/CGU_PROJET.md`](docs/CGU_PROJET.md) | Projet de conditions générales, chaque clause marquée « existant » ou « intention » |
| [`docs/JOURNAL_MODIFICATIONS.md`](docs/JOURNAL_MODIFICATIONS.md) | Journal des retraits opérés et de leur effet en base |

Chacun de ces documents existe également en version PDF dans `docs/`.

**Règle appliquée à toute la documentation** : aucune fonctionnalité n'est décrite comme
existante si elle n'est pas effectivement présente dans le code livré. Les
fonctionnalités prévues mais non construites sont explicitement signalées comme telles.

---

## Architecture technique

| Couche | Choix | Raison |
|---|---|---|
| Application | Next.js 15 (App Router) | Front et API dans un même déploiement |
| API | Hono + `@hono/zod-openapi` | Spécification OpenAPI générée depuis le code |
| Validation | Zod | Même schéma pour valider les requêtes et documenter l'API |
| Base de données | PostgreSQL (Neon) via Prisma 7 | Base relationnelle, migrations versionnées |
| Cartographie | Leaflet + **IGN Géoplateforme** | Fond de carte de l'État, sans clé d'API |
| Géocodage | **API Adresse** (`api-adresse.data.gouv.fr`) | Service de l'État, sans clé d'API |
| Hébergement | Vercel | Un dépôt, un déploiement |

**Aucun service tiers payant ou à compte propriétaire n'est nécessaire au
fonctionnement de l'application**, conformément à la doctrine « cloud de confiance ».
Les deux services externes utilisés sont des services publics français, gratuits et sans
authentification.

Le schéma d'architecture complet est disponible dans [`archv2.png`](archv2.png), et le
modèle de données dans [`docs/schema.svg`](docs/schema.svg).

---

## Installation

### Prérequis

- Node.js 20 ou supérieur
- Docker (pour la base de données locale) **ou** une URL PostgreSQL existante

### Mise en route

```bash
npm install                  # installation des dépendances
npm run db:local             # démarre PostgreSQL 16 dans Docker, port 55432
cp .env.example .env         # renseigner DATABASE_URL et DIRECT_URL
npm run db:migrate           # applique le schéma à la base
npm run db:seed              # jeu de données de démonstration
npm run dev                  # démarre l'application
```

L'application est alors accessible sur http://localhost:3000, la documentation de l'API
sur http://localhost:3000/api/docs.

`npm run db:local:stop` arrête le conteneur ; les données sont conservées.

### Commandes disponibles

| Commande | Effet |
|---|---|
| `npm run dev` | Démarre l'application en développement |
| `npm run build` | Compilation de production |
| `npm run typecheck` | Vérification des types, sans compilation |
| `npm run lint` | Analyse statique |
| `npm run db:migrate` | Crée et applique une migration (développement) |
| `npm run db:deploy` | Applique les migrations en attente (production) |
| `npm run db:seed` | Peuple la base avec le jeu de démonstration |
| `npm run db:studio` | Interface de consultation de la base |

> **Note d'exploitation** : le déploiement applique la compilation, jamais les
> migrations. Après une modification du schéma, appliquer les migrations à la base de
> production avec `npm run db:deploy`.

---

## État d'avancement

**Livré et fonctionnel**

- Consultation de la carte et des offres sans compte
- Création de comptes demandeur d'emploi et employeur, authentification
- Publication d'offres géolocalisées par un employeur
- Fiche détaillée d'une offre
- Tableau de bord employeur : vues et statuts
- Espace d'administration : modération des offres, gestion des comptes, journal d'audit
- Export des données personnelles (art. 20)
- Page Transparence publique
- API documentée (OpenAPI 3.0) et intégration continue

**Prévu, non livré à ce jour**

- Parcours de candidature et suivi des candidatures
- Notification à l'employeur à chaque nouvelle candidature
- Vérification d'activité à la création d'un compte employeur
- Archivage automatique des offres de plus de 30 jours
- Suppression de compte à la demande de l'utilisateur
- Signalement d'offre par un utilisateur

Cette distinction est maintenue à jour : aucune fonctionnalité de la seconde liste n'est
présentée comme disponible dans la documentation ou dans l'interface.

---

## Équipe

| | Domaine |
|---|---|
| **Jad Bghiel** | Relation cabinet, architecture, interface |
| **Emma Vinso** | Cartographie, consultation des offres |
| **Nicolas** | Authentification, administration, modération |
