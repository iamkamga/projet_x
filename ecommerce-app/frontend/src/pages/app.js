const api = window.TrustApi;
const store = window.TrustStore;
const ui = window.TrustUi;

const els = {
  productGrid: document.querySelector("#productGrid"),
  categoryFilter: document.querySelector("#categoryFilter"),
  searchInput: document.querySelector("#searchInput"),
  cartButton: document.querySelector("#cartButton"),
  cartDrawer: document.querySelector("#cartDrawer"),
  closeCartButton: document.querySelector("#closeCartButton"),
  cartItems: document.querySelector("#cartItems"),
  cartCount: document.querySelector("#cartCount"),
  cartSubtotal: document.querySelector("#cartSubtotal"),
  shippingTotal: document.querySelector("#shippingTotal"),
  cartTotal: document.querySelector("#cartTotal"),
  checkoutButton: document.querySelector("#checkoutButton"),
  orderList: document.querySelector("#orderList"),
  seedOrderButton: document.querySelector("#seedOrderButton"),
  adminTable: document.querySelector("#adminTable"),
  productForm: document.querySelector("#productForm"),
  resetProductButton: document.querySelector("#resetProductButton"),
  accountButton: document.querySelector("#accountButton"),
  accountDialog: document.querySelector("#accountDialog"),
  loginButton: document.querySelector("#loginButton"),
};

const visibleProducts = (state) => {
  const query = state.filter.query.trim().toLowerCase();
  return state.products.filter((product) => {
    const matchesCategory =
      state.filter.category === "Toutes" || product.category === state.filter.category;
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    return product.active && matchesCategory && matchesQuery;
  });
};

const renderCategories = (state) => {
  const categories = ["Toutes", ...new Set(state.products.map((product) => product.category))];
  const current = els.categoryFilter.value || state.filter.category;
  els.categoryFilter.innerHTML = categories
    .map((category) => `<option ${category === current ? "selected" : ""}>${category}</option>`)
    .join("");
};

const renderProducts = (state) => {
  const products = visibleProducts(state);
  els.productGrid.innerHTML = products.length
    ? products.map(ui.productCard).join("")
    : '<p class="cart-empty">Aucun produit ne correspond a cette recherche.</p>';
};

const renderCart = (state) => {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totals = store.totals();
  els.cartCount.textContent = count;
  els.cartItems.innerHTML = state.cart.length
    ? state.cart.map(ui.cartItem).join("")
    : '<p class="cart-empty">Votre panier est vide.</p>';
  els.cartSubtotal.textContent = ui.formatPrice(totals.subtotal);
  els.shippingTotal.textContent = ui.formatPrice(totals.shipping);
  els.cartTotal.textContent = ui.formatPrice(totals.total);
  els.checkoutButton.disabled = state.cart.length === 0;
};

const renderOrders = (state) => {
  els.orderList.innerHTML = state.orders.length
    ? state.orders.map(ui.orderCard).join("")
    : '<p class="cart-empty">Aucune commande pour le moment.</p>';
};

const renderAdmin = (state) => {
  els.adminTable.innerHTML = state.products.map(ui.adminRow).join("");
};

const render = (state) => {
  renderCategories(state);
  renderProducts(state);
  renderCart(state);
  renderOrders(state);
  renderAdmin(state);
};

const refreshProducts = async () => store.setProducts(await api.listProducts());
const refreshOrders = async () => store.setOrders(await api.listOrders());

const resetProductForm = () => {
  els.productForm.reset();
  document.querySelector("#productId").value = "";
  document.querySelector("#productImage").value =
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=900&q=80";
};

document.addEventListener("click", async (event) => {
  const addButton = event.target.closest("[data-add-cart]");
  const incButton = event.target.closest("[data-cart-inc]");
  const decButton = event.target.closest("[data-cart-dec]");
  const editButton = event.target.closest("[data-edit-product]");
  const toggleButton = event.target.closest("[data-toggle-product]");
  const deleteButton = event.target.closest("[data-delete-product]");

  if (addButton) {
    const product = store.state.products.find((item) => item.id === Number(addButton.dataset.addCart));
    store.addToCart(product);
    ui.showToast(`${product.name} ajoute au panier`);
  }

  if (incButton) store.updateQuantity(Number(incButton.dataset.cartInc), 1);
  if (decButton) store.updateQuantity(Number(decButton.dataset.cartDec), -1);

  if (editButton) {
    const product = store.state.products.find((item) => item.id === Number(editButton.dataset.editProduct));
    document.querySelector("#productId").value = product.id;
    document.querySelector("#productName").value = product.name;
    document.querySelector("#productCategory").value = product.category;
    document.querySelector("#productPrice").value = product.price;
    document.querySelector("#productStock").value = product.stock;
    document.querySelector("#productImage").value = product.image;
    document.querySelector("#productDescription").value = product.description;
    document.querySelector("#admin").scrollIntoView({ behavior: "smooth" });
  }

  if (toggleButton) {
    await api.toggleProduct(Number(toggleButton.dataset.toggleProduct));
    await refreshProducts();
    ui.showToast("Etat du produit mis a jour");
  }

  if (deleteButton) {
    await api.deleteProduct(Number(deleteButton.dataset.deleteProduct));
    await refreshProducts();
    ui.showToast("Produit supprime");
  }
});

els.searchInput.addEventListener("input", (event) => {
  store.setFilter({ query: event.target.value });
});

els.categoryFilter.addEventListener("change", (event) => {
  store.setFilter({ category: event.target.value });
});

els.cartButton.addEventListener("click", () => {
  els.cartDrawer.classList.add("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
});

els.closeCartButton.addEventListener("click", () => {
  els.cartDrawer.classList.remove("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
});

els.checkoutButton.addEventListener("click", async () => {
  const totals = store.totals();
  await api.createOrder(store.state.cart, totals.total);
  store.clearCart();
  await refreshOrders();
  els.cartDrawer.classList.remove("is-open");
  ui.showToast("Commande creee, paiement simule avec succes");
});

els.seedOrderButton.addEventListener("click", async () => {
  await api.createOrder([{ name: "Commande demo", quantity: 1 }], 149.9);
  await refreshOrders();
});

els.productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = Number(document.querySelector("#productId").value);
  await api.saveProduct({
    id: id || undefined,
    name: document.querySelector("#productName").value.trim(),
    category: document.querySelector("#productCategory").value.trim(),
    price: Number(document.querySelector("#productPrice").value),
    stock: Number(document.querySelector("#productStock").value),
    image: document.querySelector("#productImage").value.trim(),
    description: document.querySelector("#productDescription").value.trim(),
  });
  resetProductForm();
  await refreshProducts();
  ui.showToast("Produit enregistre");
});

els.resetProductButton.addEventListener("click", resetProductForm);

els.accountButton.addEventListener("click", () => {
  els.accountDialog.showModal();
});

els.loginButton.addEventListener("click", async () => {
  const email = document.querySelector("#emailInput").value;
  const response = await api.login({ email, password: document.querySelector("#passwordInput").value });
  store.setUser(response.user);
  els.accountDialog.close();
  ui.showToast(`Connecte: ${response.user.email}`);
});

store.subscribe(render);
resetProductForm();
refreshProducts();
refreshOrders();
