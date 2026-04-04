import { drizzle } from "drizzle-orm/node-postgres";
import pg, { Pool, type QueryResult } from "pg";
import { config } from "@config";
import { logger as rootLogger } from "@logger";
import { getLogger } from "@context";

const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
  max: 20,
});

const originalQuery = pool.query.bind(pool);

type QueryArgs =
  | [queryText: string, values?: any[]]
  | [config: { text: string; values?: any[] }];

const tracedQuery = async (...args: any[]) => {
  const start = performance.now();

  let queryText = "unknown";
  let params: unknown = undefined;

  if (typeof args[0] === "string") {
    queryText = args[0];
    params = args[1];
  } else if (args[0] && typeof args[0] === "object") {
    queryText = args[0].text ?? "unknown";
    params = args[0].values;
  }

  const baseLogger = getLogger() || rootLogger;
  const dbLogger = baseLogger.child({ module: "db" });

  try {
    const result = await (originalQuery as any)(...args);

    const duration = performance.now() - start;

    dbLogger.info(
      {
        query: queryText,
        params,
        duration: `${duration.toFixed(2)}ms`,
        rowCount: result.rowCount,
      },
      "SQL Query executed",
    );

    return result;
  } catch (error) {
    const duration = performance.now() - start;

    dbLogger.error(
      {
        query: queryText,
        params,
        duration: `${duration.toFixed(2)}ms`,
        error,
      },
      "SQL Query failed",
    );

    throw error;
  }
};

pool.query = tracedQuery as unknown as Pool["query"];

export const db = drizzle(pool);
export { pool };
