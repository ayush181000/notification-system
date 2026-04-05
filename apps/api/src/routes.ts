import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import { createNotificationController } from "./modules/notification/notification.controller";
import {
  createNotificationBodySchema,
  type CreateNotificationBody,
} from "./modules/notification/notification.schema";
import { successResponseHelper } from "@utils";
import { createTenantController } from "./modules/tenant/tenant.controller";
import { validateBody } from "./modules/middleware/validator";

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/health", async (_request, reply) => {
    return successResponseHelper(reply);
  });

  app.post<{ Body: CreateNotificationBody }>(
    "/notification",
    { preValidation: validateBody(createNotificationBodySchema) },
    createNotificationController,
  );

  // app.post("/tenant", createTenantController);
};

export default routes;
