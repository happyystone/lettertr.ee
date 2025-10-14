ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "newsletter_folders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "newsletters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_folders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_newsletter_sources" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_newsletters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "newsletters" DROP CONSTRAINT "newsletters_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "newsletters" DROP CONSTRAINT "newsletters_source_id_newsletter_sources_id_fk";
--> statement-breakpoint
DROP INDEX "newsletters_user_id_idx";--> statement-breakpoint
ALTER TABLE "newsletters" ALTER COLUMN "source_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletters" ALTER COLUMN "message_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletters" ADD COLUMN "newsletter_hash" text NOT NULL DEFAULT gen_random_uuid()::text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_source_id_newsletter_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."newsletter_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "newsletters_hash_unique" ON "newsletters" USING btree ("newsletter_hash");--> statement-breakpoint
ALTER TABLE "newsletters" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "newsletters" DROP COLUMN "recipient_email";--> statement-breakpoint
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_newsletter_hash_unique" UNIQUE("newsletter_hash");--> statement-breakpoint
CREATE POLICY "accounts_user_policy" ON "accounts" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = current_setting('app.current_user_id')::text) WITH CHECK (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "sessions_user_policy" ON "sessions" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = current_setting('app.current_user_id')::text) WITH CHECK (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "subscriptions_user_policy" ON "subscriptions" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = current_setting('app.current_user_id')::text) WITH CHECK (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "users_self_policy" ON "users" AS PERMISSIVE FOR ALL TO "authenticated" USING (id = current_setting('app.current_user_id')::text) WITH CHECK (id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "verifications_user_policy" ON "verifications" AS PERMISSIVE FOR ALL TO "authenticated" USING (identifier IN (
        SELECT email FROM users WHERE id = current_setting('app.current_user_id')::text
      )) WITH CHECK (identifier IN (
        SELECT email FROM users WHERE id = current_setting('app.current_user_id')::text
      ));--> statement-breakpoint
CREATE POLICY "newsletter_folders_policy" ON "newsletter_folders" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM user_newsletters un
        WHERE un.id = user_newsletter_id
        AND un.user_id = current_setting('app.current_user_id')::text
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM user_newsletters un
        WHERE un.id = user_newsletter_id
        AND un.user_id = current_setting('app.current_user_id')::text
      ));--> statement-breakpoint
CREATE POLICY "newsletters_subscription_policy" ON "newsletters" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "user_newsletter_sources"
        WHERE "user_newsletter_sources"."source_id" = source_id
        AND "user_newsletter_sources"."user_id" = current_setting('app.current_user_id')::text
        AND "user_newsletter_sources"."is_subscribed" = true
      ));--> statement-breakpoint
CREATE POLICY "newsletters_insert_policy" ON "newsletters" AS PERMISSIVE FOR INSERT TO "anon" WITH CHECK (source_id IS NOT NULL);--> statement-breakpoint
CREATE POLICY "user_folders_policy" ON "user_folders" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = current_setting('app.current_user_id')::text) WITH CHECK (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "user_newsletter_sources_policy" ON "user_newsletter_sources" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = current_setting('app.current_user_id')::text) WITH CHECK (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "user_newsletters_policy" ON "user_newsletters" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = current_setting('app.current_user_id')::text) WITH CHECK (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "user_preferences_policy" ON "user_preferences" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = current_setting('app.current_user_id')::text) WITH CHECK (user_id = current_setting('app.current_user_id')::text);