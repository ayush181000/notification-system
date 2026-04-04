import Fastify from "fastify";
import { config } from "@config";
import { logger } from "@logger";
import { asyncLocalStorage } from "@context";
import routes from "./routes";
import { generateUUIDV7 } from "@utils";

async function main() {
  const app = Fastify({
    loggerInstance: logger,
    genReqId: () => generateUUIDV7(),
  });

  app.addHook("onRequest", async (req, reply) => {
    const childLogger = req.log.child({
      module: "request", // base context
    });

    asyncLocalStorage.run({ logger: childLogger }, () => {});
  });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  await app.register(routes);

  await app.listen({ port: config.PORT });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
