# Journal des modifications: retour à la version 1.0

Registre des retraits opérés sur GéoEmploi et de leur effet en base de données.
Chaque ligne indique ce qui a été retiré, à quelle date, sur instruction de qui, et
le nombre d'enregistrements supprimés ou modifiés.

---

## Retraits

| # | Ce qui a été retiré | Date | Sur instruction de | Enregistrements supprimés | Enregistrements modifiés |
|---|---|---|---|---|---|
| 1 | Coordonnées à l'adresse exacte, ramenées au centroïde de la commune | 2026-09-07 | Mme Pontaillac, email du 2026-09-07 | 0 | **64** (32 en base locale, 32 en base en ligne) |
| 2 | Mention tarifaire « Employer (€400/month) » au formulaire d'inscription | 2026-09-07 | Mme Pontaillac, email du 2026-09-07 | 0 | 0 (libellé d'interface, aucune donnée associée) |
| 3 | Clause « Abonnement employeur » du projet de CGU, remplacée par une clause de gratuité | 2026-09-07 | Mme Pontaillac, email du 2026-09-07 | 0 | 0 |
| 4 | Mentions d'abonnement dans la documentation du prototype | 2026-09-07 | Mme Pontaillac, email du 2026-09-07 | 0 | 0 |
| 5 | Mécaniques de capture, badges, compteurs, classements, « Permis de Travailler » | — | Mme Pontaillac, email du 2026-09-07 | **0** | **0** |
| 6 | Nom de travail « ChomageGo », remplacé par « GéoEmploi » | 2026-09-07 | Mme Pontaillac, email du 2026-09-07 | 0 | 0 |
| 7 | Bloc-marque et charte graphique de l'État | 2026-09-07 | M. Sellami, email du 2026-09-07 | 0 | 1 (employeur de démonstration renommé) |

---

## Ligne 1 — reprise des coordonnées à la maille communale

Le retrait le plus lourd, et le seul qui touche des données déjà enregistrées.

**Avant** : chaque offre portait les coordonnées de son adresse postale exacte,
obtenues par géocodage à la rue via l'API Adresse.
**Après** : chaque offre porte le centroïde officiel de sa commune, obtenu via l'API
Adresse en `type=municipality`. La modification est faite en base, pas à l'affichage,
et elle est irréversible : les coordonnées d'origine ne sont conservées nulle part.

Une colonne `locationPrecision` a été ajoutée à la table `Job` pour porter la
précision retenue (`EXACT` / `MUNICIPALITY`), conformément à la demande. Après reprise,
**aucune offre n'est restée en `EXACT`** sur l'une ou l'autre base.

### Base locale — 32 offres reprises

| Commune | Offres | Écart moyen | Écart maximum |
|---|---|---|---|
| Bordeaux | 11 | 2,46 km | 3,64 km |
| Lyon | 7 | 1,11 km | 1,98 km |
| Marseille | 6 | 3,89 km | 4,08 km |
| Nantes | 1 | 2,88 km | 2,88 km |
| Paris | 7 | 1,45 km | 2,21 km |
| **Total** | **32** | | |

### Base en ligne — 32 offres reprises

| Commune | Offres | Écart moyen | Écart maximum |
|---|---|---|---|
| Bordeaux | 12 | 2,54 km | 3,64 km |
| Lyon | 6 | 1,26 km | 1,98 km |
| Marseille | 6 | 3,89 km | 4,08 km |
| Paris | 7 | 1,45 km | 2,21 km |
| Tours | 1 | 0,20 km | 0,20 km |
| **Total** | **32** | | |

> Les deux bases contiennent chacune 32 offres, mais leur répartition diffère
> légèrement (Nantes en local, Tours en ligne ; 11 contre 12 offres à Bordeaux). Cet
> écart préexistait à la reprise et ne résulte pas d'elle : les deux bases ont été
> peuplées séparément. Nous le signalons plutôt que de présenter un décompte unique
> qui masquerait la différence.

**Vérification** : après reprise, toutes les offres d'une même commune partagent
exactement la même coordonnée. Contrôle exécuté sur les deux bases —
`COUNT(DISTINCT (latitude, longitude))` renvoie 1 pour chaque commune.

