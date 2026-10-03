-- Void auth's Drizzle schema stores Better Auth dates in milliseconds.
UPDATE `user` SET `created_at` = `created_at` * 1000 WHERE `created_at` < 100000000000;
--> statement-breakpoint
UPDATE `user` SET `updated_at` = `updated_at` * 1000 WHERE `updated_at` < 100000000000;
--> statement-breakpoint
UPDATE `session` SET `created_at` = `created_at` * 1000 WHERE `created_at` < 100000000000;
--> statement-breakpoint
UPDATE `session` SET `updated_at` = `updated_at` * 1000 WHERE `updated_at` < 100000000000;
--> statement-breakpoint
UPDATE `session` SET `expires_at` = `expires_at` * 1000 WHERE `expires_at` < 100000000000;
--> statement-breakpoint
UPDATE `account` SET `created_at` = `created_at` * 1000 WHERE `created_at` < 100000000000;
--> statement-breakpoint
UPDATE `account` SET `updated_at` = `updated_at` * 1000 WHERE `updated_at` < 100000000000;
--> statement-breakpoint
UPDATE `account` SET `access_token_expires_at` = `access_token_expires_at` * 1000 WHERE `access_token_expires_at` < 100000000000;
--> statement-breakpoint
UPDATE `account` SET `refresh_token_expires_at` = `refresh_token_expires_at` * 1000 WHERE `refresh_token_expires_at` < 100000000000;
--> statement-breakpoint
UPDATE `verification` SET `created_at` = `created_at` * 1000 WHERE `created_at` < 100000000000;
--> statement-breakpoint
UPDATE `verification` SET `updated_at` = `updated_at` * 1000 WHERE `updated_at` < 100000000000;
--> statement-breakpoint
UPDATE `verification` SET `expires_at` = `expires_at` * 1000 WHERE `expires_at` < 100000000000;
