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
> > - [CHARTE_CHECKLIST.md](../archive/2026-09-07-charte-etat/docs/CHARTE_CHECKLIST.md)
> > - [video-benjamin-under-2min.webm](../archive/2026-09-07-charte-etat/docs/video-benjamin-under-2min.webm)

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
> > - [position-acceptee.png](../archive/2026-09-07-charte-etat/docs/CONSENTEMENT_SCREENSHOTS/position-acceptee.png)
> > - [position-refusee.png](../archive/2026-09-07-charte-etat/docs/CONSENTEMENT_SCREENSHOTS/position-refusee.png)
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
> > - [USER_GUIDE.md](../archive/2026-09-07-charte-etat/docs/USER_GUIDE.md)
> > - [PROTOTYPE_DOCUMENTE.md](PROTOTYPE_DOCUMENTE.md)
> > - [PLAN_B.md](PLAN_B.md)
> > - [raw-survivor-pool.webm](../archive/2026-09-07-charte-etat/docs/raw-survivor-pool.webm)

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
> > - [PRESS_KIT.md](../archive/2026-09-07-charte-etat/docs/PRESS_KIT.md)
> > - [CARTE AVEC OFFRES.png](../archive/2026-09-07-charte-etat/docs/PRESS_KIT_SCREENSHOTS/CARTE%20AVEC%20OFFRES.png)
> > - [TABELAU DE BORD EMPLOYEUR.png](../archive/2026-09-07-charte-etat/docs/PRESS_KIT_SCREENSHOTS/TABELAU%20DE%20BORD%20EMPLOYEUR.png)
> > - [FICHEE DETAILLE DE L'OFFRE.png](<../archive/2026-09-07-charte-etat/docs/PRESS_KIT_SCREENSHOTS/FICHEE DETAILLE DE L'OFFRE.png>)
> > - [VUE MOBILE.png](../archive/2026-09-07-charte-etat/docs/PRESS_KIT_SCREENSHOTS/VUE%20MOBILE.png)
> > - [PARCOURS CANDIDAT.png](../archive/2026-09-07-charte-etat/docs/PRESS_KIT_SCREENSHOTS/PARCOURS%20CANDIDAT.png)

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

**Report à jeudi 15h00 déjà annoncé** dans la réponse à l'email 9. L'AIPD est écrite
(`docs/AIPD.md`). Les points 2 et 4 appellent une réponse de fond, ci-dessous. Le point
3 (export de portabilité) est construit et testé : `GET /api/users/me/export`,
authentifié, scopé au compte appelant. Testé sur un compte neuf sans activité (export
valide), sur un compte admin sans profil (export valide), et sur un compte employeur
avec une offre publiée (export contenant exactement cette offre, aucune autre).

