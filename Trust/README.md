[![Déployer avec Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaleor%2Fnextjs-commerce&env=COMPANY_NAME,TWITTER_CREATOR,TWITTER_SITE,SITE_NAME,SALEOR_INSTANCE_URL&project-name=saleor-nextjs-commerce&repository-name=saleor-nextjs-commerce&demo-title=Saleor%20Next.js%20Commerce&demo-description=Saleor%20%2B%20Next.js%2013%20%2B%20App%20Router-ready%20e-commerce%20template&demo-url=https%3A%2F%2Fsaleor-commerce.vercel.app%2F&demo-image=https%3A%2F%2Fsaleor-commerce.vercel.app%2Fscreenshot.png)

> [!IMPORTANT]
> Pour un usage en production, nous recommandons d'utiliser notre [Next.js Starter](https://github.com/saleor/storefront) officiel. Ce dépôt peut être utile pour comparer différentes plateformes e-commerce qui utilisent également [Next.js Commerce](https://nextjs.org/commerce).

---

# 🛒 Next.js Commerce

Un template e-commerce **Next.js 13** prêt pour l'App Router, avec les fonctionnalités suivantes :

- ⚡ **Next.js App Router**
- 🔍 **Optimisé pour le SEO** grâce aux Métadonnées Next.js
- 🧩 **React Server Components (RSC)** et Suspense
- 🔄 **Server Actions** pour les mutations
- 🌐 **Edge Runtime**
- 🗄️ **Nouveaux paradigmes de récupération et de mise en cache**
- 🖼️ **Images OG dynamiques**
- 🎨 **Style avec Tailwind CSS**
- 💳 **Paiement et checkout avec Saleor**
- 🌙 **Mode clair/sombre automatique** basé sur les paramètres système

---

<h3 id="v1-note"></h3>

> 📌 **Note :** Vous cherchez Next.js Commerce v1 ? Consultez le [code](https://github.com/vercel/commerce/tree/v1), la [démo](https://commerce-v1.vercel.store) et les [notes de version](https://github.com/vercel/commerce/releases/tag/v1).

---

## 🤝 Fournisseurs

Vercel est heureux de collaborer avec n'importe quel fournisseur e-commerce pour les aider à proposer un template similaire. Les fournisseurs alternatifs peuvent forker ce dépôt et remplacer les fichiers `lib/…` par leur propre implémentation, en laissant le reste du template inchangé.

---

## 🚀 Démarrage local

Vous devrez utiliser les variables d'environnement [définies dans `.env.example`](.env.example) pour exécuter Next.js Commerce. Il est recommandé d'utiliser les [Variables d'environnement Vercel](https://vercel.com/docs/concepts/projects/environment-variables), mais un simple fichier `.env` suffit.

> [!WARNING]
> Ne commitez jamais votre fichier `.env` — il exposerait des secrets permettant à d'autres personnes de contrôler votre boutique Saleor.

**Étapes de configuration :**

1. Installer Vercel CLI : `npm i -g vercel`
2. Lier l'instance locale avec vos comptes Vercel et GitHub (crée le dossier `.vercel`) : `vercel link`
3. Télécharger vos variables d'environnement : `vercel env pull`

```bash
pnpm install
pnpm dev
```

Votre application devrait maintenant être accessible sur [localhost:3000](http://localhost:3000/).

---

## ⚙️ Configuration de votre boutique Saleor

Next.js Commerce nécessite un [compte Saleor](https://saleor.io/).

### 🔗 Ajouter l'URL Saleor en variable d'environnement

Créez une variable d'environnement `SALEOR_INSTANCE_URL` et utilisez l'URL de votre API GraphQL Saleor comme valeur (ex. : `https://yourinstance.saleor.cloud/graphql/`).

### 🔌 Accéder à l'API Storefront Saleor

Next.js Commerce utilise [l'API Storefront de Saleor](https://docs.saleor.io/docs/3.x/api-storefront/api-reference) pour créer des expériences client uniques. L'API offre une gamme complète d'options e-commerce permettant de gérer les produits, collections, menus, pages, panier, checkout, et bien plus.

### 🔁 Configurer les webhooks pour la régénération statique incrémentale à la demande (ISR)

En utilisant [les webhooks Saleor](https://docs.saleor.io/docs/3.x/developer/extending/webhooks/overview) et en écoutant certains [événements webhook Saleor](https://docs.saleor.io/docs/3.x/api-reference/webhooks/enums/webhook-event-type-async-enum), on peut utiliser la [revalidation à la demande de Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#using-on-demand-revalidation) pour maintenir les données indéfiniment en cache jusqu'à ce que certains événements se produisent dans la boutique Saleor.

Next.js est préconfiguré pour écouter les événements webhook Saleor suivants et revalider automatiquement les données :

- `CategoryCreated`
- `CategoryDeleted`
- `CategoryUpdated`
- `CollectionUpdated`
- `CollectionDeleted`
- `CollectionCreated`
- `ProductCreated`
- `ProductDeleted`
- `ProductUpdated`
- `ProductVariantCreated`
- `ProductVariantDeleted`
- `ProductVariantUpdated`

<details>
<summary>📋 Voir le guide de configuration détaillé</summary>

#### ⚙️ Configurer les webhooks Saleor

1. Accédez à **Configuration → Webhooks** : `https://[votre-sous-domaine].saleor.cloud/dashboard/custom-apps/add`
2. Nommez votre application `Next.js Commerce`, ajoutez les permissions `MANAGE_ORDERS`, `MANAGE_DISCOUNTS` et `MANAGE_PRODUCTS`, puis sauvegardez.
3. Cliquez sur le bouton **"Créer un webhook"**.
4. Nommez votre webhook et ajoutez votre URL Next.js Commerce avec `/api/revalidate`.
5. **Note :** Vous n'avez pas besoin d'ajouter de "secrets" à l'URL. Saleor utilise le chiffrement par clé publique pour vérifier que le webhook provient bien de votre boutique.
6. Copiez-collez [la requête d'abonnement](https://github.com/saleor/nextjs-commerce/blob/main/lib/saleor/webhookSubscription.graphql) en bas de la page et sauvegardez.

#### 🧪 Tester les webhooks en développement local

La méthode la plus simple pour tester les webhooks en développement local est d'utiliser [ngrok](https://ngrok.com/).

1. [Installez et configurez ngrok](https://ngrok.com/download) (vous devrez créer un compte).
2. Lancez votre application localement : `npm run dev`
3. Dans un terminal séparé, exécutez : `ngrok http 3000`
4. Utilisez l'URL générée par ngrok et mettez à jour vos URLs de webhook dans Saleor.

</details>

---

## 🗂️ Utiliser Saleor comme CMS

Next.js Commerce est entièrement propulsé par Saleor dans une approche véritablement headless et data-driven.

### 📦 Produits

[`https://yourinstance.saleor.cloud/dashboard/products/`](https://yourinstance.saleor.cloud/dashboard/products/)

- Seuls les produits `Actifs` sont affichés. Les produits en `Brouillon` ne seront pas visibles tant qu'ils ne sont pas marqués comme `Actifs`.
- Les options de produit et leurs combinaisons sont gérées par les options et variantes Saleor. Lors de la sélection d'options sur la page produit, les autres options et combinaisons de variantes sont validées et vérifiées visuellement pour leur disponibilité, comme le fait Amazon.
- Les produits actifs mais **en rupture de stock** sont toujours affichés sur le site, mais le bouton d'ajout au panier est désactivé.

### 🗃️ Collections

[`https://yourinstance.saleor.cloud/dashboard/collections/`](https://yourinstance.saleor.cloud/dashboard/collections/)

Créez les collections que vous souhaitez et configurez-les librement. Toutes les collections disponibles apparaîtront sur la page de recherche comme filtres à gauche, avec une exception :

Les collections dont le nom commence par le mot `"hidden"` n'apparaîtront pas sur le frontend headless. Le thème Next.js Commerce est préconfiguré pour rechercher deux collections cachées. Les collections ont été choisies plutôt que des tags afin de pouvoir contrôler l'ordre des produits (les collections permettent un tri manuel).

Créez les collections suivantes :

- `Featured` — Les produits de cette collection sont affichés dans les trois blocs mis en avant sur la page d'accueil.
- `All Products` — Les produits de cette collection sont affichés dans la section carrousel à défilement automatique sur la page d'accueil.

### 📄 Pages

[`https://yourinstance.saleor.cloud/dashboard/pages/`](https://yourinstance.saleor.cloud/dashboard/pages/)

Next.js Commerce contient une route dynamique `[page]`. Elle utilisera la valeur pour rechercher une page correspondante dans Saleor. Si une page est trouvée, son contenu enrichi sera affiché avec la typographie Tailwind. Si aucune page n'est trouvée, une page 404 est affichée.

### 🧭 Menus de navigation

[`https://yourinstance.saleor.cloud/dashboard/navigation/`](https://yourinstance.saleor.cloud/dashboard/navigation/)

La navigation en en-tête et en pied de page de Next.js Commerce est préconfigurée pour être contrôlée par les menus de navigation Saleor. Vous avez un contrôle total sur les liens : collections, pages, liens externes, et plus encore.

Créez les menus de navigation suivants :

- `navbar` — Éléments de menu affichés dans l'en-tête du frontend headless.
- `footer` — Éléments de menu affichés dans le pied de page du frontend headless.

### 🔎 SEO

Les produits, collections, pages, etc. de Saleor vous permettent de créer des titres et descriptions SEO personnalisés. Next.js Commerce est préconfiguré pour afficher ces valeurs personnalisées, mais propose également des valeurs par défaut sensées si elles ne sont pas renseignées.
