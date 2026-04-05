import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";

// ------------------- TENANTS -------------------
export const tenants = pgTable(
  "tenants",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
    apiKey: text("api_key").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    idxApiKey: uniqueIndex("idx_tenants_api_key").on(table.apiKey),
  }),
);

export type Tenants = InferSelectModel<typeof tenants>;
