import { pool } from "../config/database.js";

export const findAll = async () => {
  const [rows] = await pool.execute("SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
};

export const create = async (product) => {
  const [result] = await pool.execute(
    `INSERT INTO products
      (name, description, price, stock, image_url, category_id, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, NOW())`,
    [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.image_url,
      product.category_id,
    ],
  );
  return findById(result.insertId);
};

export const update = async (id, product) => {
  await pool.execute(
    `UPDATE products
     SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category_id = ?, active = ?
     WHERE id = ?`,
    [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.image_url,
      product.category_id,
      product.active,
      id,
    ],
  );
  return findById(id);
};

export const remove = async (id) => {
  await pool.execute("DELETE FROM products WHERE id = ?", [id]);
};
