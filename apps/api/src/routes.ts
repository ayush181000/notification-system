import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import NotificationController from "./modules/notification/notification.controller";
import {
  createNotificationBodySchema,
  type CreateNotificationBody,
} from "./modules/notification/notification.schema";
import { successResponseHelper } from "@utils";
import TenantController from "./modules/tenant/tenant.controller";
import { validateBody } from "./modules/middleware/validator";
import {
  createTenantSchema,
  type CreateTenantBody,
} from "./modules/tenant/tenant.schema";

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/health", async (_request, reply) => {
    return successResponseHelper(reply);
  });

  app.post<{ Body: CreateNotificationBody }>(
    "/notification",
    { preValidation: validateBody(createNotificationBodySchema) },
    NotificationController.createNotificationController,
  );

  app.post<{ Body: CreateTenantBody }>(
    "/tenant",
    { preValidation: validateBody(createTenantSchema) },
    TenantController.createTenantController,
  );
};

export default routes;
