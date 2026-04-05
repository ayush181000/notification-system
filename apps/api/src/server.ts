import Fastify from "fastify";
import { config } from "@config";
import { logger } from "@logger";
import { asyncLocalStorage } from "@context";
import routes from "./routes";
import { generateUUIDV7 } from "@utils";
import { globalErrorHandler } from "@errors";
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

async function main() {
  const app = Fastify({
    loggerInstance: logger,
    genReqId: () => generateUUIDV7(),
  });

  // Attach Zod to Fastify
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Enable type inference across app
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Request-scoped logger (ALS)
  server.addHook("onRequest", async (request) => {
    const childLogger = request.log.child({ module: "request" });
    asyncLocalStorage.enterWith({ logger: childLogger });
  });

  // Register routes (use `server`, not `app`)
  await server.register(routes);

  // 🔥 Global error handler
  server.setErrorHandler(globalErrorHandler);

  await server.listen({ port: config.PORT });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
