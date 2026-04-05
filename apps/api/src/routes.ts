import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import NotificationController from "./modules/notification/notification.controller";
import {
  createNotificationBodySchema,
  type CreateNotificationBody,
} from "./modules/notification/notification.schema";
import { successResponseHelper } from "@utils";
import TenantController from "./modules/tenant/tenant.controller";
import {
  createTenantSchema,
  type CreateTenantBody,
} from "./modules/tenant/tenant.schema";

export default async function routes(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => {
    return successResponseHelper(reply);
  });

  app.post<{ Body: CreateNotificationBody }>(
    "/notification",
    {
      schema: {
        body: createNotificationBodySchema,
      },
    },
    NotificationController.createNotificationController,
  );

  app.post<{ Body: CreateTenantBody }>(
    "/tenant",
    {
      schema: {
        body: createTenantSchema,
      },
    },
    TenantController.createTenantController,
  );
}
