PRAGMA defer_foreign_keys=ON;

CREATE TABLE `__new_recipes` (
	`id` integer PRIMARY KEY,
	`image` text(255) NOT NULL,
	`instructions` text NOT NULL,
	`name` text(255) NOT NULL,
	`servings` integer NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`video` text(255)
);

INSERT INTO `__new_recipes`(`id`, `image`, `instructions`, `name`, `servings`, `tags`, `video`)
SELECT `id`, `image`, `instructions`, `name`, `servings`,
  '[' ||
    CASE
      WHEN `is_vegetarian` = 1 AND `is_magimix` = 1 THEN '"vegetarian","magimix"'
      WHEN `is_vegetarian` = 1 THEN '"vegetarian"'
      WHEN `is_magimix` = 1 THEN '"magimix"'
      ELSE ''
    END
  || ']',
  `video`
FROM `recipes`;
DROP TABLE `recipes`;
ALTER TABLE `__new_recipes` RENAME TO `recipes`;

PRAGMA defer_foreign_keys=OFF;
