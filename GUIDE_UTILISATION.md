# Guide d'utilisation — CNAC MURIMA W'ISANGI

Système de gestion en ligne. Ce guide explique, pas à pas, comment utiliser l'application au quotidien.

## 1. Se connecter

1. Ouvrez l'adresse de l'application.
2. Saisissez votre e-mail et votre mot de passe, puis cliquez sur **Se connecter**.
3. Vous arrivez directement sur le **Tableau de bord**.

Il n'y a pas de création de compte publique : c'est l'administrateur qui crée les comptes.
En cas d'oubli de mot de passe, contactez l'administrateur.

## 2. Se repérer dans l'écran

- **Menu latéral (à gauche)** : accès à toutes les rubriques. Sur téléphone, appuyez sur l'icône ☰ en haut.
- **Tableau de bord** : chiffres clés et alertes.
- **Rapports** : synthèses par domaine.
- **Déconnexion** : bouton en bas du menu.

Les rubriques sont regroupées ainsi :

| Groupe | Contenu |
|---|---|
| Administration / RH | Employés, Congés, Présences, Salaires |
| Communauté | Fédérations, Unions, Coopératives, Associations, Membres, Intervenants |
| Localisation | Provinces, Communes, Zones, Collines |
| Données commerciales | Clients, Fournisseurs, Achats, Ventes, Budgets |
| Stock | Articles, Mouvements de stock |
| Charroi | Véhicules, Carburant, Entretiens |
| Finances & suivi | Caisse & opérations, Mobile money, Archives |
| Projets & partenariats | Programmes, Partenaires, Projets |

## 3. Le tableau de bord

Il affiche :

- la valeur et le nombre d'articles en stock ;
- les articles sous le seuil ou en rupture ;
- le carburant disponible et les dépenses de la période ;
- les véhicules à entretenir ;
- les **alertes prioritaires** à traiter ;
- des raccourcis vers Stock, Carburant, Véhicules et Rapports.

Si une rubrique est vide, un message l'indique clairement : il faut alors saisir ou importer les données.

## 4. Travailler avec une rubrique (listes)

Chaque rubrique fonctionne de la même façon :

1. **Rechercher** : tapez dans le champ de recherche en haut de la liste.
2. **Ajouter** : bouton **Nouveau** → remplissez le formulaire → **Enregistrer**.
3. **Modifier** : cliquez sur la ligne concernée, ajustez, puis enregistrez.
4. **Supprimer** : action de suppression sur la ligne (confirmation demandée).

Les champs marqués comme obligatoires doivent être remplis. Les champs de type liste (par exemple
« Province », « Colline », « Employé responsable ») proposent les enregistrements déjà créés :
créez d'abord l'élément parent si vous ne le trouvez pas.

## 5. Hiérarchie communautaire

L'organisation suit l'ordre suivant :

```text
Fédération  (Province)
   └── Union  (Commune de la province)
          └── Coopérative  (Zone de la commune)
                 └── Association  (Colline de la zone)
                        └── Membres
```

La saisie suit obligatoirement cet ordre : l'administration crée la Fédération, la Fédération
crée ses Unions, une Union crée ses Coopératives, une Coopérative crée ses Associations, et
l'Association enregistre ses Membres. Chaque niveau hérite de la localisation de son niveau
supérieur : les communes proposées sont celles de la province de la fédération, les zones celles
de la commune de l'union, les collines celles de la zone de la coopérative.
Les **Intervenants** sont rattachés à une province.

## 6. Localisation

Les lieux suivent la hiérarchie **Province → Commune → Zone → Colline**.
Créez toujours le niveau supérieur avant le niveau inférieur.

## 7. Stock

1. Créez l'**Article** (désignation, unité, seuil d'alerte, prix).
2. Enregistrez chaque **Mouvement de stock** (entrée ou sortie, quantité, date).
3. Le stock disponible et les alertes de seuil se mettent à jour automatiquement sur le tableau de bord.

## 8. Charroi (véhicules et carburant)

1. Enregistrez le **Véhicule** (plaque, marque, type, statut).
2. Saisissez chaque **plein de carburant** (véhicule, quantité, date, station/dépôt).
3. Notez les **Entretiens** réalisés ou prévus pour suivre les échéances.

## 9. Rapports

La page **Rapports** rassemble les synthèses : ressources humaines, carburant, communauté,
projets et budgets. Elle se met à jour automatiquement à partir des données saisies.

## 10. Bonnes pratiques

- Saisissez les données au fil de l'eau, pas en fin de mois.
- Respectez l'ordre des niveaux (localisation, communauté) pour éviter les fiches orphelines.
- Vérifiez les alertes du tableau de bord chaque matin.
- Ne partagez jamais votre mot de passe ; chaque agent doit avoir son compte.
- Déconnectez-vous sur un poste partagé.

## 11. Points à connaître sur les données importées

- Dans l'ancienne base, la colonne « prix » du carburant contenait le **type de produit**
  (ex. « Mazout ») : cette information a été placée dans le champ Station/Dépôt et le montant
  reste à 0 tant qu'il n'est pas saisi.
- Les rubriques Achats, Ventes, Clients, Projets, Programmes et Partenaires étaient vides dans
  l'ancienne base : aucune donnée n'a été inventée, elles sont à remplir.

## 12. Assistance

Pour un nouveau compte, un droit d'accès ou une anomalie, contactez l'administrateur du système.
