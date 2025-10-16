CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan` text NOT NULL,
	`reference_id` text NOT NULL,
	`polar_customer_id` text,
	`polar_subscription_id` text,
	`status` text DEFAULT 'incomplete',
	`period_start` integer,
	`period_end` integer,
	`cancel_at_period_end` integer,
	`seats` integer,
	`trial_start` integer,
	`trial_end` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`avatar` text,
	`avatar_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`polar_customer_id` text,
	`lettertree_email` text,
	`region` text DEFAULT 'ROW',
	`preferences` text,
	`is_onboarded` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_lettertree_email_unique` ON `users` (`lettertree_email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`source` text DEFAULT 'homepage' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`metadata` text DEFAULT '{}',
	`created_at` integer NOT NULL,
	`invited_at` integer,
	`converted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_email_unique` ON `waitlist` (`email`);--> statement-breakpoint
CREATE TABLE `newsletter_folders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_newsletter_id` text NOT NULL,
	`folder_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_newsletter_id`) REFERENCES `user_newsletters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`folder_id`) REFERENCES `user_folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `newsletter_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`domain` text,
	`description` text,
	`category` text,
	`logo_url` text,
	`website` text,
	`subscribe_url` text,
	`is_verified` integer DEFAULT false NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`subscriber_count` integer DEFAULT 0,
	`is_active` integer DEFAULT true NOT NULL,
	`region` text DEFAULT 'ROW' NOT NULL,
	`total_newsletters` integer DEFAULT 0,
	`last_newsletter_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`update_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_sources_email_unique` ON `newsletter_sources` (`email`);--> statement-breakpoint
CREATE TABLE `newsletters` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`newsletter_hash` text NOT NULL,
	`message_id` text NOT NULL,
	`subject` text NOT NULL,
	`sender_email` text NOT NULL,
	`sender_name` text,
	`html_content` text,
	`text_content` text,
	`extracted_content` text,
	`excerpt` text,
	`summary` text,
	`thumbnail_url` text,
	`original_url` text,
	`read_time_minutes` integer DEFAULT 5,
	`headers` text DEFAULT '{}',
	`attachments` text DEFAULT '[]',
	`tags` text DEFAULT '[]',
	`category` text,
	`is_active` integer DEFAULT true NOT NULL,
	`received_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `newsletter_sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletters_newsletter_hash_unique` ON `newsletters` (`newsletter_hash`);--> statement-breakpoint
CREATE TABLE `user_folders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text DEFAULT '#6366f1',
	`sort_order` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_newsletter_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`source_id` text NOT NULL,
	`is_subscribed` integer DEFAULT true NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`is_paused` integer DEFAULT false NOT NULL,
	`subscription_email` text,
	`preferences` text,
	`subscribed_at` integer NOT NULL,
	`unsubscribed_at` integer,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `newsletter_sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_newsletters` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`newsletter_id` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`is_bookmarked` integer DEFAULT false NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`read_at` integer,
	`bookmarked_at` integer,
	`archived_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`newsletter_id`) REFERENCES `newsletters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`region` text DEFAULT 'ROW' NOT NULL,
	`preferred_categories` text DEFAULT '[]',
	`reading_speed_wpm` integer DEFAULT 200,
	`email_frequency` text DEFAULT 'instant',
	`settings` text DEFAULT '{}',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_preferences_user_id_unique` ON `user_preferences` (`user_id`);