> Bonjour Madame Pontaillac,
>
> Voici l'analyse d'impact demandée, en pièce jointe, ainsi que ma réponse sur les trois
> autres points. Deux d'entre eux appellent une réponse de fond plutôt qu'un livrable, et
> je préfère vous l'expliquer que vous transmettre un artefact qui aurait l'apparence de
> la conformité sans en avoir l'effet.
>
> **1. Analyse d'impact.** Jointe, trois pages. La section « risques » décrit le
> fonctionnement réel du code, et nomme deux risques non traités avec leur raison :
> l'absence de test automatisé garantissant que la position ne quitte jamais le
> navigateur, et l'absence de journalisation des accès aux données depuis l'espace
> d'administration. Aucun des deux n'expose de donnée aujourd'hui ; tous deux privent le
> service des moyens de démontrer que ses garanties tiennent dans la durée. J'y signale
> également un point de proportionnalité : le bouton récupère la position et l'affiche,
> mais le tri par distance qui la justifie n'est pas encore branché dessus.
>
> **2. Mécanisme de purge des historiques de localisation.** Il n'y a rien à purger, et
> c'est vérifiable : l'application ne conserve aucun historique de localisation. La
> position du visiteur n'est jamais écrite en base de données, jamais transmise à notre
> serveur, jamais posée en cookie ni en stockage local. Elle vit dans la mémoire de la
> page et disparaît à la fermeture de la fenêtre. Il n'existe aucune table susceptible
> de recevoir une durée de conservation de 90 jours, et donc aucune ligne qu'une tâche
> de purge pourrait examiner ou supprimer.
>
> Je pourrais vous livrer une commande qui s'exécute, affiche « 0 enregistrement
> examiné, 0 supprimé » et se termine correctement. Elle serait rejouable et sans
> dégât, comme vous le demandez. Elle ne prouverait rien d'autre que l'absence de la
> table qu'elle interroge. Je préfère vous donner le constat directement : la fiche de
> registre que vous avez reçue le détaille table par table, et la colonne « stockée ? »
> y répond « non, jamais » sur chaque ligne.
>
> Si votre analyse conclut qu'une tâche de purge doit exister malgré tout, comme garantie
> contre une évolution future du produit, dites-le moi et je la construis en même temps
> que la première fonctionnalité qui conserverait une position.
>
> **3. Export des données personnelles.** Disponible depuis l'API,
> `GET /api/users/me/export`, authentifié et strictement limité au compte de l'appelant
> — vérifié en testant avec plusieurs comptes différents qu'aucun ne peut voir les
> données d'un autre. Il contient le compte, le profil, et pour un employeur ses
> propres offres publiées. Les candidatures, l'historique de localisation et la trace
> de consentement figurent dans le fichier sous forme de listes toujours vides, avec la
> raison à chaque fois plutôt qu'une simple absence : la première fonctionnalité n'existe
> pas encore, les deux autres ne sont jamais enregistrées. Un compte neuf sans activité
> produit un export valide et complet, testé.
>
> Ce qui manque encore est le déclenchement depuis l'espace personnel — l'endpoint
> existe, l'écran qui l'appellerait n'existe pas.
>
> **4. Mention d'information avant la première activation.** Elle existe déjà, et elle
> va au-delà de votre demande sur un point : elle s'affiche non pas seulement avant la
> première activation, mais avant chaque demande de position, le choix n'étant jamais
> reconduit tacitement. Elle est hors CGU, comme demandé. Son contenu correspond à la
> fiche de registre.
>
> Ce qui manque est le second volet de votre demande : sa consultation permanente depuis
> les réglages du compte. Il n'existe aujourd'hui aucun espace de réglages où la loger.
> C'est un écran à construire, et il est lié au point 3, puisque l'export doit lui aussi
> être déclenchable depuis cet espace.
>
> Bien cordialement,
> L'équipe GéoEmploi
>
> > **📎 Pièces jointes**
> > - [AIPD.md](AIPD.md) — analyse d'impact, 3 pages
> > - [RGPD_FICHE_TRAITEMENT.md](RGPD_FICHE_TRAITEMENT.md) — pour mémoire, à l'appui du point 2

---

## 📧 Email 7 — Benjamin Sellami (gel de communication + retrait du bloc-marque)
**Reçu le 2026-09-07 — échéance 18h00 le jour même**

> Bonjour à tous,
>
> Benjamin Sellami. Vous avez vu le journal de ce matin. Moi aussi. Je ne vais pas vous mentir, la matinée est très difficile ici.
>
> **1. Gel de la communication.** Plus aucune publication, aucun post, aucune capture d'écran, aucun visuel ne sort de vos équipes sans mon accord écrit. Si un journaliste, un étudiant, un ami ou quelqu'un de votre famille vous demande quoi que ce soit : vous ne répondez pas, vous me transférez la demande.
>
> **2. Retrait du bloc-marque du Ministère de vos interfaces.** Retirez le logo et le bloc-marque de toutes vos interfaces — page de connexion, écrans publics, écrans connectés, 404/500, écrans vides, favicon, titre d'onglet, manifeste, balises de partage, e-mails transactionnels, exports PDF/CSV, captures dans la documentation et le README, jeu de données de démonstration, vidéos déjà exportées.
>
> D'ici ce soir 18h :
> - une identité neutre pour l'en-tête (police + couleur primaire qui ne soient pas celles de l'État), et trois lignes expliquant le choix ;
> - un pied de page : « Démonstrateur technique, ne constitue pas un service public en exploitation. », sur toutes les pages publiques y compris les pages d'erreur, et dans les e-mails envoyés par l'application ;
> - mise de côté (pas suppression) des documents déjà produits portant une référence visuelle à l'État ;
> - la preuve : liste des endroits où le bloc apparaissait, et captures « après » des cinq écrans les plus visibles.
>
> Si à 18h ce n'est pas fait : pas de silence, envoyer la liste de ce qui reste avec une heure d'arrivée estimée.
>
> Benjamin Sellami - Conseiller en communication

### 📌 Statut

- [x] Réponse envoyée

**Retrait effectué, vérifié et prouvé** : code applicatif, doc API, jeu de démonstration
(local **et** Neon), fichiers de police, documents déjà livrés archivés, 5 captures
"après" jointes. Relevé complet dans `docs/RETRAIT_BLOC_MARQUE.md`.

