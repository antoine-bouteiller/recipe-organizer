import type { InferSelectModel } from 'drizzle-orm'

import type { unit } from '@/lib/db/schema'

export type Unit = InferSelectModel<typeof unit>
