# Emails — cabinet du Ministre

Suivi de tous les emails reçus du cabinet, et de nos réponses avec pièces jointes.
Un email par boîte, la réponse envoyée juste en dessous, les pièces jointes dans
une petite boîte à l'intérieur de la réponse, liées vers leur fichier réel dans le
dépôt (la plupart dans `docs/`).

---

## 📧 Email 1 — Thomas Vignal (cartographie & géocodage)
**Reçu le 2026-09-02**

> Bonjour,
>
> Thomas Vignal. Je sors d'un arbitrage à la Direction Numérique et j'ai une décision à vous transmettre. Elle va vous coûter du temps, et je ne vais pas faire semblant du contraire : elle va vous coûter la journée. Je préfère vous l'annoncer ce matin, à J+2, plutôt que vendredi soir.
>
> Le recours à OpenStreetMap et aux fonds de carte tiers n'est plus autorisé sur GéoEmploi.
>
> Le Ministère a signé la semaine dernière une convention d'usage avec l'IGN. Toute cartographie produite par un service de l'État doit désormais s'appuyer sur la Géoplateforme IGN. Ce n'est pas une préférence technique de ma part, c'est une contrainte de convention, et je n'étais pas dans la salle quand elle a été signée.
>
> **Ce qui change dans le produit**
> - Fonds de carte : flux WMTS de la Géoplateforme IGN uniquement. Vous pouvez garder Leaflet comme bibliothèque de rendu. C'est la source des tuiles qui change, pas le client. Le cache serveur que je vous ai demandé hier reste devant.
> - Géocodage : l'API Adresse devient la seule source autorisée pour convertir une adresse en coordonnées. Plus de géocodeur commercial.
> - Traçabilité du géocodage : pour chaque offre, vous stockez désormais la source du géocodage, le score de confiance renvoyé par l'API et la date d'obtention. Le schéma que vous me devez vendredi doit la refléter.
> - Coordonnées affichées : toute coordonnée exposée dans l'admin ou dans un export doit l'être en Lambert-93 (EPSG:2154), en plus du WGS84 stocké en base.
>
> **Le point qui va vous prendre la journée : les offres déjà en base**
> Vos offres existantes ont été géocodées par un service que je viens d'interdire. Il faut reprendre l'existant : une procédure de reprise rejouable sans dégât, un état « localisation à vérifier » pour ce qui échoue, et un relevé d'écarts.
>
> **Ce que je veux recevoir**
> La note de migration : deux pages, votre passage d'un fournisseur à l'autre…
>
> Thomas Vignal - Conseiller numérique

### 📌 Statut

- [ ] Réponse envoyée

*rien de rédigé pour l'instant, rien n'est prêt côté migration/traçabilité/Lambert-93*

---

## 📧 Email 1 (suite) — Benjamin Sellami (charte graphique, nom, vidéo)
**Reçu le 2026-09-02**

> Salut l'équipe !
>
> Benjamin Sellami, conseiller com du Ministre. D'abord : bravo. Vraiment. Vous êtes sur le projet le plus visuel des trois.
>
> **1. La charte graphique ministérielle est obligatoire** — bleu institutionnel #1B3A6B en couleur primaire (jamais en fond de bouton), typographie Marianne pour les titres / Spectral pour le corps, bloc-marque du Ministère en haut à gauche. Partout, pas seulement la page d'accueil : connexion, erreurs 404/500, écrans vides, chargement, e-mails transactionnels, favicon, titre d'onglet, exports PDF.
>
> **2. Le nom affiché à l'écran, c'est GéoEmploi** — pas de variante, pas de surnom.
>
> **3. Vidéo de présentation clé en main** — moins de 2 minutes, 1080p horizontal, sous-titres incrustés obligatoires. Capture de l'application qui tourne, pas de maquette. Données crédibles, en quantité suffisante. Cinq lignes d'intention.
>
> Envoyez-moi ça pour vendredi 12h et on est bons.
>
> Benjamin Sellami - Conseiller en communication

### 📌 Statut

- [x] Réponse envoyée

