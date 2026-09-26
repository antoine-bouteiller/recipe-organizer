CREATE TABLE `magimix_steps` (
	`id` integer PRIMARY KEY,
	`position` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	`program` text NOT NULL,
	`rotation_speed` text NOT NULL,
	`temperature` integer,
	`time` integer NOT NULL,
	CONSTRAINT `fk_magimix_steps_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `subrecipe_steps` (
	`id` integer PRIMARY KEY,
	`position` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	`from_step` integer,
	`subrecipe_id` integer NOT NULL,
	`to_step` integer,
	CONSTRAINT `fk_subrecipe_steps_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT,
	CONSTRAINT `fk_subrecipe_steps_subrecipe_id_recipes_id_fk` FOREIGN KEY (`subrecipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `text_steps` (
	`id` integer PRIMARY KEY,
	`position` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	`text` text NOT NULL,
	CONSTRAINT `fk_text_steps_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_magimix_steps_recipe_position` ON `magimix_steps` (`recipe_id`,`position`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_subrecipe_steps_recipe_position` ON `subrecipe_steps` (`recipe_id`,`position`);--> statement-breakpoint
CREATE INDEX `idx_subrecipe_steps_subrecipe_id` ON `subrecipe_steps` (`subrecipe_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_text_steps_recipe_position` ON `text_steps` (`recipe_id`,`position`);