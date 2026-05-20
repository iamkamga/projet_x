import {
  create,
  findAll,
  findById,
  remove,
  update,
} from "../models/product.model.js";

export const listProducts = async (_request, response, next) => {
  try {
    response.json(await findAll());
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (request, response, next) => {
  try {
    const product = await findById(request.params.id);
    if (!product) return response.status(404).json({ message: "Produit introuvable" });
    return response.json(product);
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (request, response, next) => {
  try {
    response.status(201).json(await create(request.body));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (request, response, next) => {
  try {
    response.json(await update(request.params.id, request.body));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (request, response, next) => {
  try {
    await remove(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
