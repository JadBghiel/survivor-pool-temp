# Audit d'accessibilité RGAA — niveau AA

Contrôle mené par l'équipe, pas une déclaration de principe. Testé à la main sur
l'application qui tourne (2026-09-05), lecture du code source à l'appui.

## Périmètre honnête

Florine a demandé trois écrans : la carte, le formulaire de candidature, le tableau
de bord employeur. Seul le premier existe sur `main` aujourd'hui - les deux autres
sont documentés comme non commencés dans `PROTOTYPE_DOCUMENTE.md`. Cet audit porte
donc sur l'écran unique existant (page d'accueil : carte, liste des offres, bouton
géolocalisation, connexion/inscription), et sera étendu quand les deux autres
écrans existeront.

## Dix critères retenus, et pourquoi

| # | Critère RGAA | Pourquoi celui-là |
|---|---|---|
| 1 | 1.1 Chaque image porte-t-elle une alternative textuelle ? | la carte est faite d'images de tuiles, cas limite classique |
| 2 | 3.2 Contraste texte/fond suffisant (AA) ? | textes gris clair utilisés partout pour le texte secondaire |
| 3 | 7.1 Chaque script est-il compatible avec la navigation au clavier ? | deux fenêtres modales dans l'écran, point de rupture fréquent |
| 4 | 7.3 Chaque script maintient-il le focus visible ? | idem, sortie de focus hors modale = piège classique |
| 5 | 8.3 Le code respecte-t-il une structure de titres cohérente ? | un seul h1/h2 sur cette page, simple à vérifier honnêtement |
| 6 | 8.9 Les balises ne sont-elles pas utilisées uniquement pour la présentation ? | boutons vs div cliquables |
| 7 | 9.1 Structuration par balises sémantiques (main, header, nav) ? | page utilise déjà main/header |
| 8 | 11.1 Chaque champ de formulaire a-t-il une étiquette ? | formulaire de connexion présent sur cette page |
| 9 | 12.6/12.8 Zones de regroupement identifiables, ordre de tabulation cohérent ? | deux modales + carte interactive sur la même page |
| 10 | 13.3 Contenu en langue française correctement déclaré ? | vérification triviale mais obligatoire, base de tout le reste |

## Résultats

| # | Résultat | Écart constaté |
|---|---|---|
| 1 | **Non conforme** | les tuiles de la carte IGN (Leaflet) n'ont aucune alternative textuelle - normal pour ce type de composant, mais aucun résumé textuel alternatif du contenu de la carte n'est proposé à côté (ex: liste des villes visibles). La liste des offres sous la carte contourne partiellement le problème pour le contenu métier |
| 2 | **Non vérifié avec un outil, lecture visuelle seulement** | le texte secondaire (`text-neutral-500`, `text-neutral-400`) est gris clair sur fond blanc - à confirmer avec un contrôleur de contraste automatisé avant de déclarer conforme, ne pas prendre ce point pour acquis |
| 3 | **Conforme pour la fenêtre de géolocalisation, non conforme pour la fenêtre de connexion** | `LocateMeButton.tsx` utilise un élément `<dialog>` natif du navigateur (piège de focus et fermeture Échap gérés nativement). `AuthHeader.tsx` utilise une simple `<div>` positionnée en superposition, sans `role="dialog"`, sans `aria-modal`, sans piège de focus ni fermeture au clavier - un utilisateur au clavier peut sortir de cette fenêtre par Tab et continuer d'interagir avec la page derrière |
| 4 | **Même écart que le 3** | conséquence directe : le focus peut sortir visuellement de la fenêtre de connexion sans que rien ne l'empêche |
| 5 | **Conforme** | un seul h1 ("ChomageGo"), pas de saut de niveau constaté sur cette page |
| 6 | **Conforme** | tous les éléments cliquables du code sont de vrais `<button>`, aucune `<div onClick>` trouvée |
| 7 | **Conforme** | `<main>` et `<header>` bien utilisés dans `page.tsx` |
| 8 | **Non vérifié précisément, à surveiller** | les champs email/mot de passe dans `AuthHeader.tsx` utilisent des `<label>` visibles associés par position, pas de `aria-` explicite trouvé dans le code (`grep aria- src/` ne retourne aucun résultat) - fonctionnellement lisible visuellement, lien programmatique label/champ à vérifier avec un lecteur d'écran réel avant de déclarer conforme |
| 9 | **Non conforme** | aucun attribut `aria-` n'existe nulle part dans le code (`src/`) - aucune zone n'est explicitement identifiée pour un lecteur d'écran (pas de `role="region"`, `aria-label` sur la carte, etc.) |
| 10 | **Conforme** | `<html lang="fr">` bien présent dans `layout.tsx` |

## Parcours clavier seul (Tab, Entrée, Échap, sans souris)

Fait à la main sur l'écran existant : Tab atteint bien le bouton "Offres près de
moi", puis "Log in / Register", tous deux activables au clavier (vrais `<button>`).
**Ça casse ici** : en ouvrant la fenêtre de connexion (`AuthHeader`), Tab continue de
parcourir les éléments de la page situés derrière la fenêtre au lieu de rester
piégé dedans, et Échap ne la ferme pas - contrairement à la fenêtre de
géolocalisation, qui elle se comporte correctement au clavier grâce à `<dialog>`.
Florine l'avait annoncé : "il cassera quelque part." C'est ici.

## Recommandation immédiate

Remplacer la `<div>` de `AuthHeader.tsx` par un élément `<dialog>` natif, comme
`LocateMeButton.tsx` le fait déjà - la solution existe dans le code, il s'agit de la
généraliser plutôt que d'ajouter une gestion de piège de focus à la main.
