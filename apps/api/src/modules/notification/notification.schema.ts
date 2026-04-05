import { z } from "zod";

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
