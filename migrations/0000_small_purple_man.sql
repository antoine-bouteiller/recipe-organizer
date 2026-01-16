CREATE TABLE `ingredients` (
	`category` text DEFAULT 'other' NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parent_id` integer
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`image` text(255) NOT NULL,
	`instructions` text NOT NULL,
	`name` text(255) NOT NULL,
	`servings` integer NOT NULL,
	`tags` text DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE `group_ingredients` (
	`group_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`ingredient_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`unit_id` integer,
	FOREIGN KEY (`group_id`) REFERENCES `recipe_ingredient_groups`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredient_groups` (
	`group_name` text(255),
	`id` integer PRIMARY KEY NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`recipe_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `recipe_linked_recipes` (
	`linked_recipe_id` integer NOT NULL,
	`ratio` real DEFAULT 1 NOT NULL,
	`recipe_id` integer NOT NULL,
	FOREIGN KEY (`linked_recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `units` (
	`factor` real,
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parent_id` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`email` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);