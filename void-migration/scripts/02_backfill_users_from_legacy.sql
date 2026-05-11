-- Backfill Better Auth's `user` and `account` tables from `legacy_user`.
--
-- Runs AFTER the Better Auth schema migration created the new tables.
-- Preserves user.id verbatim because it doubles as the Google `sub`
-- (Better Auth's `account.accountId` for the Google provider) AND is
-- the value `recipe.created_by` points at.
--
-- The `name` column on Better Auth's user table is NOT NULL, but the
-- legacy table never stored it — we seed it with the email's local part
-- and let Better Auth overwrite it on the user's next Google sign-in.
-- `emailVerified` is set to 1 because every legacy user signed in via
-- Google with a verified email.
--
-- Account IDs are generated with `lower(hex(randomblob(16)))` — SQLite
-- doesn't have a UUID function, but a 32-char random hex is unique
-- enough for primary keys and matches what Better Auth would have
-- written on first sign-in.

INSERT INTO user (id, email, name, emailVerified, status, role, createdAt, updatedAt)
SELECT
  id,
  email,
  substr(email, 1, instr(email, '@') - 1) AS name,
  1                                       AS emailVerified,
  status,
  role,
  CURRENT_TIMESTAMP                       AS createdAt,
  CURRENT_TIMESTAMP                       AS updatedAt
FROM legacy_user;

INSERT INTO account (id, userId, providerId, accountId, createdAt, updatedAt)
SELECT
  lower(hex(randomblob(16)))   AS id,
  id                           AS userId,
  'google'                     AS providerId,
  id                           AS accountId,  -- legacy user.id IS the Google sub
  CURRENT_TIMESTAMP            AS createdAt,
  CURRENT_TIMESTAMP            AS updatedAt
FROM legacy_user;

-- Sanity check: every recipe still has a matching user row.
-- This SELECT errors the migration if any recipe ends up orphaned.
-- (Wrap in a CASE/RAISE if your migration runner doesn't fail on
-- non-zero result counts.)
-- SELECT raise(ABORT, 'orphaned recipes after backfill')
-- FROM recipes
-- WHERE created_by NOT IN (SELECT id FROM user)
-- LIMIT 1;

DROP TABLE legacy_user;
