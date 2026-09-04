# Comportement de l'application avec et sans position

Captures prises sur l'application qui tourne (`npm run dev`, 2026-09-05), pas des
maquettes. Voir `CONSENTEMENT_SCREENSHOTS/`.

## Tableau écran par écran

Seul un écran existe aujourd'hui sur `main` et utilise la position (voir la note en
bas de page sur les écrans qui n'existent pas encore).

| Écran | Position acceptée | Position refusée |
|---|---|---|
| Carte + liste des offres (page unique) | Position affichée avec sa précision en mètres. La carte reste identique à ce moment : le tri par distance n'est pas encore branché (voir `RGPD_FICHE_TRAITEMENT.md`) - donc visuellement rien ne change encore pour l'utilisateur | La fenêtre se ferme immédiatement, aucun appel à l'API du navigateur n'a lieu, aucune erreur, aucun écran vide - la carte et la liste restent pleinement consultables |
| Fiche détaillée d'une offre | n'existe pas encore comme écran séparé sur `main` | n'existe pas encore comme écran séparé sur `main` |
| Parcours de candidature | n'existe pas encore sur `main` | n'existe pas encore sur `main` |
| Tableau de bord employeur | n'existe pas encore sur `main`, et n'utiliserait de toute façon pas la position du visiteur | n'existe pas encore sur `main` |

## Ce qui est vérifié et vrai aujourd'hui

- Refuser ne renvoie jamais vers une page d'erreur ni un écran vide - confirmé par
  capture (`position-refusee.png`)
- Le consentement se redemande à chaque clic sur le bouton, il n'y a pas d'état
  "refusé une fois, refusé pour toujours" ni de perte de compte ou de session liée
  à ce choix
- La saisie manuelle d'une commune comme position par défaut, demandée par Florine,
  **n'est pas implémentée** - aujourd'hui un refus laisse simplement la carte non
  triée, il n'y a pas de champ de saisie de ville de repli

## Note honnête sur le périmètre

Le cahier des charges nomme cinq écrans à couvrir. Trois d'entre eux (fiche détaillée,
parcours de candidature, tableau de bord employeur) n'existent pas encore comme
pages du produit livré sur `main` - ils sont documentés comme non commencés dans
`PROTOTYPE_DOCUMENTE.md`. Ce tableau ne peut décrire un comportement qui n'existe pas
sans devenir la plaquette que Florine a explicitement dit ne pas vouloir recevoir. Il
sera complété au fur et à mesure que ces écrans sont construits.