**Effet visible** : les offres d'une même commune se superposent désormais en un seul
point sur la carte. C'est le comportement attendu de la maille communale, pas un
défaut d'affichage.

**Trouvaille en cours de route, corrigée le 2026-09-08** : le script de peuplement du
dépôt (`prisma/seed.ts`) contenait encore trois offres avec leurs anciennes coordonnées
à l'adresse exacte, codées en dur, jamais mises à jour lors de la reprise ci-dessus. Un
`npm run db:seed` les aurait réinjectées dans la base — et, pire, mal étiquetées « maille
communale » à cause de la valeur par défaut du schéma. Corrigé dans le commit `eda4fb9` :
les trois offres pointent maintenant vers le même centroïde que la reprise, et la
précision est fixée explicitement plutôt que laissée au défaut implicite.

**Captures avant / après, une précision honnête** : les deux captures jointes montrent
des offres différentes, pas la même offre à deux moments. La capture « avant »
(2026-09-02, kit presse) montre plusieurs offres de Bordeaux dispersées dans différents
quartiers. La capture « après » (2026-09-08) montre une offre précise sélectionnée,
centrée sur le centroïde communal. Une paire « même offre, avant/après » à l'identique
n'est plus reconstituable : la reprise étant irréversible, les anciennes coordonnées par
offre n'existent plus nulle part pour recréer l'état d'origine à l'identique. La paire
fournie montre néanmoins sans ambiguïté le changement : plusieurs points dispersés avant,
un seul point partagé après.

---

## Ligne 5 — mécaniques de jeu : aucun enregistrement

Le décompte est de zéro, et il demande une explication plutôt qu'un chiffre seul.

Ces fonctionnalités — réalité augmentée, animations d'attrapage, compteurs de prises,
badges de collection, classements, « Permis de Travailler » — **n'ont jamais été
développées**. Elles ont fait l'objet d'une proposition écrite au Ministre le
2026-09-02, restée sans suite. Aucune table, aucune colonne, aucun composant
d'interface n'a jamais existé pour les porter.

Il n'y a donc **rien à supprimer et rien à anonymiser** : la question du sort des
enregistrements est sans objet, faute d'enregistrements. Ce constat est vérifiable
dans l'historique du dépôt et dans le schéma de base de données.

---

## Lignes 2 à 4 — abonnement : aucun enregistrement

Même situation, pour la même raison. La mention « 400 €/mois » était un libellé
affiché dans le formulaire d'inscription et une clause d'intention dans le projet de
CGU. **Aucun paiement n'a jamais été collecté, aucun palier tarifaire n'a jamais été
implémenté, aucune donnée d'abonnement n'a jamais été écrite en base.**

Le choix retenu est donc la suppression pure et simple des mentions, sans traitement
de données associé — puisqu'aucune donnée n'a été produite.

---

## Ce que la vidéo déjà diffusée montre encore

La vidéo de démonstration transmise le 2026-09-02 a été tournée avant les deux
instructions. Elle montre encore :

- le bloc-marque du Ministère et la charte graphique de l'État ;
- le nom « ChomageGo » ;
- des offres positionnées à l'adresse exacte, et non au centroïde de leur commune.

Conformément à la demande, elle n'a pas été retouchée. Elle a été retirée de la
diffusion et archivée dans le dépôt.

---

## Page Transparence

Ajoutée conformément à la demande, publique, sans compte requis :
[`/transparence`](../src/app/transparence/page.tsx). Énonce la gratuité de la
publication, la maille de localisation retenue, la durée de conservation par type de
donnée, et le contact protection des données. Liée depuis la page d'accueil, en pied de
page, à côté de la mention démonstrateur.

---

## Portée du retrait

Passé sur : interface, documentation, spécification OpenAPI, projet de CGU, jeu de
données de démonstration (y compris le script de peuplement, voir plus haut),
métadonnées et titre d'onglet, favicon, base de données locale et base en ligne.

Sans objet à ce jour, faute d'existence dans le produit : exports CSV et JSON,
e-mails transactionnels, manifeste d'application, balises de partage.
