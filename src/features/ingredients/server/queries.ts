import type { getDb } from '@/lib/server/db'

export const listIngredients = (db: ReturnType<typeof getDb>) => db.query.ingredient.findMany({ orderBy: { name: 'asc' } })
