export const createNotificationSchema = {
  schema: {
    body: {
      type: "object",
      required: ["userId", "channel", "payload", "priority"],
      properties: {
        userId: { type: "string" },
        channel: { type: "string" },
        payload: { type: "object" },
        priority: { type: "string", enum: ["low", "medium", "high"] },
      },
    },
  },
};
