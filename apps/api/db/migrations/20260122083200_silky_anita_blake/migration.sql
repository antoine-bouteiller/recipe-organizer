ALTER TABLE `recipes` ADD `is_vegetarian` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` ADD `is_magimix` integer DEFAULT false NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`email` text NOT NULL UNIQUE,
	`id` text PRIMARY KEY,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`(`email`, `id`, `role`) SELECT `email`, `id`, `role` FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `user_email_unique`;--> statement-breakpoint
CREATE INDEX `idx_ingredients_category` ON `ingredients` (`category`);--> statement-breakpoint
CREATE INDEX `idx_recipes_name` ON `recipes` (`name`);--> statement-breakpoint
CREATE INDEX `idx_group_ingredients_group_id` ON `group_ingredients` (`group_id`);--> statement-breakpoint
CREATE INDEX `idx_group_ingredients_ingredient_id` ON `group_ingredients` (`ingredient_id`);--> statement-breakpoint
CREATE INDEX `idx_recipe_ingredient_groups_recipe_id` ON `recipe_ingredient_groups` (`recipe_id`);--> statement-breakpoint
CREATE INDEX `idx_recipe_linked_recipes_recipe_id` ON `recipe_linked_recipes` (`recipe_id`);--> statement-breakpoint
CREATE INDEX `idx_recipe_linked_recipes_linked_recipe_id` ON `recipe_linked_recipes` (`linked_recipe_id`);