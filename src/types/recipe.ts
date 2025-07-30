import type { recipes } from '@/lib/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export type Recipe = InferSelectModel<typeof recipes>
