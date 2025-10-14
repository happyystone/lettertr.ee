ALTER TABLE "waitlist" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "waitlist_user_policy" ON "waitlist" AS PERMISSIVE FOR ALL TO "authenticated" USING (user_id = current_setting('app.current_user_id')::text) WITH CHECK (user_id = current_setting('app.current_user_id')::text);