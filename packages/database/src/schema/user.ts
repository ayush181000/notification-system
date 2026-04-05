import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ------------------- USERS -------------------
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    externalUserId: text("external_user_id").notNull(),
    email: text("email"),
    phone: text("phone"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueTenantUser: uniqueIndex("idx_users_external_user").on(
      table.tenantId,
      table.externalUserId,
    ),
    emailIndex: index("idx_users_email").on(table.tenantId, table.email),
  }),
);

export type User = InferSelectModel<typeof users>;

// ------------------- USER PREFERENCES -------------------
export const userPreferences = pgTable(
  "user_preferences",
  {
    id: uuid("id").primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    userId: uuid("user_id").notNull(),
    channel: text("channel").notNull(),
    enabled: boolean("enabled").default(true),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueUserChannel: uniqueIndex("idx_user_channel_unique").on(
      table.userId,
      table.channel,
    ),
    enabledIndex: index("idx_user_preferences_enabled").on(
      table.tenantId,
      table.enabled,
    ),
  }),
);

export type UserPreferences = InferSelectModel<typeof userPreferences>;
