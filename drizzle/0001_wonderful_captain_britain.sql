CREATE INDEX `newsletter_folders_user_newsletter_idx` ON `newsletter_folders` (`user_newsletter_id`);--> statement-breakpoint
CREATE INDEX `newsletters_source_id_idx` ON `newsletters` (`source_id`);--> statement-breakpoint
CREATE INDEX `newsletters_received_at_idx` ON `newsletters` (`received_at`);--> statement-breakpoint
CREATE INDEX `user_folders_user_id_idx` ON `user_folders` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_newsletter_sources_source_id_idx` ON `user_newsletter_sources` (`source_id`);--> statement-breakpoint
CREATE INDEX `user_newsletter_sources_user_source_idx` ON `user_newsletter_sources` (`user_id`,`source_id`);--> statement-breakpoint
CREATE INDEX `user_newsletters_user_id_idx` ON `user_newsletters` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_newsletters_user_newsletter_unique` ON `user_newsletters` (`user_id`,`newsletter_id`);--> statement-breakpoint
CREATE INDEX `user_preferences_user_id_idx` ON `user_preferences` (`user_id`);