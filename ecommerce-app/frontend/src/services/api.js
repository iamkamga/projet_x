window.TrustApi = (() => {
  const PRODUCT_KEY = "trust.products";
  const ORDER_KEY = "trust.orders";

  const initialProducts = [
    {
      id: 1,
      name: "Casque Nova",
      category: "Audio",
      price: 129.9,
      stock: 18,
      active: true,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      description: "Reduction de bruit, autonomie longue duree et confort premium.",
    },
    {
      id: 2,
      name: "Sac Atlas",
      category: "Voyage",
      price: 84.5,
      stock: 7,
      active: true,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
      description: "Compartiments organises, toile resistant a l'eau et poche laptop.",
    },
    {
      id: 3,
      name: "Montre Pulse",
      category: "Tech",
      price: 199,
      stock: 11,
      active: true,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      description: "Suivi sante, paiement sans contact et design minimal.",
    },
    {
      id: 4,
      name: "Lampe Aura",
      category: "Maison",
      price: 59.99,
      stock: 26,
      active: true,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      description: "Eclairage chaud reglable pour bureau, chambre ou salon.",
    },
    {
      id: 5,
      name: "Sneakers Terra",
      category: "Mode",
      price: 112,
      stock: 4,
      active: true,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      description: "Semelle amortissante et matieres respirantes pour le quotidien.",
    },
    {
      id: 6,
      name: "Kit Espresso",
      category: "Cuisine",
      price: 76,
      stock: 14,
      active: true,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      description: "Moulin manuel, tasse double paroi et doseur inox.",
    },
  ];

  const read = (key, fallback) => {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(stored);
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  };

  const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 120));

  const listProducts = () => delay(read(PRODUCT_KEY, initialProducts));

  const saveProduct = async (payload) => {
    const products = await listProducts();
    if (payload.id) {
      return delay(
        write(
          PRODUCT_KEY,
          products.map((product) => (product.id === payload.id ? { ...product, ...payload } : product)),
        ),
      );
    }

    const nextProduct = {
      ...payload,
      id: Date.now(),
      active: true,
      rating: 4.7,
    };
    return delay(write(PRODUCT_KEY, [nextProduct, ...products]));
  };

  const deleteProduct = async (id) => {
    const products = await listProducts();
    return delay(write(PRODUCT_KEY, products.filter((product) => product.id !== id)));
  };

  const toggleProduct = async (id) => {
    const products = await listProducts();
    return delay(
      write(
        PRODUCT_KEY,
        products.map((product) =>
          product.id === id ? { ...product, active: !product.active } : product,
        ),
      ),
    );
  };

  const listOrders = () =>
    delay(
      read(ORDER_KEY, [
        {
          id: "TR-1024",
          total: 328.9,
          status: "Payee",
          items: "Casque Nova, Montre Pulse",
          createdAt: "2026-05-12",
        },
      ]),
    );

  const createOrder = async (cartItems, total) => {
    const orders = await listOrders();
    const order = {
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      total,
      status: "En attente",
      items: cartItems.map((item) => `${item.name} x${item.quantity}`).join(", "),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    return delay(write(ORDER_KEY, [order, ...orders]));
  };

  const login = ({ email }) =>
    delay({
      token: "demo.jwt.token",
      user: {
        email,
        role: email.includes("admin") ? "admin" : "client",
      },
    });

  return {
    listProducts,
    saveProduct,
    deleteProduct,
    toggleProduct,
    listOrders,
    createOrder,
    login,
  };
})();
