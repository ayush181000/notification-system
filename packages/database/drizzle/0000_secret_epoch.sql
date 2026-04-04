CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"channel" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text NOT NULL,
	"priority" text NOT NULL,
	"retries" integer DEFAULT 0,
	"scheduled_at" timestamp,
	"idempotency_key" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_status" ON "notifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_created_at" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_status_created" ON "notifications" USING btree ("status","created_at");