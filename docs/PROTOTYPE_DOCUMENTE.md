# ChomageGo — PROTOTYPE DOCUMENTATION


## En trois phrases

Une carte de France s'ouvre dans le navigateur, sans compte et sans installation. Les offres
d'emploi y apparaissent à leur adresse réelle, et on peut les trier de la plus proche à la plus
lointaine. On peut créer un compte, comme candidat ou comme entreprise.

Le tout tourne sur un ordinateur ordinaire, sans abonnement.

---

## Ce qui marche aujourd'hui

**La carte**

-  On ouvre la page, la carte s'affiche, les offres sont posées dessus à leur adresse, on peut naviguer dessus sans avoir de compte.
- Le fond de carte vient de l'IGN et les adresses sont converties en points par le service
  d'adresses de l'État, comme M. Vignal l'a demand
- Sous la carte, la liste des offres : intitulé du poste, entreprise, ville, type de contrat.

**Le bouton « Offres près de moi »**

- Il demande la position, après avoir expliqué en quatre lignes à quoi elle sert.
- Si la personne refuse, ferme la fenêtre, ou si le téléphone ne trouve pas le signal,
  l'application continue de fonctionner normalement.
- La position n'est jamais enregistrée sur nos serveurs : elle sert à trier, puis elle disparaît.
- Le tri par distance fonctionne et affiche les kilomètres.

**Les comptes**

- Création de compte candidat (nom, prénom) ou entreprise (nom de la société), avec adresse
  e-mail et mot de passe.
- Connexion, déconnexion, et la session reste ouverte d'une visite à l'autre.
- Les mots de passe ne sont jamais conservés en clair.
- L'abonnement entreprise à 400 €/mois est affiché au moment de l'inscription.

**Pour l'équipe qui reprendrait le projet**

- Toutes les fonctions du service sont documentées sur une page consultable, qui se met à jour
  toute seule quand le code change.
- Le projet s'installe et démarre sur une machine vierge, sans compte chez un éditeur, sans clé
  d'accès à acheter.

---

## Ce qui n'est pas encore fait

- **Publier une offre depuis le site.** Les offres visibles aujourd'hui ont été mises en base
  directement par nous. Le formulaire qui permettrait à une entreprise de créer son offre
  elle-même n'existe pas encore. C'est notre priorité immédiate.
- **Postuler.** Un candidat peut créer son compte, mais le bouton « je postule » n'existe pas
  encore, ni le suivi des candidatures.
- **La réalité augmentée, les badges et le Permis de Travail JEB.** Pas commencés.
- **Le temps réel.** Une nouvelle offre n'apparaît pas encore instantanément sur l'écran des
  candidats du secteur.
- **Le tableau de bord entreprise et l'espace administrateur.** Pas commencés.
- **La charte graphique du Ministère.** Les écrans sont neutres pour l'instant, reste à faire le travail d'interface d'utilisation
- **Les données de démonstration.** Il n'y a que trois offres en base, sur trois villes
  (Nantes, Lyon, Bordeaux). C'est suffisant pour une démonstration filmée.

---

## Ce qui arrive la semaine prochaine

Dans cet ordre, du plus utile au moins urgent.

1. **Le formulaire de publication d'offre**, avec l'adresse transformée automatiquement en point
   sur la carte.
2. **La candidature** : postuler depuis une offre, et suivre l'avancement de ses candidatures.
3. **Le tableau de bord de l'entreprise** : offres publiées, nombre de vues, candidatures reçues,
   et l'état de l'abonnement.
4. **L'espace administrateur** : voir, modérer, suspendre un compte, et les chiffres nationaux.
5. **Un jeu de données crédible** : plusieurs centaines d'offres réparties sur toute la France,
   avec des entreprises et des intitulés qui tiennent debout.
6. **La charte graphique** appliquée à tous les écrans, pas seulement à la page d'accueil.
7. **L'archivage automatique** des offres de plus de 30 jours, et le signalement d'une offre
   abusive.
8. **La documentation technique et le bilan de projet**, attendus en fin de semaine 2.

Puis, dans la foulée : l'affichage en temps réel, et la vue « à la Pokémon GO », d'abord simulée
sur la carte avant toute réalité augmentée réelle.

---

## Deux choses à savoir avant le direct

- **Le nom affiché à l'écran est « ChomageGo ».** C'est le nom de la version 1.1 de la
  spécification. À noter que M. Sellami avait demandé « GéoEmploi » pour tout ce qui peut être
  filmé ou capturé : si vous montrez la tablette, c'est « ChomageGo » qui apparaîtra.
- **Trois offres seulement sont visibles aujourd'hui.** Si le journaliste prend la tablette et
  clique partout, il verra une carte peu remplie et aucun bouton pour postuler. Nous pouvons
  remplir la base dans la matinée si vous nous donnez le feu vert.
