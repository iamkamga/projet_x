import { Router } from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createPaymentIntent);

export default router;
