import { db, type Notification } from "@database";
import { notifications } from "@database";

import { generateIdempotencyKey, generateUUIDV7 } from "@utils";
import {
  type CreateNotificationInput,
  type ReturnInterface,
} from "./notification.types";
import { DatabaseError, ERROR_CODES } from "@errors/src";

export class NotificationService {
  static async create(
    input: CreateNotificationInput,
  ): Promise<ReturnInterface<Notification>> {
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
      if (row === undefined) {
        throw new DatabaseError(ERROR_CODES.DATABASE_ERROR);
      }
      return { success: true, data: row };
    } catch (error: unknown) {
      let e: unknown = error;
      while (e && typeof e === "object") {
        const code = (e as { code?: unknown }).code;
        if (code === "23505") {
          throw new DatabaseError(ERROR_CODES.DUPLICATE_RESOURCE);
        }
      }

      throw new DatabaseError(ERROR_CODES.DATABASE_ERROR);
    }
  }
}
