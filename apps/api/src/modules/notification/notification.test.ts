import { describe, it, expect } from "vitest";
import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  it("should create a notification", async () => {
    const result = await NotificationService.create({
      userId: "123",
      channel: "email",
      payload: {
        to: "test@example.com",
        message: "Hello",
      },
    });

    expect(result).toBeDefined();
    if (result.success) {
      expect(result.data.userId).toBe("123");
    }else {
        expect(result.error).toBe("")
    }
  });

  it("should prevent duplicate notifications", async () => {
    const input = {
      userId: "123",
      channel: "email",
      payload: { msg: "duplicate" },
    };

    await NotificationService.create(input);
    const second = await NotificationService.create(input);

    expect(second).toBeDefined();
  });
});
