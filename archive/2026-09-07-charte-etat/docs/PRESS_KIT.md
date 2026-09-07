# Kit presse GéoEmploi — vendredi 8h00

Réponse à la demande de Benjamin Sellami (e-mail 5, kit presse).

## 3 phrases d'accroche

**Orientée demandeur d'emploi** (13 mots)
> Les offres d'emploi autour de vous, sur une carte, sans compte et sans inscription.

**Orientée employeur** (14 mots)
> Publiez votre offre en deux minutes, elle apparaît immédiatement sur la carte des candidats proches.

**Orientée collectivités** (14 mots)
> Une carte publique de l'emploi sur votre territoire, construite sur les données de l'État.

## Données de démonstration

12 offres réelles d'aspect, réparties sur 6 entreprises fictives de la métropole bordelaise
(Bassins à flot, Chapeau Rouge, place de la Victoire, Tauzia, Faussets, avenue Thiers).
Adresses et coordonnées authentiques, intitulés et descriptions crédibles.
Aucune donnée personnelle réelle, aucun « lorem ipsum », aucun compte nommé « test ».

## Comptes de démonstration

Mot de passe commun : `demo1234`

| Rôle | E-mail |
|---|---|
| Employeur | `recrutement@atlantique-logistique.fr` |
| Employeur | `rh@garonne-ingenierie.fr` |
| Candidat | `camille.fabre@example.fr` |

Les six employeurs de la base utilisent le même mot de passe, voir `prisma/seed.ts`.

## Reproduire l'environnement des captures

```bash
npm run db:local
npm run db:migrate
npm run db:seed
npm run dev
```

Puis ouvrir http://localhost:3000 et suivre le tableau ci-dessus.
