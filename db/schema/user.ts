import { sqliteTable, text } from 'void/schema-d1'

export const user = sqliteTable('user', {
  email: text('email').notNull().unique(),
  id: text('id').primaryKey(),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  status: text('status', { enum: ['pending', 'active', 'blocked'] })
    .notNull()
    .default('active'),
})
