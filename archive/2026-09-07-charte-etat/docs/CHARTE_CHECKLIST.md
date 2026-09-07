# Charte graphique ministérielle — liste de conformité

Chaque écran passé en revue, marqué conforme ou à faire avec une date. Police
Marianne et Spectral réellement chargées depuis les fichiers officiels du DSFR
(`@gouvfr/dsfr`, le paquet npm public du Système de Design de l'État), pas une
police de substitution. Bleu institutionnel `#1B3A6B` utilisé en accent (titres,
liens, focus) - jamais en fond de bouton, comme demandé.

| Écran | Statut | Détail |
|---|---|---|
| Page d'accueil (carte + liste) | **conforme** | bloc-marque haut-gauche, Marianne sur les titres, Spectral sur le corps, bleu institutionnel sur le lien "Documentation de l'API" |
| Page de connexion | **à faire, prévu la semaine prochaine** | la fenêtre de connexion (`AuthHeader.tsx`) n'hérite pas encore des styles de police/couleur du reste de la page - à corriger en même temps que le bug clavier déjà relevé dans `RGAA_AUDIT.md` |
| Erreur 404 | **conforme** | `src/app/not-found.tsx` créé, bloc-marque + Marianne + Spectral + bouton de retour |
| Erreur 500 | **conforme** | `src/app/error.tsx` créé, même traitement que le 404 |
| Écran vide ("aucune offre") | **à faire, prévu la semaine prochaine** | le message existe (`page.tsx`) mais n'a pas encore reçu le même traitement typographique que le reste de la page |
| Écran de chargement | **conforme** | `src/app/loading.tsx` créé, spinner à l'accent bleu institutionnel |
| E-mails transactionnels | **non applicable** | l'application n'envoie aujourd'hui aucun e-mail (pas de confirmation d'inscription, pas de notification) - rien à mettre en conformité tant que cette fonctionnalité n'existe pas |
| Favicon | **conforme** | logo ChomageGo (repère + triangle), couleur d'accent recolorée en bleu institutionnel `#1B3A6B` à la place de l'indigo d'origine - voir la note sur le logo plus bas |
| Titre d'onglet | **conforme** | "ChomageGo" - voir la note sur le nom plus bas |
| Exports PDF | **non applicable** | l'application ne génère aujourd'hui aucun export PDF - rien à mettre en conformité tant que cette fonctionnalité n'existe pas |

## Sur le nom affiché à l'écran

Le titre d'onglet et l'en-tête affichent "ChomageGo", pas "GéoEmploi" comme demandé
dans cet e-mail. C'est un choix assumé par l'équipe, pas un oubli - voir la réponse
ci-jointe pour le contexte.

## Sur le logo

Le repère de carte + triangle (favicon, en-tête, écrans 404/500/chargement) est le
logo ChomageGo, dessiné avec un accent indigo `#5A64EE` à l'origine. Nous avons
recoloré cet accent en bleu institutionnel `#1B3A6B` pour l'usage sur le produit -
le principe même du logo ("accent utilisé à exactement deux endroits, jamais sur une
surface d'interface") correspondait déjà à votre règle, seule la couleur a changé.

## Sur les polices

Les fichiers Marianne et Spectral utilisés ici viennent directement du paquet npm
public `@gouvfr/dsfr` (le Système de Design de l'État), pas d'une police
ressemblante. La licence Marianne comporte des conditions spécifiques réservées aux
acteurs de la sphère étatique - à faire valider par vos soins avant toute diffusion
externe, ce point ne relève pas d'une décision technique de notre côté.
