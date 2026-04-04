import Fastify from "fastify";
import { config } from "@config";
import { logger } from "@logger";

const app = Fastify({
  logger, // plug pino directly
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.listen({ port: config.PORT });
