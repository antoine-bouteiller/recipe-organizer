-- Step rows were never migrated, so the step tables are wiped and recreated around step groups.
DROP TABLE `text_steps`;--> statement-breakpoint
DROP TABLE `magimix_steps`;--> statement-breakpoint
DROP TABLE `subrecipe_steps`;--> statement-breakpoint
CREATE TABLE `recipe_step_groups` (
	`group_name` text(255),
	`id` integer PRIMARY KEY,
	`is_default` integer DEFAULT false NOT NULL,
	`position` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	`subrecipe_id` integer,
	CONSTRAINT `fk_recipe_step_groups_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT,
	CONSTRAINT `fk_recipe_step_groups_subrecipe_id_recipes_id_fk` FOREIGN KEY (`subrecipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT,
	CONSTRAINT "ck_recipe_step_groups_subrecipe" CHECK("subrecipe_id" IS NULL OR ("group_name" IS NULL AND "is_default" = 0))
);
--> statement-breakpoint
CREATE TABLE `recipe_steps` (
	`group_id` integer NOT NULL,
	`id` integer PRIMARY KEY,
	`position` integer NOT NULL,
	CONSTRAINT `fk_recipe_steps_group_id_recipe_step_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `recipe_step_groups`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `text_steps` (
	`step_id` integer PRIMARY KEY,
	`text` text NOT NULL,
	CONSTRAINT `fk_text_steps_step_id_recipe_steps_id_fk` FOREIGN KEY (`step_id`) REFERENCES `recipe_steps`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `magimix_steps` (
	`program` text NOT NULL,
	`rotation_speed` text NOT NULL,
	`step_id` integer PRIMARY KEY,
	`temperature` integer,
	`time` integer NOT NULL,
	CONSTRAINT `fk_magimix_steps_step_id_recipe_steps_id_fk` FOREIGN KEY (`step_id`) REFERENCES `recipe_steps`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_recipe_step_groups_recipe_position` ON `recipe_step_groups` (`recipe_id`,`position`);--> statement-breakpoint
CREATE INDEX `idx_recipe_step_groups_subrecipe_id` ON `recipe_step_groups` (`subrecipe_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_recipe_steps_group_position` ON `recipe_steps` (`group_id`,`position`);