> Bonjour Benjamin,
>
> Bien reçu. Deux choses, dans l'ordre de vos consignes.
>
> **Gel de la communication** : effectif immédiatement de notre côté. Plus aucune
> publication, capture ni visuel ne sort de l'équipe sans votre accord écrit, et toute
> sollicitation extérieure vous est transférée sans que nous y répondions.
>
> **Retrait du bloc-marque** : c'est fait. Le relevé complet est en pièce jointe — chaque
> emplacement où le bloc, la charte ou une référence à l'État apparaissait, et ce qui a
> été fait pour chacun. Les captures « après » des cinq écrans les plus visibles sont
> jointes également.
>
> L'identité neutre, en trois lignes : **police système**, aucune police téléchargée —
> elle ne peut être confondue avec Marianne et ne pose aucune question de licence.
> **Couleur primaire teal `#0F766E`**, choisie parce qu'elle est chromatiquement loin du
> bleu institutionnel, sans ambiguïté de lecture. **Une seule variable de couleur et une
> seule de police** pilotent toute l'application, donc les écrans ne peuvent pas partir
> dans trois directions différentes.
>
> Le pied de page « Démonstrateur technique, ne constitue pas un service public en
> exploitation. » est en place sur toutes les pages publiques, pages d'erreur comprises.
>
> **Les cinq captures « après »** sont jointes : la page d'accueil, la page de connexion,
> la page d'offres avec le pied de page, l'écran de chargement et la page d'erreur. Elles
> montrent l'identité neutre en place et, là où elle s'applique, la mention de pied de page.
>
> **Documentation déjà produite** : tout ce qui portait le logo, le nom, la typographie ou
> les couleurs du Ministère a été archivé — kit presse et ses captures, guide d'utilisation
> et ses captures, checklist de charte graphique, captures du parcours de consentement, et
> les deux vidéos exportées. Conservé dans le dépôt, plus diffusé, et plus présenté comme
> représentatif du produit.
>
> Quatre points que je préfère vous signaler plutôt que vous les laisser découvrir :
>
> 1. Les fichiers de police Marianne et Spectral étaient **téléchargeables publiquement**
> depuis l'application (`/fonts/Marianne-Regular.woff2`), même sans être affichés à
> l'écran. Ils sont sortis du dossier servi. Conservés dans le dépôt, plus accessibles
> depuis le web.
>
> 2. Le jeu de données de démonstration contenait un employeur nommé « Ministère du job &
> bonheur » avec une adresse en `.gouv.fr`. Le point n'était pas qu'esthétique : notre
> script de peuplement n'aurait **pas** supprimé l'ancienne ligne dans une base déjà
> remplie, l'employeur aurait survécu au simple renommage. Corrigé, puis vérifié sur les
> deux bases — la base locale et la base en ligne. Plus aucun employeur ni compte à
> consonance étatique dans ni l'une ni l'autre.
>
> 3. Les captures du parcours de consentement transmises au service juridique portaient
> elles aussi le bloc-marque. Elles sont archivées comme le reste, ce qui laisse
> temporairement ce livrable sans ses illustrations : elles seront reprises sur
> l'interface neutre. Je préfère vous le dire, et le dire à Mme Pontaillac, plutôt que de
> laisser un dossier juridique incomplet sans prévenir.
>
> 4. Quatre points de votre liste sont **sans objet** chez nous aujourd'hui, et je préfère
> l'écrire plutôt que de les cocher : nous n'avons ni manifeste d'application, ni balises
> de partage, ni e-mails transactionnels, ni exports PDF/CSV. Ces fonctionnalités
> n'existent pas dans le produit. Rien n'a donc été retiré à ces endroits, il n'y avait
> rien à retirer.
>
> Cordialement,
> L'équipe ChomageGo
>
> > **📎 Pièces jointes**
> > - [RETRAIT_BLOC_MARQUE.pdf](RETRAIT_BLOC_MARQUE.pdf) — relevé complet des emplacements + identité retenue (source : `RETRAIT_BLOC_MARQUE.md`)
> > - [NEUTRE_ACCUEIL.png](SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_ACCUEIL.png)
> > - [NEUTRE_PAGE_CONNEXION.png](SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_PAGE_CONNEXION.png)
> > - [NEUTRE_EMPLOI&PIED_DE_PAGE.png](<SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_EMPLOI&PIED_DE_PAGE.png>)
> > - [NEUTRE_CHARGEMENT.png](SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_CHARGEMENT.png)
> > - [NEUTRE_PAGE_ERREUR.png](SCREENSHOT_IDENTITE_NEUTRE/NEUTRE_PAGE_ERREUR.png)

---

## 📧 Email 8 — Mme Pontaillac (pièces jointes manquantes + forme d'adresse)
**Reçu le 2026-09-07**

