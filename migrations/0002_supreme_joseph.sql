ALTER TABLE `recipe_sections` ADD `ratio` real;--> statement-breakpoint
ALTER TABLE `recipe_sections` ADD `is_default` integer DEFAULT false NOT NULL;