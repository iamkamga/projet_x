window.TrustUi = (() => {
  const euros = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  const formatPrice = (value) => euros.format(value);
  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const productCard = (product) => {
    const safe = {
      id: Number(product.id),
      name: escapeHtml(product.name),
      category: escapeHtml(product.category),
      image: escapeHtml(product.image),
      description: escapeHtml(product.description),
      price: formatPrice(product.price),
      rating: escapeHtml(product.rating),
      stock: Number(product.stock),
    };

    return `
    <article class="product-card">
      <img class="product-image" src="${safe.image}" alt="${safe.name}" loading="lazy">
      <div class="product-body">
        <div class="product-title-line">
          <h3>${safe.name}</h3>
          <span class="price">${safe.price}</span>
        </div>
        <p class="product-meta">${safe.category}</p>
        <p class="product-description">${safe.description}</p>
        <div class="product-footer">
          <span class="rating">Avis ${safe.rating}</span>
          <span class="stock-pill ${safe.stock < 6 ? "is-low" : ""}">${safe.stock} en stock</span>
        </div>
        <button class="primary-button" type="button" data-add-cart="${safe.id}">Ajouter au panier</button>
      </div>
    </article>
  `;
  };

  const cartItem = (item) => {
    const safe = {
      id: Number(item.id),
      name: escapeHtml(item.name),
      image: escapeHtml(item.image),
      unitPrice: formatPrice(item.price),
      totalPrice: formatPrice(item.price * item.quantity),
      quantity: Number(item.quantity),
    };

    return `
    <article class="cart-item">
      <img src="${safe.image}" alt="${safe.name}">
      <div>
        <div class="cart-item-top">
          <strong>${safe.name}</strong>
          <span class="price">${safe.totalPrice}</span>
        </div>
        <p class="product-meta">${safe.unitPrice} / piece</p>
        <div class="quantity-control" aria-label="Quantite ${safe.name}">
          <button type="button" data-cart-dec="${safe.id}" aria-label="Diminuer">-</button>
          <span>${safe.quantity}</span>
          <button type="button" data-cart-inc="${safe.id}" aria-label="Augmenter">+</button>
        </div>
      </div>
    </article>
  `;
  };

  const orderCard = (order) => `
    <article class="order-card">
      <div class="order-top">
        <h3>${escapeHtml(order.id)}</h3>
        <span class="status-pill">${escapeHtml(order.status)}</span>
      </div>
      <p>${escapeHtml(order.items)}</p>
      <p>${escapeHtml(order.createdAt)} - ${formatPrice(order.total)}</p>
    </article>
  `;

  const adminRow = (product) => `
    <tr>
      <td><strong>${escapeHtml(product.name)}</strong></td>
      <td>${escapeHtml(product.category)}</td>
      <td>${formatPrice(product.price)}</td>
      <td>${Number(product.stock)}</td>
      <td>${product.active ? "Actif" : "Desactive"}</td>
      <td>
        <div class="table-actions">
          <button class="mini-button" type="button" data-edit-product="${Number(product.id)}">Modifier</button>
          <button class="mini-button" type="button" data-toggle-product="${Number(product.id)}">
            ${product.active ? "Desactiver" : "Activer"}
          </button>
          <button class="mini-button danger" type="button" data-delete-product="${Number(product.id)}">Supprimer</button>
        </div>
      </td>
    </tr>
  `;

  const showToast = (message) => {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  };

  return {
    formatPrice,
    productCard,
    cartItem,
    orderCard,
    adminRow,
    showToast,
  };
})();
