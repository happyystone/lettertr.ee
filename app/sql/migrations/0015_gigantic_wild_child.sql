ALTER TABLE "waitlist" DROP CONSTRAINT "waitlist_email_unique";
-- DROP INDEX "waitlist_email_unique";--> statement-breakpoint
DROP INDEX "waitlist_status_idx";--> statement-breakpoint
DROP INDEX "waitlist_source_idx";--> statement-breakpoint
DROP INDEX "waitlist_created_at_idx";--> statement-breakpoint
DROP INDEX "newsletter_folders_folder_idx";--> statement-breakpoint
DROP INDEX "newsletters_sender_email_idx";--> statement-breakpoint
DROP INDEX "newsletters_tags_idx";--> statement-breakpoint
DROP INDEX "user_newsletter_sources_user_id_idx";--> statement-breakpoint
DROP INDEX "user_newsletters_newsletter_id_idx";