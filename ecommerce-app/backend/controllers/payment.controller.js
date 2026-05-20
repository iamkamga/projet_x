import Stripe from "stripe";
import { env } from "../config/env.js";

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

export const createPaymentIntent = async (request, response) => {
  const { amount } = request.body;

  if (!stripe) {
    return response.json({
      provider: "stripe",
      mode: "demo",
      clientSecret: "demo_client_secret",
      amount,
    });
  }

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
  });

  return response.json({ clientSecret: intent.client_secret });
};
