ALTER TABLE `recipes` ADD `cuisine_types` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` ADD `is_magimix` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` ADD `is_vegetarian` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` ADD `meals` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
UPDATE `recipes` SET
	`is_vegetarian` = (CASE WHEN EXISTS (SELECT 1 FROM json_each(`tags`) WHERE value = 'vegetarian') THEN 1 ELSE 0 END),
	`is_magimix` = (CASE WHEN EXISTS (SELECT 1 FROM json_each(`tags`) WHERE value = 'magimix') THEN 1 ELSE 0 END),
	`meals` = COALESCE((SELECT json_group_array(value) FROM json_each(`tags`) WHERE value IN ('dessert')), '[]'),
	`cuisine_types` = COALESCE((SELECT json_group_array(value) FROM json_each(`tags`) WHERE value IN ('mediterranean', 'chinese', 'japanese', 'indian', 'mexican', 'italian', 'french')), '[]');--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `tags`;