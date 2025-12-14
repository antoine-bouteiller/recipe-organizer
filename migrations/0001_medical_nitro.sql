PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recipe_ingredient_groups` (
	`group_name` text(255),
	`id` integer PRIMARY KEY NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`recipe_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_recipe_ingredient_groups`("group_name", "id", "is_default", "recipe_id") SELECT "group_name", "id", "is_default", "recipe_id" FROM `recipe_ingredient_groups`;--> statement-breakpoint
DROP TABLE `recipe_ingredient_groups`;--> statement-breakpoint
ALTER TABLE `__new_recipe_ingredient_groups` RENAME TO `recipe_ingredient_groups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;