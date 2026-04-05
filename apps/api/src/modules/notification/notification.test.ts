import { randomUUID } from "node:crypto";
import { describe, it, expect } from "vitest";
import { NotificationService } from "./notification.service";

const sampleUserId = "550e8400-e29b-41d4-a716-446655440000";

describe("NotificationService", () => {
  it("should create a notification", async () => {
    const result = await NotificationService.create({
      userId: sampleUserId,
      channel: "email",
      payload: {
        to: "test@example.com",
        message: "Hello",
        testRunId: randomUUID(),
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.userId).toBe(sampleUserId);
    }
  });

  it("should prevent duplicate notifications", async () => {
    const input = {
      userId: sampleUserId,
      channel: "email" as const,
      payload: { msg: "duplicate", testRunId: randomUUID() },
    };

    await NotificationService.create(input);
    await expect(NotificationService.create(input)).rejects.toThrow(
      "Duplicate resource",
    );
  });
});
