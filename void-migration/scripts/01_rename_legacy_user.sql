-- Rename the legacy `user` table out of the way so Better Auth's
-- schema migration (run next) can create its own `user` table.
--
-- Safe because:
--   - SQLite's `ALTER TABLE ... RENAME TO` is atomic.
--   - There are NO declared FOREIGN KEY constraints pointing at the
--     `user` table in any existing migration (verified by grep against
--     `migrations/*.sql`). `recipe.created_by` is a plain text column
--     with default '1' — a logical reference, not an enforced FK.
--
-- After this runs, `legacy_user` holds the three production user rows.
-- The matching `02_backfill_users_from_legacy.sql` script copies them
-- into Better Auth's new `user` and `account` tables.

ALTER TABLE user RENAME TO legacy_user;
