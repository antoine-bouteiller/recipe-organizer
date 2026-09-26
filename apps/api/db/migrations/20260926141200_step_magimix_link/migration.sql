-- Steps become text-only with an optional Magimix program: each Magimix step attaches to the text step before it.
-- Magimix rows are staged without a foreign key so dropping `recipe_steps` cannot cascade onto them;
-- NOT NULL `step_id` aborts the migration if a Magimix step has no preceding text step.
CREATE TABLE `__magimix_steps` (
	`program` text NOT NULL,
	`rotation_speed` text NOT NULL,
	`step_id` integer NOT NULL UNIQUE,
	`temperature` integer,
	`time` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__magimix_steps` (`program`, `rotation_speed`, `step_id`, `temperature`, `time`)
SELECT m.`program`, m.`rotation_speed`, (
	SELECT prev.`id` FROM `recipe_steps` prev JOIN `text_steps` t ON t.`step_id` = prev.`id`
	WHERE prev.`group_id` = s.`group_id` AND prev.`position` = s.`position` - 1
), m.`temperature`, m.`time`
FROM `magimix_steps` m JOIN `recipe_steps` s ON s.`id` = m.`step_id`;
--> statement-breakpoint
CREATE TABLE `__new_recipe_steps` (
	`group_id` integer NOT NULL,
	`id` integer PRIMARY KEY,
	`position` integer NOT NULL,
	`text` text NOT NULL,
	CONSTRAINT `fk_recipe_steps_group_id_recipe_step_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `recipe_step_groups`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_recipe_steps` (`group_id`, `id`, `position`, `text`)
SELECT s.`group_id`, s.`id`, ROW_NUMBER() OVER (PARTITION BY s.`group_id` ORDER BY s.`position`), t.`text`
FROM `recipe_steps` s JOIN `text_steps` t ON t.`step_id` = s.`id`;
--> statement-breakpoint
DROP TABLE `magimix_steps`;--> statement-breakpoint
DROP TABLE `text_steps`;--> statement-breakpoint
DROP TABLE `recipe_steps`;--> statement-breakpoint
ALTER TABLE `__new_recipe_steps` RENAME TO `recipe_steps`;--> statement-breakpoint
CREATE UNIQUE INDEX `uq_recipe_steps_group_position` ON `recipe_steps` (`group_id`,`position`);--> statement-breakpoint
CREATE TABLE `magimix_steps` (
	`program` text NOT NULL,
	`rotation_speed` text NOT NULL,
	`step_id` integer PRIMARY KEY,
	`temperature` integer,
	`time` integer NOT NULL,
	CONSTRAINT `fk_magimix_steps_step_id_recipe_steps_id_fk` FOREIGN KEY (`step_id`) REFERENCES `recipe_steps`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `magimix_steps` (`program`, `rotation_speed`, `step_id`, `temperature`, `time`)
SELECT `program`, `rotation_speed`, `step_id`, `temperature`, `time` FROM `__magimix_steps`;
--> statement-breakpoint
DROP TABLE `__magimix_steps`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `instructions`;
