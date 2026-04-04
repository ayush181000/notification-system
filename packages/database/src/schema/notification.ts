import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey(),

    userId: text("user_id").notNull(),
    channel: text("channel").notNull(),

    payload: jsonb("payload").notNull(),

    status: text("status").notNull(),
    priority: text("priority").notNull(),

    retries: integer("retries").default(0),

    scheduledAt: timestamp("scheduled_at"),

    idempotencyKey: text("idempotency_key"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("idx_user_id").on(table.userId),
      statusIdx: index("idx_status").on(table.status),
      createdIdx: index("idx_created_at").on(table.createdAt),
      statusCreatedIdx: index("idx_status_created").on(
        table.status,
        table.createdAt,
      ),
    };
  },
);