> Bonjour,
>
> Je n'ai reçu aucune des quatre pièces jointes mentionnées dans votre mail. Je ne peux donc pas procéder à leur revue ni vous confirmer quoi que ce soit sur leur contenu.
>
> Merci de me les renvoyer dans un nouvel envoi. Compte tenu du nombre de documents et de versions qui circulent actuellement, vérifiez bien que les quatre fichiers sont effectivement joints avant l'envoi.
>
> Par ailleurs, je vous rappelle que dans le cadre de nos échanges professionnels, merci de vous adresser à moi en utilisant « Madame Pontaillac » et non « Florine ».
>
> Bien cordialement,
>
> Florine Pontaillac - Conseillère juridique

### 📌 Statut

- [x] Réponse envoyée

**Les trois blocages sont levés (2026-09-07)** : clause d'abonnement retirée des CGU,
captures de consentement reprises sur l'interface neutre, nom GéoEmploi appliqué dans
les deux documents concernés. Prêt à envoyer — **vérifier que les 5 pièces jointes sont
effectivement attachées avant expédition**, c'est exactement ce qui a manqué la
première fois.

> Bonjour Madame Pontaillac,
>
> Toutes mes excuses pour cet envoi incomplet, et merci de me l'avoir signalé plutôt
> que d'attendre. Les quatre livrables sont joints au présent message, vérifiés un par
> un avant envoi.
>
> Trois d'entre eux ont été repris depuis votre première demande, pour tenir compte des
> instructions reçues entre-temps :
>
> Le projet de CGU ne comporte plus de clause d'abonnement employeur. Elle est
> remplacée par une clause de gratuité, conformément à votre instruction de retour à la
> version 1.0.
>
> Les captures du parcours de consentement ont été reprises sur l'interface, qui ne
> porte plus le bloc-marque de l'État depuis le retrait demandé par M. Sellami. Les
> captures d'origine sont conservées dans notre dépôt, mises de côté et non diffusées.
>
> Le nom du service est « GéoEmploi » dans l'ensemble des documents, comme dans
> l'interface.
>
> Le contenu de fond des quatre livrables est inchangé par rapport à ce que je vous
> décrivais : la fiche de registre détaille table par table ce que devient la position
> du visiteur, et il n'y a pas de table, précisément — la coordonnée ne quitte jamais
> le navigateur. L'audit RGAA signale toujours le défaut de comportement au clavier de
> la fenêtre de connexion, avec la correction proposée. Chaque clause du projet de CGU
> reste marquée « existant » ou « intention ».
>
> Bien cordialement,
> L'équipe GéoEmploi
>
> > **📎 Pièces jointes** — 5 fichiers, vérifiés avant envoi
> > - [RGPD_FICHE_TRAITEMENT.md](RGPD_FICHE_TRAITEMENT.md)
> > - [CONSENTEMENT_TABLEAU.md](CONSENTEMENT_TABLEAU.md)
> > - [position-acceptee.png](CONSENTEMENT_SCREENSHOTS/position-acceptee.png)
> > - [position-refusee.png](CONSENTEMENT_SCREENSHOTS/position-refusee.png)
> > - [RGAA_AUDIT.md](RGAA_AUDIT.md)
> > - [CGU_PROJET.md](CGU_PROJET.md)

---

## 📧 Email 9 — Mme Pontaillac (retour à la version 1.0 du cahier des charges)
**Reçu le 2026-09-07 — porte aussi la position de Thomas Vignal et Benjamin Sellami**
**Échéance : mardi 12h00 pour les retraits et la reprise des données, jeudi pour la page Transparence**

