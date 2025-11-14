CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text DEFAULT 'supermarket' NOT NULL,
	`parent_id` integer
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`image` text(255) NOT NULL,
	`steps` text NOT NULL,
	`quantity` integer NOT NULL,
	`tags` text DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredients_sections` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(255),
	`recipe_id` integer NOT NULL,
	`sub_recipe_id` integer,
	`ratio` real,
	`is_default` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sub_recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `section_ingredients` (
	`id` integer PRIMARY KEY NOT NULL,
	`section_id` integer NOT NULL,
	`ingredient_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`unit_id` integer,
	FOREIGN KEY (`section_id`) REFERENCES `recipe_ingredients_sections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`symbol` text(50) NOT NULL,
	`parent_id` integer,
	`factor` real
);
--> statement-breakpoint
CREATE UNIQUE INDEX `units_name_unique` ON `units` (`name`);

INSERT INTO "user" VALUES('1','anto.bouteiller@gmail.com', 'admin');
