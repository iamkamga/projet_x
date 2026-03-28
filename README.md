# projet_x
Conception architecturale d'une application e-commerce

1. Introduction

Il s'agit ici de concevoir l'architecture d'une application e-commerce permettant aux utilisateurs de consulter des produits, les ajouter à un panier et effectuer des achats en ligne de manière sécurisée.

L'application devra proposer une interface moderne, intuitive et responsive, créer les diagrammes d'architecture, définir la structure des dossiers et fichiers, et rédiger un document de conception permettant la gestion complète d’une boutique en ligne (clients, produits, commandes, paiements).

2. Objectifs

Les principaux objectifs du projet sont :

Appliquer les principes d'architecture full stack
Mise en place d'une architecture 3 tiers
Définir une API REST sécurisée
Séparer clairement les responsabilités (frontend / backend / base de données)
Produire une documentation technique détaillée
Définir les flux de données
Gérer une interface responsive (mobile / tablette / desktop)
Gérer les transactions et paiements sécurisés
Mettre en place une authentification sécurisée
Assurer la gestion des commandes et du stock

3. Besoins Fonctionnels

3.1 Authentification
Création d’un compte client
Connexion sécurisée
Déconnexion sécurisée
Gestion des rôles (Admin / Client)
Protection des routes sensibles

3.2 Gestion des Produits (Admin)
Ajouter un produit (nom, description, prix, stock, image, catégorie)
Modifier un produit
Supprimer un produit
Activer / Désactiver un produit
Gérer les catégories

3.3 Catalogue Produits (Client)
Afficher la liste des produits
Filtrer par catégorie
Rechercher par mot-clé
Voir le détail d’un produit
Affichage des avis clients

3.4 Panier
Ajouter un produit au panier
Modifier la quantité
Supprimer un produit du panier
Calcul automatique du total
Sauvegarde du panier pour utilisateur connecté

3.5 Commandes
Valider une commande
Générer un récapitulatif
Historique des commandes
Suivi du statut (En attente, Payée, Expédiée, Livrée, Annulée)

3.6 Paiement
Intégration d’un système de paiement sécurisé (Stripe ou PayPal)
Confirmation automatique de paiement
Génération de facture

4. Besoins Non-Fonctionnels

L’application devra garantir :

Protection contre les injections SQL
Sécurisation des paiements (HTTPS, chiffrement)
Validation stricte des données
Protection des informations sensibles
Haute disponibilité
Temps de réponse rapide
Optimisation SEO
Bonne organisation du code
Scalabilité du système

5. Contraintes Techniques
Architecture 3 tiers obligatoire
Modèle client/serveur
Communication sécurisée HTTPS
Séparation claire frontend / backend
Base de données relationnelle
Gestion des sessions et tokens
Versioning Git
Déploiement sur serveur cloud
Compatibilité multi-navigateurs

6. Architecture du système

Les couches de l’architecture sont :

Front-end : React (pages : Home, Login, Register, Products, Cart, Checkout, Dashboard Admin), gestion d’état global, appels API
Back-end : Node.js (contrôleurs, services métier, middleware sécurité, gestion erreurs, routes REST)
Base de données : Base relationnelle (MySQL ou PostgreSQL)
Schéma logique

Utilisateur
  |
  v
Front-end (React.js)
  | API REST
  v
Back-end (Node.js)
  |
  v
Base de données (MySQL)

6.1 Choix des technologies

| Couche           | Technologie          |
| ---------------- | -------------------- |
| Frontend         | React.js             |
| Backend          | Node.js (Express.js) |
| Base de données  | MySQL                |
| Authentification | JWT                  |
| Paiement         | Stripe               |
| Communication    | API REST             |
| Versioning       | Git                  |


