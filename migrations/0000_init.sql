CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`plural_name` text
);
--> statement-breakpoint
CREATE TABLE `recipe_sections` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(255),
	`recipe_id` integer NOT NULL,
	`sub_recipe_id` integer,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sub_recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`image` text(255) NOT NULL,
	`steps` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `section_ingredients` (
	`id` integer PRIMARY KEY NOT NULL,
	`section_id` integer NOT NULL,
	`ingredient_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`unit` text,
	FOREIGN KEY (`section_id`) REFERENCES `recipe_sections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE cascade
);
