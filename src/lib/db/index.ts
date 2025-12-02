import { drizzle } from 'drizzle-orm/d1'

import { env } from '@/config/env'

import * as schema from './schema'

export const getDb = () => drizzle(env.DB, { schema })
