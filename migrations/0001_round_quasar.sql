PRAGMA foreign_keys=OFF;--> statement-breakpoint
UPDATE units SET `name` = `symbol`;--> statement-breakpoint
ALTER TABLE `units` DROP COLUMN `symbol`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
