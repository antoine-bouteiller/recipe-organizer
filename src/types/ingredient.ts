import type { ingredients } from '@/lib/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export type Ingredient = InferSelectModel<typeof ingredients>
