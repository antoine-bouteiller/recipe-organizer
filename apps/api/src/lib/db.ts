import { relations } from '@recipe-organizer/api/schema'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

export const getDb = () => drizzle(cloudflareEnv.DB, { relations })
