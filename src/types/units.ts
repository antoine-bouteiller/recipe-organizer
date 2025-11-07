import type { unit } from '@/lib/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export type Unit = InferSelectModel<typeof unit>