6.2 Responsabilités de chaque composant
Frontend
Affichage des produits
Gestion du panier
Gestion des interactions utilisateur
Validation côté client
Communication API
Gestion du responsive design
Backend
Logique métier (commandes, paiements, stock)
Authentification et autorisation
Validation des données
Gestion des paiements
Exposition API REST
Logging et gestion des erreurs
Base de données
Stockage utilisateurs
Stockage produits
Stockage commandes
Gestion des transactions
Intégrité référentielle
Indexation des requêtes

7. Modélisation des données

Table : users

| Champ         | Type    | Description        |
| ------------- | ------- | ------------------ |
| id            | INT     | Identifiant unique |
| email         | VARCHAR | Email unique       |
| password_hash | VARCHAR | Mot de passe haché |
| role          | ENUM    | admin / client     |
| created_at    | DATE    | Date création      |

Table : products

| Champ       | Type     | Description         |
| ----------- | -------- | ------------------- |
| id          | INT      | Identifiant         |
| name        | VARCHAR  | Nom du produit      |
| description | TEXT     | Description         |
| price       | DECIMAL  | Prix                |
| stock       | INT      | Quantité disponible |
| image_url   | VARCHAR  | Image               |
| category_id | INT (FK) | Référence catégorie |
| created_at  | DATE     | Date création       |

Table : orders

| Champ        | Type     | Description                                      |
| ------------ | -------- | ------------------------------------------------ |
| id           | INT      | Identifiant                                      |
| user_id      | INT (FK) | Client                                           |
| total_amount | DECIMAL  | Montant total                                    |
| status       | ENUM     | pending / paid / shipped / delivered / cancelled |
| created_at   | DATE     | Date commande                                    |

| Champ        | Type     | Description                                      |
| ------------ | -------- | ------------------------------------------------ |
| id           | INT      | Identifiant                                      |
| user_id      | INT (FK) | Client                                           |
| total_amount | DECIMAL  | Montant total                                    |
| status       | ENUM     | pending / paid / shipped / delivered / cancelled |
| created_at   | DATE     | Date commande                                    |

Table : order_items

| Champ      | Type     | Description          |
| ---------- | -------- | -------------------- |
| id         | INT      | Identifiant          |
| order_id   | INT (FK) | Référence commande   |
| product_id | INT (FK) | Produit              |
| quantity   | INT      | Quantité             |
| price      | DECIMAL  | Prix au moment achat |

8. Endpoints de l’API

| CRUD   | Méthode        | URL                     | Action |
| ------ | -------------- | ----------------------- | ------ |
| POST   | /auth/register | Créer compte            |        |
| POST   | /auth/login    | Connexion               |        |
| GET    | /products      | Liste produits          |        |
| GET    | /products/:id  | Détail produit          |        |
| POST   | /products      | Ajouter produit (admin) |        |
| PUT    | /products/:id  | Modifier produit        |        |
| DELETE | /products/:id  | Supprimer produit       |        |
| POST   | /cart          | Ajouter au panier       |        |
| GET    | /cart          | Voir panier             |        |
| POST   | /orders        | Créer commande          |        |
| GET    | /orders        | Historique commandes    |        |
| POST   | /payment       | Effectuer paiement      |        |

9. Flux des données

L’utilisateur consulte les produits
  |
  v
Ajoute au panier
  |
  v
Front-end envoie requête API
  |
  v
Backend traite logique métier
  |
  v
Base de données mise à jour
  |
  v
Réponse JSON retournée
  |
  v
Interface mise à jour

10. Structure du projet

├── README.md
├── ecommerce-app/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   └── routes/
│   └── frontend/
│       └── src/
│           ├── components/
│           ├── pages/
│           ├── context/
│           └── services/


11. Conclusion

Ce projet permettra de concevoir, développer et maintenir une application e-commerce complète, sécurisée et performante, basée sur une architecture 3 tiers cohérente.
Ce cahier des charges servira de référence tout au long du développement afin de garantir que l’application réponde aux exigences fonctionnelles, techniques et sécuritaires d’un système de vente en ligne moderne.