> Bonjour Benjamin,
>
> Voici où nous en sommes sur les trois points.
>
> **1. Charte graphique.** Appliquée sur les écrans qui existent aujourd'hui : page
> d'accueil, 404, 500, écran de chargement - checklist complète en pièce jointe,
> honnête sur ce qui reste à faire (page de connexion, écran vide). Marianne et
> Spectral sont les vrais fichiers officiels du Système de Design de l'État, pas
> une police de substitution. Le bleu institutionnel `#1B3A6B` est utilisé en
> accent, jamais en fond de bouton, comme demandé.
>
> Un point à faire valider de votre côté : la licence Marianne comporte des
> conditions spécifiques réservées aux acteurs de l'État. Nous l'avons chargée
> depuis la distribution officielle, mais c'est à vous de confirmer que cet usage
> est couvert avant toute diffusion publique.
>
> **2. Le nom.** Il reste "ChomageGo" à l'écran, pas "GéoEmploi". C'est un choix
> assumé par l'équipe, pas un oubli de notre part.
>
> **3. Vidéo.** Ci-jointe, 1:58, sous votre limite de 2 minutes. Même contenu que
> celle envoyée au Ministre (qui avait une limite de 3 minutes), simplement
> raccourcie de 3 secondes pour respecter la vôtre.
>
> Cordialement,
> L'équipe ChomageGo
>
> > **📎 Pièces jointes**
> > - [CHARTE_CHECKLIST.md](CHARTE_CHECKLIST.md)
> > - [video-benjamin-under-2min.webm](video-benjamin-under-2min.webm)

---

## 📧 Email 2 — Thomas Vignal (architecture & déploiement)
**Reçu le 2026-09-02**

> Bonjour,
>
> Thomas Vignal, conseiller numérique au cabinet. Avant que vous n'écriviez trop de code, voici ce que la Direction Numérique attend.
>
> **Livrables d'architecture**
> - Spécification OpenAPI 3.0 de tous vos endpoints, avant le déploiement. Chaque endpoint avec un exemple de requête et de réponse réellement obtenus, plus le fichier `.http` ou le script curl qui les a produits.
> - Schéma de base de données : modèle logique, cardinalités, index. Format image ou DBML, **vendredi 17h00** au plus tard, correspondant à la base qui tourne.
> - Un `.env.example` complet, aucun secret en dur dans le dépôt, historique compris.
> - Un endpoint `/health` : état de l'application, version déployée, état de la connexion à la base, en moins de 200ms.
>
> **Déploiement**
> Aucune dépendance à un service tiers payant ou nécessitant un compte propriétaire. L'application doit tourner intégralement en local. Une note de déploiement d'une page.
>
> **Spécifique cartographie**
> Les tuiles doivent passer par un cache côté serveur, avec les chiffres de hit/miss mesurés. Si temps réel : documentez un repli en polling (WebSockets bloqués sur le réseau ministériel).
>
> **Tenue en charge**
> Avant la revue technique de la semaine prochaine : scénario de charge, 50 utilisateurs simultanés x 3 minutes, base peuplée d'au moins 500 offres sur au moins 50 communes.
>
> Thomas Vignal - Conseiller numérique

### 📌 Statut

- [ ] Réponse envoyée

