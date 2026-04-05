import { db, type Notification } from "@database";
import { notifications } from "@database";

import { generateIdempotencyKey, generateUUIDV7 } from "@utils";
import type { CreateNotificationBody } from "./notification.schema";
import type { ReturnInterface } from "./notification.types";
import { DatabaseError, ERROR_CODES } from "@errors";

function isPgUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  while (current && typeof current === "object") {
    if ("code" in current && (current as { code: unknown }).code === "23505") {
      return true;
    }
    current =
      "cause" in current ? (current as { cause: unknown }).cause : undefined;
  }
  return false;
}

export class NotificationService {
  static async create(
    input: CreateNotificationBody,
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
          tenantId: "00000000-0000-4000-8000-000000000001",
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
      if (isPgUniqueViolation(error)) {
        throw new DatabaseError(undefined, "Duplicate resource");
      }

      throw new DatabaseError(ERROR_CODES.DATABASE_ERROR);
    }
  }
}
