import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import { createNotificationController } from "./modules/notification/notification.controller";
import { createNotificationSchema } from "./modules/notification/notification.schema";

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post(
    "/notification",
    createNotificationSchema,
    createNotificationController,
  );
};

export default routes;