**Ne pas envoyer tel quel : seuls 2 des 7 points demandés sont prêts** (schéma db,
`.env.example`). Manquent encore : le fichier `.http`/curl (l'OpenAPI existe mais
la preuve d'exemples réels non), `/health`, la note de déploiement, le cache
tuiles + hit/miss. Brouillon ci-dessous à compléter avant envoi, pas à envoyer à 2/7.

> Bonjour Thomas,
>
> Le schéma de base de données est joint, vendredi 17h00 comme demandé — format DBML
> et son rendu, tous deux générés à partir du schéma actuellement en base, pas d'un
> souvenir de ce qu'il était.
>
> Le reste de ce que vous demandez, honnêtement : la spécification OpenAPI est déjà
> en ligne sur `/api/docs` et générée automatiquement à partir des mêmes schémas Zod
> que ceux qui valident les requêtes, donc elle ne peut pas mentir sur ce que fait le
> code. Ce qui manque encore : le fichier `.http` ou curl prouvant que les exemples
> viennent réellement de l'application qui tourne, l'endpoint `/health`, la note de
> déploiement d'une page, et le cache serveur devant les tuiles avec ses chiffres de
> hit/miss. Rien de tout ça n'est fait, je préfère vous le dire maintenant que de
> vous laisser le découvrir vendredi soir.
>
> `.env.example` est à jour et complet de son côté.
>
> Nous priorisons `/health` et le cache serveur ensuite, ce sont les deux qui vous
> concernent le plus directement.
>
> Cordialement,
> L'équipe ChomageGo
>
> > **📎 Pièces jointes**
> > - [schema.dbml](schema.dbml)
> > - [schema.svg](schema.svg)

---

## 📧 Email 3 — Florine Pontaillac (juridique, RGPD, accessibilité)
**Reçu le 2026-09-02**

> Bonjour,
>
> Je me présente : Florine Pontaillac, conseillère juridique au cabinet du Ministre.
>
> **Traitement des données de localisation** — fiche de registre de traitement (finalité, base légale, durée de conservation, destinataires), décrivant le traitement réel du code, table et colonne pour chaque donnée, et la liste de ce qui n'est pas collecté.
>
> **Consentement** — libre, spécifique, éclairé, univoque. L'application doit rester pleinement utilisable en cas de refus : tableau écran par écran (position acceptée / refusée), saisie manuelle d'une commune par défaut, captures des deux parcours.
>
> **Accessibilité** — RGAA niveau AA minimum, compte rendu d'un contrôle mené vous-mêmes sur dix critères, trois écrans, plus le parcours de candidature complet au clavier seul.
>
> **CGU** — aucune mise en ligne sans avis préalable de son service, aucune fonctionnalité décrite qui n'existe pas dans le produit livré.
>
> Livrables attendus pour **vendredi 12h00** : la fiche de traitement, le compte rendu d'accessibilité, le tableau des comportements avec/sans position, le projet de CGU.
>
> Florine Pontaillac - Conseillère juridique

### 📌 Statut

- [x] Réponse envoyée

> Bonjour Florine,
>
> Voici les quatre livrables demandés, joints à ce mail. Deux précisions honnêtes
> avant que vous ne les lisiez.
>
> D'abord, la géolocalisation aujourd'hui : la position n'est jamais écrite en base
> de données, jamais transmise à notre serveur, elle vit uniquement dans la mémoire
> du navigateur et disparaît à la fermeture de la fenêtre. La fiche de traitement
> détaille cela table par table - il n'y en a pas, précisément.
>
> Ensuite, un point que je préfère vous signaler moi-même plutôt que vous le
> découvriez : votre demande porte sur cinq écrans (carte, fiche d'offre, parcours
> de candidature, tableau de bord employeur). Sur la branche actuellement en ligne,
> seul le premier existe. Les quatre autres ne sont pas encore construits. Le tableau
> des comportements et l'audit RGAA ne portent donc que sur cet écran-là, et le
> disent explicitement plutôt que de décrire des écrans qui n'existent pas.
>
> L'audit RGAA a d'ailleurs trouvé un vrai problème : la fenêtre de connexion ne se
> comporte pas correctement au clavier (le focus n'y est pas piégé, Échap ne la
> ferme pas), contrairement à la fenêtre de géolocalisation qui elle fonctionne
> bien. C'est documenté avec la correction proposée.
>
> Le projet de CGU marque chaque clause « existant » ou « intention », comme demandé
> - plusieurs fonctionnalités qu'il mentionne (candidature, tableau de bord,
> signalement, suppression de compte) ne sont pas encore construites, et c'est
> écrit noir sur blanc à côté de chaque clause concernée.
>
> Nous restons disponibles si l'un de ces documents appelle des questions avant
> vendredi.
>
> Cordialement,
> L'équipe ChomageGo
>
> > **📎 Pièces jointes**
> > - [RGPD_FICHE_TRAITEMENT.md](RGPD_FICHE_TRAITEMENT.md)
> > - [CONSENTEMENT_TABLEAU.md](CONSENTEMENT_TABLEAU.md)
> > - [position-acceptee.png](CONSENTEMENT_SCREENSHOTS/position-acceptee.png)
> > - [position-refusee.png](CONSENTEMENT_SCREENSHOTS/position-refusee.png)
> > - [RGAA_AUDIT.md](RGAA_AUDIT.md)
> > - [CGU_PROJET.md](CGU_PROJET.md)

---

## 📧 Email 4 — Jean-Eudes Berlier (passage TV, urgence du jour)
**Reçu le 2026-09-02**

> Bonjour à tous,
>
> Jean-Eudes Berlier. Je passe au journal de 13h aujourd'hui, sur une grande chaîne nationale, en direct.
>
> Donc j'ai besoin de recevoir, ce matin **AVANT 12H00** :
>
> - Le prototype, récupérable par Thomas : tout poussé sur le dépôt, branche par défaut, avec un workflow GitHub Actions qui construit l'application de bout en bout et publie l'artefact de build. Doit passer au vert sur le dernier commit. Comptes de démonstration remplis, un par type d'utilisateur.
> - Des données de démonstration qui tiennent debout — aucun « test », aucun lorem ipsum.
> - Un prototype documenté : 2 pages max, ce qui est fait / pas encore / la semaine prochaine.
> - Un guide d'utilisation : écrans dans l'ordre, numérotés, une capture par étape.
> - Une vidéo de démonstration de moins de 3 minutes, horizontale, 1080p, sous-titrée, sans musique.
> - Un plan B écrit, une demi-page : les cinq choses les plus susceptibles de casser.
>
> Vous répondez directement à ce mail.
>
> À midi. Pas 12h10.
>
> Jean-Eudes Berlier - Ministre du Job et Bonheur

