CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"reference_id" text NOT NULL,
	"polar_customer_id" text,
	"polar_subscription_id" text,
	"status" text DEFAULT 'incomplete',
	"period_start" timestamp,
	"period_end" timestamp,
	"cancel_at_period_end" boolean,
	"seats" integer,
	"trial_start" timestamp,
	"trial_end" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"avatar" text,
	"avatar_url" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"polar_customer_id" text,
	"newsletix_email" text,
	"region" varchar(3) DEFAULT 'ROW',
	"preferences" json,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_newsletix_email_unique" UNIQUE("newsletix_email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "newsletter_folders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_newsletter_id" text NOT NULL,
	"folder_id" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"domain" varchar(255),
	"description" text,
	"category" varchar(100),
	"logo_url" text,
	"website" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"subscriber_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"region" varchar(10) DEFAULT 'ROW' NOT NULL,
	"total_newsletters" integer DEFAULT 0,
	"last_newsletter_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "newsletter_sources_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "newsletters" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source_id" text,
	"message_id" text,
	"subject" text NOT NULL,
	"sender_email" varchar(255) NOT NULL,
	"sender_name" varchar(255),
	"recipient_email" varchar(255) NOT NULL,
	"html_content" text,
	"text_content" text,
	"extracted_content" text,
	"excerpt" text,
	"summary" text,
	"thumbnail_url" text,
	"original_url" text,
	"read_time_minutes" integer DEFAULT 5,
	"headers" jsonb DEFAULT '{}'::jsonb,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"category" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"received_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "newsletters_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE TABLE "user_folders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"color" varchar(20) DEFAULT '#6366f1',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_newsletter_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source_id" text NOT NULL,
	"is_subscribed" boolean DEFAULT true NOT NULL,
	"subscribed_at" timestamp NOT NULL,
	"unsubscribed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_newsletters" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"newsletter_id" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"is_bookmarked" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"bookmarked_at" timestamp,
	"archived_at" timestamp,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"region" varchar(10) DEFAULT 'ROW' NOT NULL,
	"preferred_categories" jsonb DEFAULT '[]'::jsonb,
	"reading_speed_wpm" integer DEFAULT 200,
	"email_frequency" varchar(20) DEFAULT 'instant',
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_folders" ADD CONSTRAINT "newsletter_folders_user_newsletter_id_user_newsletters_id_fk" FOREIGN KEY ("user_newsletter_id") REFERENCES "public"."user_newsletters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_folders" ADD CONSTRAINT "newsletter_folders_folder_id_user_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."user_folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_source_id_newsletter_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."newsletter_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_folders" ADD CONSTRAINT "user_folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_newsletter_sources" ADD CONSTRAINT "user_newsletter_sources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_newsletter_sources" ADD CONSTRAINT "user_newsletter_sources_source_id_newsletter_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."newsletter_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_newsletters" ADD CONSTRAINT "user_newsletters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_newsletters" ADD CONSTRAINT "user_newsletters_newsletter_id_newsletters_id_fk" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "newsletter_folders_user_newsletter_idx" ON "newsletter_folders" USING btree ("user_newsletter_id");--> statement-breakpoint
CREATE INDEX "newsletter_folders_folder_idx" ON "newsletter_folders" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "newsletters_user_id_idx" ON "newsletters" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "newsletters_source_id_idx" ON "newsletters" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "newsletters_received_at_idx" ON "newsletters" USING btree ("received_at");--> statement-breakpoint
CREATE INDEX "newsletters_sender_email_idx" ON "newsletters" USING btree ("sender_email");--> statement-breakpoint
CREATE INDEX "newsletters_tags_idx" ON "newsletters" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "user_folders_user_id_idx" ON "user_folders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_newsletter_sources_user_id_idx" ON "user_newsletter_sources" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_newsletter_sources_source_id_idx" ON "user_newsletter_sources" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "user_newsletter_sources_user_source_idx" ON "user_newsletter_sources" USING btree ("user_id","source_id");--> statement-breakpoint
CREATE INDEX "user_newsletters_user_id_idx" ON "user_newsletters" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_newsletters_newsletter_id_idx" ON "user_newsletters" USING btree ("newsletter_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_newsletters_user_newsletter_unique" ON "user_newsletters" USING btree ("user_id","newsletter_id");--> statement-breakpoint
CREATE INDEX "user_preferences_user_id_idx" ON "user_preferences" USING btree ("user_id");