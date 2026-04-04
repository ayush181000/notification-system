import type { FastifyReply, FastifyRequest } from "fastify";
import { NotificationService } from "./notification.service";
import type { CreateNotificationInput } from "./notification.types";
import { successResponseHelper } from "@utils";

export const createNotificationController = async (
  request: FastifyRequest<{ Body: CreateNotificationInput }>,
  reply: FastifyReply,
) => {
  const data = request.body;

  const result = await NotificationService.create(data);

  return successResponseHelper(reply, result, 201);
};