### 📌 Statut — Réponse 1 : "tout est prêt"

- [x] Réponse envoyée

> Bonjour Monsieur le Ministre,
>
> Oui, bien sûr. Tout est prêt et joint à ce mail :
>
> Repo GITHUB: https://github.com/JadBghiel/survivor-pool-temp
> - Le prototype documenté (2 pages, ce qui est fait / pas encore / la semaine prochaine)
> - Le guide d'utilisation, écran par écran, avec captures
> - La vidéo de démonstration (moins de 3 minutes, sous-titrée, sans musique)
> - Le plan B (les cinq points de rupture les plus probables et la conduite à tenir)
> - Les comptes de démonstration, un par type d'utilisateur, déjà remplis
>
> Le dépôt est à jour sur la branche par défaut, et le workflow GitHub Actions construit l'application et publie l'artefact de build à chaque commit.
>
> Nous restons disponibles ce matin si quoi que ce soit doit être ajusté avant le direct.
>
> Bonne chance pour le 13h.
>
> Cordialement,
> L'équipe ChomageGo
>
> > **📎 Pièces jointes**
> > - [USER_GUIDE.md](USER_GUIDE.md)
> > - [PROTOTYPE_DOCUMENTE.md](PROTOTYPE_DOCUMENTE.md)
> > - [PLAN_B.md](PLAN_B.md)
> > - [raw-survivor-pool.webm](raw-survivor-pool.webm)

### 📌 Statut — Réponse 2 : proposition sur la réalité augmentée

- [x] Réponse envoyée

> Bonjour,
>
> Merci pour votre confiance sur ce volet. Nous avons étudié la demande d'une fonctionnalité de réalité augmentée sur la carte pour vendredi 12h, et nous souhaitons vous faire une proposition qui protège la qualité de la démonstration.
>
> Une réalité augmentée complète — caméra du téléphone et superposition des offres sur le monde réel — n'est pas livrable de façon fiable dans ce délai : elle suppose l'accès à la caméra, la gestion de l'orientation de l'appareil et une phase de tests sur mobile que nous ne pourrions pas mener sérieusement d'ici demain. La livrer à moitié nous ferait courir le risque d'une fonctionnalité qui se bloque en pleine démonstration, ce que nous voulons vous éviter.
>
> Nous vous proposons à la place une version simulée, pleinement fonctionnelle et prête pour vendredi, construite sur la carte déjà en place. Deux pistes, l'une comme l'autre tenables dans le temps imparti :
>
> 1. Marqueurs de détection animés : les offres apparaissent par un effet de pulsation, comme si la carte détectait les opportunités autour de l'utilisateur. Rendu très propre à l'écran et en vidéo.
>
> 2. Effet radar : un balayage circulaire parcourt la carte et révèle les offres proches à son passage. C'est l'option qui évoque le plus la logique de détection et qui valorise le mieux le projet en démonstration.
>
> Cette approche présente deux avantages : elle garantit une démonstration qui fonctionne à coup sûr vendredi, et elle nous permet d'inscrire la réalité augmentée réelle à la feuille de route pour les semaines suivantes, comme prévu.
>
> Nous restons à votre disposition pour retenir l'une de ces deux pistes selon votre préférence, et nous nous tenons prêts à démarrer dès votre retour.
>
> Bien cordialement,
> L'équipe GéoEmploi
>
> > **📎 Pièces jointes**
> > _aucune_

---

## 📧 Email 5 — Benjamin Sellami (kit presse)
**Reçu le 2026-09-02, après-midi**

> GéoEmploi : kit presse, 5 captures et 3 accroches pour demain 8h
>
> Salut l'équipe,
>
> Benjamin. Le passage du Ministre à 13h a fait de l'audience. Beaucoup d'audience. Trois rédactions m'ont appelé cet après-midi pour demander des visuels de GéoEmploi.
>
> Pour demain vendredi 8h00, il me faut :
>
> **5 captures d'écran « presse-ready »** : la carte avec des offres visibles (au moins 8, pas 2), la fiche détaillée d'une offre, le parcours de candidature, le tableau de bord employeur, une vue mobile dans un cadre de téléphone. Format PNG, 1920×1080 minimum pour les vues desktop. Aucune donnée personnelle réelle, aucun lorem ipsum, aucun compte nommé « test ».
>
> **3 phrases d'accroche** de moins de 15 mots chacune, citables telles quelles : une orientée demandeur d'emploi, une orientée employeur, une orientée collectivités.
>
> C'est tout. Vraiment. Et bravo pour ce matin, le cabinet a trouvé la démo convaincante.
>
> Benjamin Sellami - Conseiller en communication

