export const getCart = async (_request, response) => {
  response.json({ items: [] });
};

export const addToCart = async (request, response) => {
  response.status(201).json({
    message: "Produit ajoute au panier",
    item: request.body,
  });
};
