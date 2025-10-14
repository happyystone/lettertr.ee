ALTER TABLE "user_newsletter_sources" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user_newsletter_sources" ADD COLUMN "is_paused" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_newsletter_sources" ADD COLUMN "subscription_email" varchar(255);--> statement-breakpoint
ALTER TABLE "user_newsletter_sources" ADD COLUMN "preferences" jsonb;--> statement-breakpoint
ALTER TABLE "user_newsletter_sources" ADD COLUMN "updated_at" timestamp NOT NULL;