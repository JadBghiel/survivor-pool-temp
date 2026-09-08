# Fiche de registre de traitement — géolocalisation du visiteur

Article 30 RGPD. Décrit le traitement tel qu'il fonctionne réellement dans le code
au 2026-09-05 (branche `main`), pas une version prévue.

## Le traitement

**Nom du traitement** : géolocalisation du visiteur au clic sur "Offres près de moi"
(`src/components/LocateMeButton.tsx`).

**Finalité** : proposer à l'utilisateur de trier les offres affichées par distance à
sa position. *Précision utile pour l'analyse des risques : aujourd'hui le bouton
récupère la position et l'affiche (précision en mètres), mais le tri effectif de la
carte par distance n'est pas encore branché sur ce bouton (le texte affiché à
l'écran, "le tri des offres arrive avec la carte", l'annonce comme une suite
prévue). La collecte a donc lieu avant que la fonctionnalité qui la justifie soit
complète.*

**Base légale** : consentement (art. 6.1.a). Une notice s'affiche avant tout appel à
l'API de géolocalisation du navigateur, avec deux boutons de poids visuel égal,
"Refuser" et "Autoriser" — aucune case pré-cochée, aucun choix par défaut.

**Personnes concernées** : tout visiteur cliquant sur le bouton, avec ou sans compte.

**Durée de conservation** : aucune. La coordonnée n'est jamais écrite en base de
données, jamais envoyée dans une requête réseau vers notre serveur, jamais posée en
cookie ni en stockage local du navigateur. Elle vit uniquement dans l'état mémoire
du composant React (`useState`) et disparaît à la fermeture de la fenêtre de dialogue
(clic sur Fermer, touche Échap, ou navigation) ou au rafraîchissement de la page.

**Destinataires** : aucun. La donnée ne quitte jamais le navigateur dans ce flux -
elle n'est lue que par le navigateur lui-même (API `navigator.geolocation`) et
affichée localement.

**Table et colonne où chaque donnée est stockée** :

| Donnée | Table | Colonne | Stockée ? |
|---|---|---|---|
| Latitude / longitude du visiteur | — | — | **non, jamais** |
| Précision de la position (mètres) | — | — | **non, jamais** |
| Choix accepté/refusé | — | — | **non**, redemandé à chaque clic |

## Ce qui n'est explicitement pas collecté

- Aucun historique de position n'est constitué, ni par visite ni dans le temps
- Aucune adresse IP n'est corrélée à une position
- Aucune géolocalisation en arrière-plan ou hors interaction explicite de l'utilisateur
- Aucune géolocalisation liée à un compte utilisateur (le bouton fonctionne à
  l'identique connecté ou non)
- Aucun tiers ne reçoit cette donnée (pas d'analytics, pas de fournisseur de carte
  recevant la position - le fond de carte IGN est chargé indépendamment de ce bouton)

## Pour mémoire : les autres données personnelles du produit

Hors périmètre de cette fiche (qui porte sur la localisation), mais pour la
complétude : email et mot de passe (haché, jamais en clair) dans `User`, prénom/nom/
compétences dans `SeekerProfile`, nom d'entreprise dans `EmployerProfile` - toutes
liées à un compte et supprimées en cascade si le compte est supprimé.
