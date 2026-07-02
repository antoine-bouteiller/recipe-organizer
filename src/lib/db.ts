import { relations } from '@schema'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

export const getDb = () => drizzle(cloudflareEnv.DB, { relations })
