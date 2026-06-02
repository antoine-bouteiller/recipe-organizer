PRAGMA foreign_keys=OFF;--> statement-breakpoint

ALTER TABLE `ingredients` ADD `density_g_per_ml` real;--> statement-breakpoint
ALTER TABLE `ingredients` ADD `count_weight_g` real;--> statement-breakpoint
ALTER TABLE `ingredients` ADD `preferred_unit_slug` text;--> statement-breakpoint

CREATE TABLE `__new_group_ingredients` (
	`group_id` integer NOT NULL,
	`id` integer PRIMARY KEY,
	`ingredient_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`unit_slug` text,
	FOREIGN KEY (`group_id`) REFERENCES `recipe_ingredient_groups`(`id`) ON DELETE restrict,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE restrict
);--> statement-breakpoint

INSERT INTO `__new_group_ingredients`(`group_id`, `id`, `ingredient_id`, `quantity`, `unit_slug`)
SELECT
	gi.`group_id`,
	gi.`id`,
	gi.`ingredient_id`,
	gi.`quantity`,
	(
		SELECT CASE u.`name`
			WHEN 'g' THEN 'g'
			WHEN 'kg' THEN 'kg'
			WHEN 'mL' THEN 'ml'
			WHEN 'L' THEN 'l'
			WHEN 'CàC' THEN 'tsp'
			WHEN 'CàS' THEN 'tbsp'
			WHEN 'cube(s)' THEN 'cube'
			WHEN 'bouteille(s)' THEN 'bottle'
			WHEN 'feuille(s)' THEN 'sheet'
			WHEN 'boite(s)' THEN 'box'
			WHEN 'conserver(s)' THEN 'can'
			WHEN 'cm' THEN 'cm'
			WHEN 'poignée(s)' THEN 'handful'
			WHEN 'Sachet' THEN 'packet'
			ELSE NULL
		END
		FROM `units` u WHERE u.`id` = gi.`unit_id`
	) AS `unit_slug`
FROM `group_ingredients` gi;--> statement-breakpoint
DROP TABLE `group_ingredients`;--> statement-breakpoint
ALTER TABLE `__new_group_ingredients` RENAME TO `group_ingredients`;
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_group_ingredients_group_id` ON `group_ingredients` (`group_id`);--> statement-breakpoint
CREATE INDEX `idx_group_ingredients_ingredient_id` ON `group_ingredients` (`ingredient_id`);--> statement-breakpoint
DROP TABLE `units`;
