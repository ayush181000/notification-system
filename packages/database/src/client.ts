import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "@config";

const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
  max: 20, // important for scaling
});

export const db = drizzle(pool);
export { pool };
