import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import { createNotificationController } from "./modules/notification/notification.controller";
import { createNotificationSchema } from "./modules/notification/notification.schema";
import { successResponseHelper } from "@utils";

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/health", async (_request, reply) => {
    return successResponseHelper(reply);
  });

  app.post(
    "/notification",
    createNotificationSchema,
    createNotificationController,
  );
};

export default routes;
