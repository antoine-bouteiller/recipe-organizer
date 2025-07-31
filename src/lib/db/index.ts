import { getBindings } from '@/lib/bindings'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

export function getDb() {
  return drizzle(getBindings().DB, { schema })
}
