DROP TABLE `user`;--> statement-breakpoint
CREATE TABLE `user` (
	`created_at` integer NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`id` text PRIMARY KEY,
	`image` text,
	`name` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `account` (
	`access_token` text,
	`access_token_expires_at` integer,
	`account_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY,
	`id_token` text,
	`password` text,
	`provider_id` text NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_at` integer,
	`scope` text,
	`updated_at` integer NOT NULL,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `session` (
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text PRIMARY KEY,
	`ip_address` text,
	`token` text NOT NULL UNIQUE,
	`updated_at` integer NOT NULL,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`updated_at` integer NOT NULL,
	`value` text NOT NULL
);
