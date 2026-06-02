import { type recipe } from '@schema'
import { type InferSelectModel } from 'drizzle-orm'

export type Recipe = InferSelectModel<typeof recipe>
