import { db } from '@/lib/db'
import { ingredients } from '@/lib/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'

export const getAllIngredients = createServerFn({
  method: 'GET',
}).handler(async () => {
  return db.select().from(ingredients).orderBy(asc(ingredients.name))
})
