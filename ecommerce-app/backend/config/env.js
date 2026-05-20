import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "local-dev-secret",
  databaseUrl: process.env.DATABASE_URL || "mysql://trust_user:trust_password@localhost:3306/trust",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
};
