# CNAC MURIMA W'ISANGI — Feuille de route

## Contexte
Reconstruction moderne du progiciel CodeIgniter fourni (`application.zip`) en application web
React / TanStack Start + Lovable Cloud, entièrement en français.

## Import des données source — TERMINÉ
L'archive `application.zip` (et les archives imbriquées `administration.zip`, `communaute.zip`,
`projets.zip`) ne contient **que du code PHP** : aucun fichier `.sql`, dump MySQL, `.csv`, `.json`
ou export tableur. `application/config/database.php` ne contient que la structure de connexion.
Aucun export n'était présent dans l'archive initiale. Un dump a ensuite été fourni et importé sans fabriquer de données.
Le schéma conserve une colonne `legacy_id`
unique permettant de préserver les anciennes clés et relations.

## Fait
- [x] Analyse de l'archive et cartographie des modules
- [x] Activation de Lovable Cloud
- [x] Schéma relationnel (RH, données, stock, charroi, communauté, mobile money, projets, suivi, archives)
- [x] Projets & partenariats regroupés : programmes, partenaires, projets, participants, activités et budget restant automatique
- [x] RLS + rôles (`admin`, `gestionnaire`, `agent`), profils auto-créés
- [x] Registre de modules et pages CRUD génériques
- [x] Écran de connexion, coquille applicative, navigation latérale par groupes
- [x] Tableau de bord opérationnel (stock, carburant, véhicules, alertes, tendances)
- [x] Rapports et statistiques
- [x] Compte administrateur initial advaxen@gmail.com avec tous les droits
- [x] Suppression de l'option publique « Créer un compte » (connexion e-mail/mot de passe uniquement)

- [x] Gestion des utilisateurs, rôles et accès aux onglets depuis l'interface administrateur

## Fait (04/09/2026)
- [x] Module Communauté conforme aux contrôleurs legacy : Fédérations → Unions /
      Coopératives / Associations → Membres, + Intervenants.
- [x] Groupe Localisation : Provinces → Communes → Zones → Collines.
- [x] Import du dump `cnacbgthrks_gestion.sql` : 5 provinces, 42 communes, 451 zones,
      3044 collines, 9 fédérations, 4 unions, 3 coopératives, 4 associations, 6 membres,
      1 intervenant, 5 employés, 6 véhicules, 1 bon carburant, 1 article + mouvements,
      6 fournisseurs, 3 congés, 1 salaire. Relations préservées via `legacy_id`.
- Réserve : dans le dump, la colonne `PRIX` de `carburant` contient le type de produit
  (« Mazout ») et non un montant ; elle est importée dans le champ Station/Dépôt et le
  montant reste à 0. Les tables `achats_sanya`, `ventes_sanya`, `projets`, `programmes`
  et `partenaires` sont vides dans le dump : rien n'a été inventé.

## Fait (14/09/2026)
- [x] Fiches Employés alignées sur les contrôleurs source : permanents/non permanents,
      statuts, études, affectation, profil, banque, compte, responsabilité, contrat et dossier.
- [x] Les cinq employés importés ont été complétés avec les valeurs réelles du dump.
- [x] Documents RH privés limités à 5 Mo et création sécurisée des comptes employés par l'admin.
- [x] Archives et Planification séparées selon le type source, avec dossiers, auteurs,
      fichiers privés et 13 enregistrements réels importés depuis le dump.
- [x] Paie séparée des fiches Employés : paramétrage, calcul détaillé automatique,
      fiches mensuelles, circuit de validation et données réelles du dump.

## Fait (profils)
- [x] Gestion des profils : Départements → Fonctions → Profils (listes dédiées) et
      affectation en cascade dans la fiche Employé, en remplacement des anciennes
      listes Service et Profil.
- [x] Départements, Fonctions et Profils regroupés sur une seule page à onglets,
      avec une seule entrée dans le menu et maintien des droits séparés.
- [x] Formulaire public de collecte terrain (/collecte, sans connexion) : fiches_terrain,
      listes en cascade, suivi dans le module « Fiches terrain » et indicateur au tableau de bord.
- [x] Livre de banque : versements, retraits, imputations (plan comptable réel), solde automatique.
