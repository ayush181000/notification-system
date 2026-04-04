import Fastify from "fastify";
import { config } from "@config";
import { logger } from "@logger";
import routes from "./routes";

const app = Fastify({
  logger, // plug pino directly
});

app.get("/health", async () => {
  return { status: "ok" };
});

routes(app, {});

app.listen({ port: config.PORT });