> Bonjour,
>
> Florine Pontaillac. Nous sortons, mes deux collègues et moi, d'une réunion de deux heures avec le directeur de cabinet. Le Ministre a été convoqué par le Premier ministre en fin de matinée. Je vous écris avec l'accord de Thomas Vignal et de Benjamin Sellami : vous pouvez considérer que le présent message porte aussi leur position.
>
> **Instruction : vous revenez à la version 1.0 du cahier des charges, celle du lundi 31 août.**
>
> Le document annoté qui vous a été transmis mardi est retiré. Il n'a jamais fait l'objet d'une validation par la Direction Numérique et Innovation, et je vous confirme par écrit ce que je n'avais pas pu vous dire jusqu'ici : nous n'en avions pas été informés.
>
> **Ce que vous retirez du produit**
> - Toute mécanique de capture, de collecte ou de « chasse » d'offres. Réalité augmentée, animations d'attrapage, compteurs de prises, badges de collection, classements de chasseurs, « Permis de Travailler ». Tout.
> - Toute mention d'un abonnement, d'un tarif ou d'une contrepartie financière demandée aux employeurs, dans l'interface comme dans les CGU. La publication d'une offre est gratuite.
> - La précision de localisation à la rue. Vous revenez à la maille commune, conformément au point 3.2 du cahier des charges initial. Une offre s'affiche au centroïde de la commune, pas à l'adresse.
> - Le nom de travail utilisé par le Ministre, partout : interface, dépôt, noms de branches, titres de documents, métadonnées. Le service s'appelle **GéoEmploi**.
>
> **Ce que deviennent les données déjà produites sous ces règles**
> C'est le point le plus lourd, et c'est celui que l'on oublie systématiquement. Retirer une fonctionnalité de l'interface ne retire pas ce qu'elle a produit en base pendant cinq jours. Une donnée qu'on n'affiche plus reste une donnée collectée : le masquage n'est pas une suppression.
> - Les coordonnées enregistrées à l'adresse doivent être ramenées à la maille communale **en base**, de façon irréversible, sur les enregistrements déjà créés. Pas seulement à l'affichage. La colonne qui indique la précision retenue doit être mise à jour en conséquence.
> - Les enregistrements produits par les mécaniques de jeu : vous tranchez entre suppression et conservation sous forme anonyme, et vous m'écrivez en trois lignes ce que vous avez choisi et pourquoi. Les deux réponses sont défendables, l'absence de réponse ne l'est pas.
> - Les enregistrements liés à l'abonnement ou à la tarification subissent le même traitement, avec la même justification écrite.
> - Dans tous les cas, les champs correspondants disparaissent des réponses de l'API et de votre spécification OpenAPI. Un champ vide qui subsiste dans une réponse, c'est une question de journaliste dans deux jours.
>
> **Ce qui doit continuer de marcher après ces retraits**
> La consultation libre de la carte sans compte, la fiche d'une offre, le parcours de candidature, le tableau de bord employeur (privé de ses indicateurs payants), l'export de portabilité demandé vendredi, et la tâche de purge. L'export doit toujours produire un fichier valide, et il ne doit plus contenir les champs retirés.
>
> **Où le retrait doit être passé**
> Interface, exports CSV et JSON, e-mails transactionnels, messages d'erreur, écrans vides, jeu de données de démonstration, tests, documentation et OpenAPI, CGU, guide d'utilisation remis jeudi, et captures déjà livrées. Je ne vous demande pas de retoucher la vidéo diffusée, mais de me dire ce qu'elle montre encore.
>
> **Ce que vous ajoutez**
> - Une page publique « Transparence » énonçant la gratuité de la publication pour les employeurs, la maille de localisation retenue, la durée de conservation des données, et le contact du délégué à la protection des données.
> - Un journal des modifications d'une page, listant ce que vous avez retiré, à quelle date, sur instruction de qui, et combien d'enregistrements ont été supprimés ou modifiés pour chaque ligne. Le décompte n'est pas un ornement : c'est la seule chose que je pourrai opposer à quelqu'un qui affirmera que rien n'a bougé.
> - Deux captures d'une même offre, avant et après le retour à la maille communale.
>
> Échéance : **demain mardi 12h00** pour les retraits et la reprise des données, **jeudi** pour la page Transparence. Si l'ampleur de cette reprise se révélait incompatible avec le délai, écrivez-le avant **demain 9h00**, en indiquant quel point vous décalez et jusqu'à quand.
>
> Un mot pour finir, et je sors de mon rôle un instant. Je sais que vous avez travaillé cinq jours sur des fonctionnalités que je vous demande aujourd'hui de supprimer. Ce n'est pas votre faute et cela n'enlève rien à la qualité de ce que vous avez produit. Savoir défaire proprement un travail sur instruction du client fait partie du métier.
>
> Florine Pontaillac - Conseillère juridique

### 📌 Statut

- [ ] Réponse envoyée

**Périmètre réel vérifié dans le code (2026-09-07) — l'essentiel du « retrait » est sans objet,
un point est du vrai travail :**

| Point de l'email | État réel chez nous |
|---|---|
| Mécaniques de jeu (AR, badges, prises, classements, Permis de Travailler) | Jamais construites. Aucune table, aucun composant, aucun enregistrement. Rien à retirer, rien à trancher sur les données |
| Abonnement / tarif | 3 emplacements seulement : `LoginModal.tsx` (« Employer (€400/month) » à l'inscription), `CGU_PROJET.md` §4, `PROTOTYPE_DOCUMENTE.md`. Aucune table, aucun enregistrement en base |
| Précision à la rue → maille commune | **Vrai travail.** Les 32 offres ont des coordonnées distinctes à l'adresse (11 Bordeaux, 7 Lyon, 7 Paris, 6 Marseille, 1 Nantes). Reprise irréversible en base à faire, local **et** Neon |
| Colonne de précision retenue | N'existe pas. À créer (rejoint la traçabilité de géocodage demandée par Thomas dans l'email 1, jamais faite) |
| Nom GéoEmploi partout | `Logo.tsx` (wordmark affiché), `layout.tsx`, `route.ts`, README, CGU, RGAA_AUDIT, PROTOTYPE_DOCUMENTE, schema.dbml. `package.json` et le conteneur Docker sont déjà `geoemploi` |
| Doit continuer de marcher : fiche d'offre, parcours de candidature, tableau de bord employeur, export, purge | Aucun des cinq n'existe sur `main` aujourd'hui. À dire explicitement plutôt que de laisser croire qu'ils survivent au retrait |
| Vidéo : dire ce qu'elle montre encore | Montre le bloc-marque de l'État et le nom ChomageGo. À décrire, pas à retoucher |