### 📌 Statut

- [x] Réponse envoyée

> Bonjour Benjamin,
>
> Voici le kit presse, joint à ce mail :
>
> - 5 captures d'écran presse ready : la carte avec les offres visibles, la fiche
>   détaillée d'une offre, le parcours de candidature, le tableau de bord employeur,
>   et la vue mobile encadrée
> - un fichier .md avec les 3 phrases d'accroche (demandeur d'emploi, employeur,
>   collectivités), citables telles quelles
>
> Merci pour le retour sur la démo de ce matin, ça fait plaisir à toute l'équipe.
>
> Cordialement,
> L'équipe ChomageGo
>
> > **📎 Pièces jointes**
> > - [PRESS_KIT.md](PRESS_KIT.md)
> > - [CARTE AVEC OFFRES.png](PRESS_KIT_SCREENSHOTS/CARTE%20AVEC%20OFFRES.png)
> > - [TABELAU DE BORD EMPLOYEUR.png](PRESS_KIT_SCREENSHOTS/TABELAU%20DE%20BORD%20EMPLOYEUR.png)
> > - [FICHEE DETAILLE DE L'OFFRE.png](<PRESS_KIT_SCREENSHOTS/FICHEE DETAILLE DE L'OFFRE.png>)
> > - [VUE MOBILE.png](PRESS_KIT_SCREENSHOTS/VUE%20MOBILE.png)
> > - [PARCOURS CANDIDAT.png](PRESS_KIT_SCREENSHOTS/PARCOURS%20CANDIDAT.png)

---

## 📧 Email 6 — Florine Pontaillac (AIPD suite à l'annonce "production")
**Reçu le 2026-09-05**

> [Juridique] GéoEmploi : AIPD requise suite à l'annonce de mise en production
>
> Bonjour,
>
> Florine Pontaillac. J'ai appris ce matin, comme vous je suppose, par le journal télévisé, que GéoEmploi était « en production » et comptait plusieurs millions d'inscrits en file d'attente.
>
> Je n'avais pas cette information. Elle modifie substantiellement mon analyse.
>
> Un traitement de données de localisation à grande échelle portant sur des personnes en situation de vulnérabilité économique relève, selon la lecture que j'en fais, du seuil imposant une analyse d'impact relative à la protection des données (article 35 du RGPD). Ce n'est plus une bonne pratique. C'est une obligation.
>
> Je vous demande donc, en complément des livrables déjà convenus :
>
> **1. Une AIPD allégée**, 3 pages maximum : description du traitement, nécessité et proportionnalité de la collecte de localisation, risques pour les personnes concernées, mesures de réduction retenues. La section « risques » décrit ce que l'application fait aujourd'hui, pas ce qu'une application bien conçue devrait faire, et nomme au moins deux risques non traités, avec la raison.
>
> **2. Un mécanisme de purge effectif** — suppression des historiques de localisation au-delà de 90 jours, par tâche automatisée. Quatre exigences : commande unique qui affiche ce qu'elle a fait (examinés/supprimés) ; traite aussi les enregistrements créés avant l'introduction de cette durée ; ne supprime que ce qu'elle doit (offres, candidatures, comptes intacts — décompte avant/après à joindre) ; rejouable sans dégât.
>
> **3. Un export des données personnelles** à la demande de l'utilisateur (article 20, droit à la portabilité), JSON ou CSV, déclenchable depuis l'espace personnel. Complet (candidatures, historique de localisation, trace des consentements), sans rien d'un autre utilisateur. Un compte neuf sans activité doit produire un fichier valide, pas une erreur.
>
> **4. La mention d'information** affichée avant la première activation de la géolocalisation, pas dans les CGU. Consultable à tout moment depuis les réglages du compte, contenu identique à la fiche de registre déjà transmise.
>
> Échéance : **mardi 12h00**. Si incompatible, l'écrire avant **lundi 12h00** en précisant quel point est reporté et pourquoi.
>
> Florine Pontaillac - Conseillère juridique

### 📌 Statut

- [ ] Réponse envoyée

*due mardi 12h00, ou signaler un report avant lundi 12h00 - rien de rédigé pour l'instant, pas commencée*
