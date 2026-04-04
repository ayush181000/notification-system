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

// ✅ Safe subset of supported signatures
type QueryArgs =
  | [queryText: string, values?: any[]]
  | [config: { text: string; values?: any[] }];

const tracedQuery = async (...args: QueryArgs): Promise<QueryResult<any>> => {
  const start = performance.now();

  let queryText = "unknown";
  let params: unknown = undefined;

  if (typeof args[0] === "string") {
    queryText = args[0];
    params = args[1];
  } else {
    queryText = args[0].text ?? "unknown";
    params = args[0].values;
  }

  const baseLogger = getLogger() || rootLogger;
  const dbLogger = baseLogger.child({ module: "db" });

  try {
    // 🔥 NO SPREAD → no TS error
    let result: QueryResult<any>;

    if (typeof args[0] === "string") {
      result = await originalQuery(args[0], args[1]);
    } else {
      result = await originalQuery(args[0]);
    }

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

    if (duration > 100) {
      dbLogger.warn(
        {
          query: queryText,
          duration: `${duration.toFixed(2)}ms`,
        },
        "Slow query detected",
      );
    }

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

// ✅ Final assignment
pool.query = tracedQuery as unknown as Pool["query"];

export const db = drizzle(pool);
export { pool };