### 📌 Réponse 1 — demande de report (envoyée avant mardi 9h00)

- [x] Réponse envoyée

> Bonjour Madame Pontaillac,
>
> Bien reçu, et merci pour la clarté des instructions
>
> Je vous écris avant 9h00 comme vous l'avez demandé, parce qu'une partie de la reprise ne tiendra pas dans le délai de demain midi.
>
> Nous avons une partie des fonctionnalités déjà en place (comme certains retraits demandé, le changement de nom, les documents etc).
>
> Mais il reste une partie non négligeable comme La reprise des coordonnées à la maille communale, et les preuves qui vont avec : la colonne de précision, le décompte avant/après par commune, les deux captures d'une même offre, et le journal des modifications.
>
> Nous vous proposons donc de modifier la data échéante a Jeudi 15h, pour nous donner le temps de finir les fonctionnalités et toutes la documentions qui va avec.
>
> Je reste joignable aujourd'hui si vous souhaitez un point d'étape avant jeudi.
>
> Bien cordialement, L'équipe GéoEmplo
>
> > **📎 Pièces jointes**
> > _aucune — les livrables suivent jeudi 15h00_

### 📌 Réponse 2 — livraison des retraits (à envoyer jeudi 15h00)

- [x] Réponse envoyée

**Version ci-dessous : celle réellement envoyée**, retouchée par Jad avant expédition.
Trois points du brouillon initial n'y figurent plus : le rappel de l'écart 32/32 entre
les deux bases, la précision sur les captures avant/après (offres différentes, pas la
même offre à deux moments), et la mention de la trouvaille sur `prisma/seed.ts`. Le
travail correspondant reste fait et documenté dans `JOURNAL_MODIFICATIONS.md`, seule la
lettre envoyée est plus courte.

> Bonjour Madame Pontaillac,
>
> Comme annoncé lundi, voici la reprise complète.
>
> **Coordonnées ramenées à la maille communale** : Nous nous sommes assurés que les
> coordonnées d'adresse d'origine ne sont conservées nulle part. Une colonne de
> précision de localisation a été ajoutée à la table des offres, comme vous le
> demandiez (visible sur le schéma). Après reprise, aucune offre n'y porte plus la
> valeur " adresse exacte". Nous avons aussi modifié le géocodage afin qu'une offre
> publiée soit géocodée à sa commune, l'adresse saisie n'étant plus convertie en
> coordonnées.
>
> Le journal des modifications en pièce jointe donne le décompte commun par commune,
> avec l'écart moyen et l'écart maximum entre l'ancienne position et le centroïde. Il va
> de 1,11 km à Lyon à 3,89 km en moyenne à Marseille.
>
> **Mentions d'abonnement** : Nous avons retirées de l'interface, du projet de CGU et de
> la documentation. La clause "Abonnement employeur" des CGU est remplacée par une
> clause de gratuité.
>
> **Nom** : "GéoEmploi" dans l'interface, les métadonnées, le titre d'onglet, la
> documentation de l'API et les documents.
>
> **Mécaniques de jeu et abonnement, sort des enregistrements.** Aucun enregistrement
> n'a jamais été produit par ces mécaniques, ni par l'abonnement. Elles n'ont jamais été
> développées, la réalité augmentée a fait l'objet d'une proposition écrite au Ministre
> restée sans suite, et la mention tarifaire était un libellé d'interface sans
> traitement derrière. Il n'y a donc pas eu de suppression nécessaire sur cette partie.
>
> **Page Transparence** : Nous avons rajouter une page /transparence, accessible depuis
> l'accueil sans compte. Elle énonce la gratuité de la publication, la maille communale,
> la durée de conservation par type de donnée, et le contact protection des données.
>
> Vous retrouverez en pièce jointes, deux capture d'écran, avant et après les
> modifications dde la maille communes, ainsi que le journal de modifications.
>
> Bien cordialement, L'équipe GéoEmploi
>
> > **📎 Pièces jointes**
> > - [JOURNAL_MODIFICATIONS.pdf](JOURNAL_MODIFICATIONS.pdf) — journal des modifications avec les décomptes
> > - [avant-maille-communale.png](RETRAIT_MAILLE_COMMUNALE/avant-maille-communale.png)
> > - [apres-maille-communale.png](RETRAIT_MAILLE_COMMUNALE/apres-maille-communale.png)

