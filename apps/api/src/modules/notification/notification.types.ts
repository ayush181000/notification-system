export type Channel = "email" | "sms" | "whatsapp" | "push";

export interface CreateNotificationInput {
  userId: string;
  channel: Channel;
  payload: Record<string, any>;
  priority?: "low" | "medium" | "high";
  scheduledAt?: Date;
}
