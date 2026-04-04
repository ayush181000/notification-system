import Fastify from "fastify";
import { config } from "@config";
import { logger } from "@logger";
import { asyncLocalStorage } from "@context";
import routes from "./routes";
import { generateUUIDV7 } from "@utils";
import { globalErrorHandler } from "@errors";

async function main() {
  const app = Fastify({
    loggerInstance: logger,
    genReqId: () => generateUUIDV7(),
  });

  app.addHook("onRequest", async (request) => {
    const childLogger = request.log.child({ module: "request" });
    asyncLocalStorage.enterWith({ logger: childLogger });
  });

  await app.register(routes);

  app.setErrorHandler(globalErrorHandler);

  await app.listen({ port: config.PORT });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
