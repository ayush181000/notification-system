CREATE TABLE "notification_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"notification_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"channel" text NOT NULL,
	"template_id" uuid,
	"payload" jsonb NOT NULL,
	"attachments" jsonb,
	"status" text NOT NULL,
	"priority" text NOT NULL,
	"scheduled_at" timestamp,
	"idempotency_key" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "template_channels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "template_channels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"channel" text NOT NULL,
	"subject" text,
	"body" jsonb NOT NULL,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "template_variables" (
	"id" uuid PRIMARY KEY NOT NULL,
	"template_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'string',
	"required" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tenants_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"api_key" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"channel" text NOT NULL,
	"enabled" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"external_user_id" text NOT NULL,
	"email" text,
	"phone" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "idx_notification_events_notification" ON "notification_events" USING btree ("notification_id");--> statement-breakpoint
CREATE INDEX "idx_notification_events_event_type" ON "notification_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_status" ON "notifications" USING btree ("user_id","channel","status");--> statement-breakpoint
CREATE INDEX "idx_notifications_scheduled" ON "notifications" USING btree ("scheduled_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_notifications_idempotency" ON "notifications" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "idx_template_channels_channel" ON "template_channels" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "idx_template_variables_template" ON "template_variables" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "idx_templates_name" ON "templates" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_tenants_api_key" ON "tenants" USING btree ("api_key");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_user_channel_unique" ON "user_preferences" USING btree ("user_id","channel");--> statement-breakpoint
CREATE INDEX "idx_user_preferences_enabled" ON "user_preferences" USING btree ("tenant_id","enabled");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_users_external_user" ON "users" USING btree ("tenant_id","external_user_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("tenant_id","email");