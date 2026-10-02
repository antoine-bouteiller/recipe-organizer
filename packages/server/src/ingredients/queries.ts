import type { getDb } from '#server/lib/db'

export const listIngredients = (db: ReturnType<typeof getDb>) => db.query.ingredient.findMany({ orderBy: { name: 'asc' } })
