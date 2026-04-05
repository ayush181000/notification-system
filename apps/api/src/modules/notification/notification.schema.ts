import type { FastifyReply, FastifyRequest } from "fastify";
import { flattenError, z } from "zod";

export const notificationChannelSchema = z.enum([
  "email",
  "sms",
  "whatsapp",
  "push",
]);

export const notificationPrioritySchema = z.enum(["low", "medium", "high"]);

/** Single source of truth for POST /notification body validation and typing. */
export const createNotificationBodySchema = z.object({
  userId: z.uuid(),
  channel: notificationChannelSchema,
  payload: z.record(z.string(), z.unknown()),
  priority: notificationPrioritySchema.optional(),
  scheduledAt: z.coerce.date().optional(),
});

export type CreateNotificationBody = z.infer<
  typeof createNotificationBodySchema
>;

export type NotificationChannel = z.infer<typeof notificationChannelSchema>;

export async function validateCreateNotificationBody(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = createNotificationBodySchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Invalid request body",
      errors: flattenError(result.error),
    });
  }
  request.body = result.data;
}
