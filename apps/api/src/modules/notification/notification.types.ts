export type { CreateNotificationBody } from "./notification.schema";

export type ReturnInterface<T> = {
  success: true;
  data: T;
};
