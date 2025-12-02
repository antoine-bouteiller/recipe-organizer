import type { InferSelectModel } from 'drizzle-orm'

import type { recipe } from '@/lib/db/schema'

export type Recipe = InferSelectModel<typeof recipe>
