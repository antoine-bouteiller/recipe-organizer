import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
  email: text('email').notNull().unique(),
  id: text('id').primaryKey(),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
})
