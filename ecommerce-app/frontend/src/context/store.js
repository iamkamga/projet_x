window.TrustStore = (() => {
  const CART_KEY = "trust.cart";
  const USER_KEY = "trust.user";
  const listeners = new Set();

  const state = {
    products: [],
    orders: [],
    cart: JSON.parse(localStorage.getItem(CART_KEY) || "[]"),
    user: JSON.parse(localStorage.getItem(USER_KEY) || "null"),
    filter: {
      query: "",
      category: "Toutes",
    },
  };

  const emit = () => listeners.forEach((listener) => listener(state));
  const persistCart = () => localStorage.setItem(CART_KEY, JSON.stringify(state.cart));

  const subscribe = (listener) => {
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
  };

  const setProducts = (products) => {
    state.products = products;
    emit();
  };

  const setOrders = (orders) => {
    state.orders = orders;
    emit();
  };

  const setFilter = (patch) => {
    state.filter = { ...state.filter, ...patch };
    emit();
  };

  const addToCart = (product) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, product.stock);
    } else {
      state.cart.push({ ...product, quantity: 1 });
    }
    persistCart();
    emit();
  };

  const updateQuantity = (id, delta) => {
    state.cart = state.cart
      .map((item) => {
        if (item.id !== id) return item;
        return { ...item, quantity: Math.max(0, Math.min(item.quantity + delta, item.stock)) };
      })
      .filter((item) => item.quantity > 0);
    persistCart();
    emit();
  };

  const clearCart = () => {
    state.cart = [];
    persistCart();
    emit();
  };

  const setUser = (user) => {
    state.user = user;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emit();
  };

  const totals = () => {
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 && subtotal < 120 ? 6.9 : 0;
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  };

  return {
    state,
    subscribe,
    setProducts,
    setOrders,
    setFilter,
    addToCart,
    updateQuantity,
    clearCart,
    setUser,
    totals,
  };
})();
