-- Create units table
CREATE TABLE `units` (
  `id` integer PRIMARY KEY NOT NULL,
  `name` text(100) NOT NULL UNIQUE,
  `symbol` text(50) NOT NULL,
  `parent_id` integer,
  `factor` real,
  FOREIGN KEY (`parent_id`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
-- Add unit_id column to section_ingredients
ALTER TABLE `section_ingredients` ADD `unit_id` integer REFERENCES `units`(`id`) ON UPDATE no action ON DELETE set null;

--> statement-breakpoint
-- Seed units table with current units
-- Base units (no parent)
INSERT INTO `units` (`id`, `name`, `symbol`, `parent_id`, `factor`) VALUES
  (1, 'Gramme', 'g', NULL, NULL),
  (2, 'Millilitre', 'mL', NULL, NULL),
  (3, 'Cuillère à café', 'CàC', NULL, NULL),
  (4, 'Cuillère à soupe', 'CàS', NULL, NULL),
  (5, 'Cube(s)', 'cube(s)', NULL, NULL),
  (6, 'Bouteille(s)', 'bouteille(s)', NULL, NULL),
  (7, 'Feuille(s)', 'feuille(s)', NULL, NULL),
  (8, 'Boite(s)', 'boite(s)', NULL, NULL),
  (9, 'Conserve(s)', 'conserver(s)', NULL, NULL),
  (10, 'Centimètre', 'cm', NULL, NULL);

--> statement-breakpoint
-- Add larger units with conversion factors
INSERT INTO `units` (`id`, `name`, `symbol`, `parent_id`, `factor`) VALUES
  (11, 'Kilogramme', 'kg', 1, 1000),
  (12, 'Litre', 'L', 2, 1000);

--> statement-breakpoint
-- Migrate data: Update section_ingredients.unit_id based on existing unit text
UPDATE `section_ingredients`
SET `unit_id` = (
  SELECT u.id
  FROM `units` u
  WHERE u.symbol = `section_ingredients`.`unit`
)
WHERE `section_ingredients`.`unit` IS NOT NULL;

--> statement-breakpoint
-- Drop the old allowed_units column from ingredients
ALTER TABLE `ingredients` DROP COLUMN `allowed_units`;

--> statement-breakpoint
-- Drop the old unit column from section_ingredients
ALTER TABLE `section_ingredients` DROP COLUMN `unit`;
