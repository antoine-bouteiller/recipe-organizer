import { env as cloudflareEnv } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

import { relations } from '@/db/schema'

export const getDb = () => drizzle(cloudflareEnv.DB, { relations })
