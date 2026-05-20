import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const requireAuth = (request, response, next) => {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return response.status(401).json({ message: "Authentification requise" });
  }

  try {
    request.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return response.status(401).json({ message: "Token invalide" });
  }
};

export const requireRole = (role) => (request, response, next) => {
  if (request.user?.role !== role) {
    return response.status(403).json({ message: "Acces refuse" });
  }
  return next();
};
