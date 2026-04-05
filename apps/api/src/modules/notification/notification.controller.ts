import type { FastifyReply, FastifyRequest } from "fastify";
import { NotificationService } from "./notification.service";
import type { CreateNotificationBody } from "./notification.schema";
import { successResponseHelper } from "@utils";
import { AsyncHandler } from "@errors";

class NotificationController {
  @AsyncHandler
  static async createNotificationController(
    request: FastifyRequest<{ Body: CreateNotificationBody }>,
    reply: FastifyReply,
  ) {
    const data = request.body;

    const result = await NotificationService.create(data);

    return successResponseHelper(reply, result, 201);
  }
}

export default NotificationController;
