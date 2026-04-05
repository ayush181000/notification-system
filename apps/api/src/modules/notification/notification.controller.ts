import type { FastifyReply, FastifyRequest } from "fastify";
import { NotificationService } from "./notification.service";
import type { CreateNotificationBody } from "./notification.types";
import { successResponseHelper } from "@utils";

export const createNotificationController = async (
  request: FastifyRequest<{ Body: CreateNotificationBody }>,
  reply: FastifyReply,
) => {
  const data = request.body;

  const result = await NotificationService.create(data);

  return successResponseHelper(reply, result, 201);
};
