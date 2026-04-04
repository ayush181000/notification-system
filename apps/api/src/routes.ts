import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import { createNotificationController } from "./modules/notification/notification.controller";
import { createNotificationSchema } from "./modules/notification/notification.schema";
import type { CreateNotificationInput } from "./modules/notification/notification.types";

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post(
    "/notification",
    createNotificationSchema,
    createNotificationController,
  );
};

export default routes;
