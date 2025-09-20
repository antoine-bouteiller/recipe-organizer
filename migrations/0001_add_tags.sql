ALTER TABLE `ingredients` ADD `allowed_units` text DEFAULT '[]';

--> statement-breakpoint
ALTER TABLE `ingredients` ADD `category` text DEFAULT 'supermarket' NOT NULL;

--> statement-breakpoint
ALTER TABLE `ingredients` ADD `vegan` integer DEFAULT false NOT NULL;

--> statement-breakpoint
ALTER TABLE `ingredients` ADD `parent_id` integer;

--> statement-breakpoint
ALTER TABLE `ingredients`
DROP COLUMN `plural_name`;

--> statement-breakpoint
ALTER TABLE `recipes` ADD `tags` text DEFAULT '[]';