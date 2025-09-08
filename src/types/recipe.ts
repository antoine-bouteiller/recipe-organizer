import type { recipe } from '@/lib/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export type Recipe = InferSelectModel<typeof recipe>
