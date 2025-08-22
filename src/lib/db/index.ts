import { getBindings } from '@/lib/bindings'
import { drizzle } from 'drizzle-orm/d1'
import schema from './schema'

export const getDb = () => drizzle(getBindings().DB, { schema })
