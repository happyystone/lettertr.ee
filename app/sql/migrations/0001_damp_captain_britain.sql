ALTER TABLE "users" RENAME COLUMN "newsletix_email" TO "lettertree_email";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_newsletix_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_lettertree_email_unique" UNIQUE("lettertree_email");