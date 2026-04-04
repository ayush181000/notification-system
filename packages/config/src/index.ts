import * as dotenv from "dotenv";
import { z } from "zod";
import { join } from "path";

const envPath = join(
  __dirname,
  "..",
  process.env.NODE_ENV === "test" ? ".env.test" : ".env",
);
dotenv.config({
  path: envPath,
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "staging", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),

  // future-proofing
  KAFKA_BROKERS: z.string().optional(),
  REDIS_URL: z.string().optional(),
  DATABASE_URL: z.string(),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables", parsed.error.format());
  process.exit(1);
}

export const config = {
  ...parsed.data,
  PORT: Number(parsed.data.PORT),
};
