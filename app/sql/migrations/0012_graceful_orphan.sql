ALTER TABLE "waitlist" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "waitlist" DROP CONSTRAINT "waitlist_user_id_users_id_fk";
--> statement-breakpoint
DROP POLICY "waitlist_user_policy" ON "waitlist" CASCADE;
ALTER TABLE "waitlist" DROP COLUMN "user_id";--> statement-breakpoint
