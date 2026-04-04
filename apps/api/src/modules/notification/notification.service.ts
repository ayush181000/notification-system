import { db, type Notification } from "@database";
import { notifications } from "@database";

import { generateIdempotencyKey, generateUUIDV7 } from "@utils";
import {
  Errors,
  type CreateNotificationInput,
  type ErrorMessages,
  type ReturnInterface,
} from "./notification.types";

export class NotificationService {
  static async create(
    input: CreateNotificationInput,
  ): Promise<ReturnInterface<Notification, ErrorMessages>> {
    const id = generateUUIDV7();

    const idempotencyKey = generateIdempotencyKey({
      userId: input.userId,
      channel: input.channel,
      payload: input.payload,
    });

    try {
      const result = await db
        .insert(notifications)
        .values({
          id,
          userId: input.userId,
          channel: input.channel,
          payload: input.payload,

          status: "queued",
          priority: input.priority ?? "medium",

          scheduledAt: input.scheduledAt,
          idempotencyKey,
        })
        .returning();

      const [row] = result;
      if (row !== undefined) {
        return { success: true, data: row };
      }

      return {
        success: false,
        error: Errors.ERROR_NOTIFICATION_INSERTION_FAILED,
      };
    } catch (error: unknown) {
      let e: unknown = error;
      while (e && typeof e === "object") {
        const code = (e as { code?: unknown }).code;
        if (code === "23505") {
          return { success: false, error: Errors.ERROR_NOTIFICATION_DUPLICATE };
        }
        e = (e as { cause?: unknown }).cause;
      }

      return {
        success: false,
        error: Errors.ERROR_NOTIFICATION_INSERTION_FAILED,
      };
    }
  }
}