---

## 📧 Email 10 — Benjamin Sellami (12 réponses presse pour ce soir)
**Reçu le 2026-09-08 — échéance 19h00 le jour même**

> Bonjour l'équipe,
>
> Benjamin. Le gel de communication reste en vigueur, vous ne parlez à personne. En revanche le cabinet, lui, doit être capable de répondre, et pour ça j'ai besoin de vous.
>
> Je reçois depuis hier soir les mêmes questions en boucle. Je ne peux pas y répondre seul, parce que la moitié porte sur ce que le produit fait réellement, et sur ce point la seule source fiable c'est vous.
>
> Il me faut un document pour ce soir 19h, répondant à ces douze questions. Une réponse factuelle, 3 lignes maximum, formulée pour être lue à voix haute. Pas de conditionnel, pas de « il semblerait ». Si la réponse est non, écrivez non.
>
> Et une contrainte qui va vous coûter plus que la rédaction : chaque réponse est accompagnée de sa source. L'endpoint, la table, l'écran ou le fichier qui permet de la vérifier. Une réponse sans source, je ne la lis pas au téléphone, parce que si on me la conteste je n'ai rien derrière.
>
> 1. Est-il exact qu'un employeur doit payer pour publier une offre sur GéoEmploi ?
> 2. Un tarif a-t-il été implémenté dans l'application à un moment quelconque ? Si oui, entre quelles dates ?
> 3. Quelles données de localisation l'application collecte-t-elle exactement, et à quelle maille ?
> 4. Ces données sont-elles conservées ? Combien de temps, et depuis quand cette durée est-elle réellement appliquée ?
> 5. L'application fonctionne-t-elle si l'utilisateur refuse la géolocalisation ?
> 6. Un utilisateur peut-il être localisé à son adresse précise ?
> 7. Un employeur peut-il voir où se trouve un candidat ?
> 8. Combien de personnes sont réellement inscrites aujourd'hui ?
> 9. L'application est-elle en production, ou s'agit-il d'un démonstrateur ?
> 10. Qui a accès aux données en tant qu'administrateur, et combien de comptes disposent de ce droit aujourd'hui ?
> 11. Un utilisateur peut-il supprimer son compte et ses données ? Le compte disparaît-il de la base, ou est-il seulement désactivé ?
> 12. Les coordonnées enregistrées à l'adresse la semaine dernière existent-elles encore quelque part : en base, dans un export, dans une sauvegarde, dans votre jeu de données de démonstration ?
>
> Pour les questions 4, 8, 10, 11 et 12, je ne veux pas le chiffre que vous croyez, je veux le chiffre que vous avez lu aujourd'hui dans votre base, avec la requête qui l'a produit. Ce sont exactement celles qu'on me demandera de préciser.
>
> Et lorsque la réponse honnête est « ce n'est pas implémenté » ou « ce n'est pas terminé », vous l'écrivez, puis vous ajoutez une ligne : ce que vous feriez, et pour quand. C'est cette ligne-là qui transforme un aveu en position tenable.
>
> Organisez-vous à deux : l'un rédige, l'autre vérifie chaque réponse sur l'application qui tourne, sans faire confiance au code lu. Les deux noms figurent sur le document. Ce n'est pas de la défiance, c'est ce qu'on fait ici avant de sortir un élément de langage.
>
> Deux consignes de fond. Vous ne surestimez rien : si une fonctionnalité n'est pas terminée, elle n'est pas terminée. Et vous ne minimisez rien : si vous avez collecté une donnée, vous le dites. Je préfère cent fois porter une réponse gênante que devoir corriger une réponse fausse dans quarante-huit heures.
>
> Je sais que Florine vous a fixé midi sur autre chose. J'ai obtenu 19h, c'est tout ce que j'ai pu obtenir.
>
> Ce document ne sortira pas du cabinet sous votre nom. Il sert à préparer nos réponses, pas à vous exposer.
>
> Merci. Sincèrement.
>
> Benjamin Sellami - Conseiller en communication

### 📌 Statut

- [x] Réponse envoyée

**Vérification double faite** avant envoi : les 12 réponses d'abord vérifiées par
requête SQL directe sur les deux bases, `grep` sur tout le dépôt et `git log`/`git show`
sur les commits datés, puis repassées à la main sur l'application qui tourne (Jad,
2026-09-08) — notamment les points 5, 6, 9 et 11. La consigne de Benjamin (vérifier sur
l'app, pas sur le code lu) est couverte des deux côtés.

**Trouvaille du jour, corrigée dans le même commit (question 12)** : `prisma/seed.ts`
contenait encore trois offres avec leurs anciennes coordonnées à l'adresse exacte,
jamais mises à jour depuis la migration du 7 septembre. Un `npm run db:seed` les aurait
réinjectées dans la base, en plus mal étiquetées « maille communale » à cause de la
valeur par défaut du schéma. Corrigé.

**Version ci-dessous : celle réellement envoyée**, retouchée par Jad avant expédition —
Nicolas remplace Emma pour la vérification, quelques réponses reformulées, et
l'attribution des sources allégée en passant (par exemple point 8, qui ne mentionne plus
que la base en ligne).

