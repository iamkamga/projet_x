import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { createUser, findUserByEmail } from "../models/user.model.js";

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: "2h" });

export const register = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password || password.length < 8) {
      return response.status(422).json({ message: "Email et mot de passe valide requis" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ email, passwordHash, role: "client" });
    response.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const user = await findUserByEmail(email);
    const valid = user ? await bcrypt.compare(password, user.password_hash) : false;

    if (!valid) {
      return response.status(401).json({ message: "Identifiants invalides" });
    }

    response.json({ user: { id: user.id, email: user.email, role: user.role }, token: signToken(user) });
  } catch (error) {
    next(error);
  }
};
