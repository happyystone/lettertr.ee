CREATE TABLE IF NOT EXISTS "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"source" varchar(50) DEFAULT 'homepage' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp NOT NULL,
	"invited_at" timestamp,
	"converted_at" timestamp,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "waitlist_status_idx" ON "waitlist" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "waitlist_source_idx" ON "waitlist" USING btree ("source");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "waitlist_created_at_idx" ON "waitlist" USING btree ("created_at");