DROP INDEX IF EXISTS `idx_recipes_name`;--> statement-breakpoint
CREATE INDEX `idx_recipe_ingredient_groups_is_default` ON `recipe_ingredient_groups` (`is_default`);