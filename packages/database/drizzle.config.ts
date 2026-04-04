import type { Config } from "drizzle-kit";
import { config } from "@config";

export default {
  schema: "./src/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL!,
  },
} satisfies Config;