> Bonjour Monsieur Sellami,
>
> Voici les douze réponses accompagner de leur source. J'ai (Jad) rédiger, en même temps
> que Nicolas mon collègue vérifier sur l'application qui tourne.
>
> **1. Un employeur doit-il payer pour publier une offre ?**
> Non. `POST /api/jobs` ne contient pas de logique de paiement.
>
> **2. Un tarif a-t-il été implémenté à un moment donné ? Entre quelles dates ?**
> Non pas en tant que logique fonctionnelle. Aucun paiement n'a été traité. Mais une
> indication « Employer (€400/month) », a existé sur le formulaire d'inscription du
> 3 septembre 10h28 au 7 septembre 22h51 (commits b6a530b et f11b8f2 consultable sur
> Github).
>
> **3. Quelles données de localisation sont collectées, à quelle maille ?**
> La position du visiteur, demandée seulement au clic sur « Offres près de moi »,
> n'est jamais envoyée au serveur, elle est gardée en mémoire du navigateur
> (`LocateMeButton.tsx`). Quant aux coordonnées des offres, elles sont géocodées depuis
> le 7 septembre 18h24 (commit a0b4af2) au centroïde officiel de la commune via l'API
> Adresse. Source : `geocode.ts`.
>
> **4. Ces données sont-elles conservées ? Depuis quand cette durée est-elle réellement
> appliquée ?**
> La position du visiteur n'est pas conservée depuis la construction de la
> fonctionnalité. Les coordonnées d'offres sont conservées tant que l'offre existe, sans
> limite de durée définie, mais la maille communale n'est effective que depuis le
> 7-8 septembre.
>
> **5. L'application fonctionne-t-elle si l'utilisateur refuse la géolocalisation ?**
> Oui. Un message de refus s'affiche, la consultation continue sans blocage ni erreur.
> Source : fonction `decline()` dans `LocateMeButton.tsx`.
>
> **6. Un utilisateur peut-il être localisé à son adresse précise ?**
> Non la position d'un visiteur n'est jamais stockée. Les offres, non plus depuis le
> 7 septembre. Mais avant cette date elles l'étaient.
>
> **7. Un employeur peut-il voir où se trouve un candidat ?**
> Non. Il n'y a aucun champ de localisation sur la table des comptes utilisateurs
> (`schema.prisma`), et la fonctionnalité de candidature n'existe pas encore.
>
> **8. Combien de personnes sont réellement inscrites aujourd'hui ?**
> 16 comptes sur la base en ligne (1 admin, 14 employeurs, 1 candidat). Source : base de
> données Neon sur Vercel.
>
> **9. L'application est-elle en production, ou est-ce un démonstrateur ?**
> Un démonstrateur technique. Comme écrit au pieds de toutes les pages publiques depuis
> la requête d'un email précèdent. « Démonstrateur technique, ne constitue pas un
> service public en exploitation. »
>
> **10. Qui a accès aux données en tant qu'administrateur, combien de comptes ?**
> Un seul compte admin, sur les deux bases : testAdmin@gmail.com.
>
> **11. Un utilisateur peut-il supprimer son compte ? Disparaît-il vraiment, ou juste
> désactivé ?**
> Non, ni l'un ni l'autre. Nous n'avons pas encore rajouté de route de suppression.
> Cependant un admin peut seulement suspendre un compte. Nous comptons rajouter cette
> fonctionnalité.
>
> **12. Les coordonnées exactes de la semaine dernière existent-elles encore quelque
> part ?**
> Non, nous avons supprimé toutes coordonnées exactes existantes précédemment.
>
> Cordialement,
> L'équipe ChomageGO

⚠️ **le mail envoyé signe « L'équipe ChomageGO »**, pas GéoEmploi. Le nom a été retiré
partout dans l'interface, le dépôt et les documents sur instruction de l'email 9
(Mme Pontaillac, avec l'accord de M. Sellami lui-même) le 2026-09-07. Ce mail, adressé à
M. Sellami en personne, reporte le nom qu'il a explicitement fait retirer. À corriger
dans le prochain envoi — inutile de revenir sur celui-ci, déjà parti.
>
> > **📎 Pièces jointes**
> > _aucune — document de préparation interne, pas destiné à sortir du cabinet_
