import type { FastifyReply, FastifyRequest } from "fastify";
import { NotificationService } from "./notification.service";
import type { CreateNotificationInput } from "./notification.types";

export const createNotificationController = async (
  request: FastifyRequest<{ Body: CreateNotificationInput }>,
  reply: FastifyReply,
) => {
  const data = request.body;

  const result = await NotificationService.create(data);

  return result.success
    ? reply.status(202).send(result)
    : reply.status(400).send(result);
};
