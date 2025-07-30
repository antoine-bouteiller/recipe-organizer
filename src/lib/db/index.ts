import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export function getDb() {
  const queryClient = postgres(process.env.DATABASE_URL!)
  return drizzle(queryClient, { schema })
}
