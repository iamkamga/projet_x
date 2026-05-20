import { pool } from "../config/database.js";

export const createUser = async ({ email, passwordHash, role }) => {
  const [result] = await pool.execute(
    "INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, NOW())",
    [email, passwordHash, role],
  );
  return { id: result.insertId, email, role };
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
};
