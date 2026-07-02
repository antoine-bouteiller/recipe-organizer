PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_recipes` (
	`created_by` text NOT NULL,
	`cuisine_types` text DEFAULT '[]' NOT NULL,
	`id` integer PRIMARY KEY,
	`image` text(255) NOT NULL,
	`instructions` text NOT NULL,
	`is_magimix` integer DEFAULT false NOT NULL,
	`is_spice` integer DEFAULT false NOT NULL,
	`is_vegetarian` integer DEFAULT false NOT NULL,
	`meals` text DEFAULT '[]' NOT NULL,
	`name` text(255) NOT NULL,
	`servings` integer NOT NULL,
	`video` text(255),
	CONSTRAINT `fk_recipes_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
INSERT INTO `__new_recipes`(`created_by`, `cuisine_types`, `id`, `image`, `instructions`, `is_magimix`, `is_spice`, `is_vegetarian`, `meals`, `name`, `servings`, `video`) SELECT `created_by`, `cuisine_types`, `id`, `image`, `instructions`, `is_magimix`, `is_spice`, `is_vegetarian`, `meals`, `name`, `servings`, `video` FROM `recipes`;--> statement-breakpoint
DROP TABLE `recipes`;--> statement-breakpoint
ALTER TABLE `__new_recipes` RENAME TO `recipes`;--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;
