import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "../config/env.js";
import { errorHandler } from "../middleware/errorHandler.js";
import authRoutes from "../routes/auth.routes.js";
import cartRoutes from "../routes/cart.routes.js";
import orderRoutes from "../routes/order.routes.js";
import paymentRoutes from "../routes/payment.routes.js";
import productRoutes from "../routes/product.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok", app: "trust-api" });
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`trust API listening on http://localhost:${env.port}`);
});
