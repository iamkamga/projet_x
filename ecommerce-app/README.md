# trust

Application e-commerce construite a partir du cahier des charges du projet.

## Structure

- `frontend/` : interface boutique responsive utilisable sans build.
- `backend/` : squelette API REST Express avec JWT, routes protegees, MySQL et Stripe.

## Lancer le frontend

Ouvrir `frontend/index.html` dans le navigateur ou lancer un serveur statique :

```bash
python3 -m http.server 8080 --directory frontend
```

Puis aller sur `http://localhost:8080`.

## Fonctionnalites disponibles

- Catalogue produits avec recherche et filtre par categorie.
- Panier avec quantites, sous-total, livraison et total.
- Checkout simule avec creation de commande.
- Historique des commandes.
- Connexion demo.
- Dashboard admin pour ajouter, modifier, desactiver et supprimer un produit.
- Persistance locale via `localStorage`.

## Backend cible

Le backend suit les endpoints du README principal :

- `POST /auth/register`
- `POST /auth/login`
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /cart`
- `POST /cart`
- `GET /orders`
- `POST /orders`
- `POST /payment`

Node.js n'est pas installe dans cet environnement, donc le frontend est la partie directement executable ici.
