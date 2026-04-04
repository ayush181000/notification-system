export type Channel = "email" | "sms" | "whatsapp" | "push";

export const Errors = {
  ERROR_NOTIFICATION_DUPLICATE: "Duplicate notification ignored",
  ERROR_NOTIFICATION_INSERTION_FAILED: "Notification insertion failed",
} as const;

export type ErrorMessages = (typeof Errors)[keyof typeof Errors];

export interface CreateNotificationInput {
  userId: string;
  channel: Channel;
  payload: Record<string, any>;
  priority?: "low" | "medium" | "high";
  scheduledAt?: Date;
}

export type ReturnInterface<T, U> =
  | {
      success: true;
      data: T;
    }
  | { success: false; error: U };
