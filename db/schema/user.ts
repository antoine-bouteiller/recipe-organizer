import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Core Better Auth `user` fields plus the app-specific `role` / `status` columns
// (declared to Better Auth via `user.additionalFields`).
export const user = sqliteTable('user', {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  id: text('id').primaryKey(),
  image: text('image'),
  name: text('name').notNull(),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  status: text('status', { enum: ['pending', 'active', 'blocked'] })
    .notNull()
    .default('active'),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})
