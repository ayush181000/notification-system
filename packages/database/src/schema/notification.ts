import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ------------------- NOTIFICATIONS -------------------
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    userId: uuid("user_id").notNull(),
    channel: text("channel").notNull(),
    templateId: uuid("template_id"),
    payload: jsonb("payload").notNull(),
    attachments: jsonb("attachments"),
    status: text("status").notNull(),
    priority: text("priority").notNull(),
    scheduledAt: timestamp("scheduled_at"),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userStatusIndex: index("idx_notifications_user_status").on(
      table.userId,
      table.channel,
      table.status,
    ),
    scheduledIndex: index("idx_notifications_scheduled").on(table.scheduledAt),
    idempotencyIndex: uniqueIndex("idx_notifications_idempotency").on(
      table.idempotencyKey,
    ),
  }),
);

export type Notification = InferSelectModel<typeof notifications>;

// ------------------- NOTIFICATION EVENTS -------------------
export const notificationEvents = pgTable(
  "notification_events",
  {
    id: uuid("id").primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    notificationId: uuid("notification_id").notNull(),
    eventType: text("event_type").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    notificationIndex: index("idx_notification_events_notification").on(
      table.notificationId,
    ),
    eventTypeIndex: index("idx_notification_events_event_type").on(
      table.eventType,
    ),
  }),
);

export type NotificationEvents = InferSelectModel<typeof notificationEvents>;
