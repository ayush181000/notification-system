import { db } from "@database";
import { notifications } from "@database";
import { v7 as uuidv7 } from "uuid";
import { generateIdempotencyKey } from "@utils";
import { type CreateNotificationInput } from "./notification.types";

export class NotificationService {
  static async create(input: CreateNotificationInput) {
    const id = uuidv7();

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

      return result[0];
    } catch (error: any) {
      // Handle duplicate (idempotency)
      if (error.code === "23505") {
        return { message: "Duplicate notification ignored" };
      }

      throw error;
    }
  }
}
