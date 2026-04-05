import { db } from "@database";
import { notifications } from "@database";

import { generateIdempotencyKey, generateUUIDV7 } from "@utils";
import type { CreateNotificationBody } from "./notification.schema";
import { DatabaseError, ERROR_CODES } from "@errors";
import { BaseService } from "@types";

export class NotificationService extends BaseService {
  static async create(input: CreateNotificationBody) {
    const id = generateUUIDV7();

    const idempotencyKey = generateIdempotencyKey({
      userId: input.userId,
      channel: input.channel,
      payload: input.payload,
    });

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
    return this.ok(row);
  }
}
