import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// ------------------- TEMPLATES -------------------
export const templates = pgTable(
  "templates",
  {
    id: uuid("id").primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    nameIndex: index("idx_templates_name").on(table.tenantId, table.name),
  }),
);
export type Template = InferSelectModel<typeof templates>;

// ------------------- TEMPLATE CHANNELS -------------------
export const templateChannels = pgTable(
  "template_channels",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    channel: text("channel").notNull(),
    subject: text("subject"),
    body: jsonb("body").notNull(),
    attachments: jsonb("attachments"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    channelIndex: index("idx_template_channels_channel").on(table.channel),
  }),
);

// ------------------- TEMPLATE VARIABLES -------------------
export const templateVariables = pgTable(
  "template_variables",
  {
    id: uuid("id").primaryKey(),
    templateId: uuid("template_id").notNull(),
    name: text("name").notNull(),
    type: text("type").default("string"),
    required: boolean("required").default(true),
  },
  (table) => ({
    templateIndex: index("idx_template_variables_template").on(
      table.templateId,
    ),
  }),
);

export type TemplateVariables = InferSelectModel<typeof templateVariables>;
