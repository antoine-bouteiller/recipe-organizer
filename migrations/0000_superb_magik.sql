CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text DEFAULT 'other' NOT NULL,
	`parent_id` integer
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`image` text(255) NOT NULL,
	`instructions` text NOT NULL,
	`servings` integer NOT NULL,
	`tags` text DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE `group_ingredients` (
	`id` integer PRIMARY KEY NOT NULL,
	`group_id` integer NOT NULL,
	`ingredient_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`unit_id` integer,
	FOREIGN KEY (`group_id`) REFERENCES `recipe_ingredient_groups`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredient_groups` (
	`id` integer PRIMARY KEY NOT NULL,
	`group_name` text(255),
	`embedded_recipe_id` integer,
	`is_default` integer DEFAULT false NOT NULL,
	`recipe_id` integer NOT NULL,
	`scale_factor` real,
	FOREIGN KEY (`embedded_recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `recipe_linked_recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`linked_recipe_id` integer NOT NULL,
	`position` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	FOREIGN KEY (`linked_recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`factor` real,
	`parent_id` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);