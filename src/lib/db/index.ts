import { getBindings } from '@/lib/bindings'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

export const getDb = () => drizzle(getBindings().DB, { schema })
