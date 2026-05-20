import { Router } from "express";
import { addToCart, getCart } from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getCart);
router.post("/", requireAuth, addToCart);

export default router;
