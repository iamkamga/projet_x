export const listOrders = async (_request, response) => {
  response.json([]);
};

export const createOrder = async (request, response) => {
  response.status(201).json({
    id: Date.now(),
    status: "pending",
    ...request.body,
  });
};
