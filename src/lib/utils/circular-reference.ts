import { eq } from 'drizzle-orm'

import { getDb } from '@/lib/db'
import { recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'

export const detectCircularReference = async (
  recipeId: number,
  linkedRecipeId: number,
  visited: Set<number> = new Set<number>()
): Promise<boolean> => {
  if (recipeId === linkedRecipeId) {
    return true
  }

  if (visited.has(linkedRecipeId)) {
    return false
  }

  visited.add(linkedRecipeId)

  const linkedRecipesFromTable = await getDb()
    .select({ linkedRecipeId: recipeLinkedRecipes.linkedRecipeId })
    .from(recipeLinkedRecipes)
    .where(eq(recipeLinkedRecipes.recipeId, linkedRecipeId))

  const embeddedRecipesFromGroups = await getDb()
    .select({ embeddedRecipeId: recipeIngredientGroup.embeddedRecipeId })
    .from(recipeIngredientGroup)
    .where(eq(recipeIngredientGroup.recipeId, linkedRecipeId))

  const allLinked = [
    ...linkedRecipesFromTable.map((r) => r.linkedRecipeId),
    ...embeddedRecipesFromGroups.map((r) => r.embeddedRecipeId).filter((id): id is number => id !== null),
  ]

  const checkResults = await Promise.all(allLinked.map(async (id) => (id === recipeId ? true : detectCircularReference(recipeId, id, visited))))

  return checkResults.some((result) => result)
}

export const extractLinkedRecipeIds = (html: string): { position: number; recipeId: number }[] => {
  const regex = /data-recipe-id="(\d+)"/g
  const matches = [...html.matchAll(regex)]

  return matches
    .map((match, index) => {
      const id = Number.parseInt(match[1], 10)
      return Number.isNaN(id) ? undefined : { position: index, recipeId: id }
    })
    .filter((item): item is { position: number; recipeId: number } => item !== null)
}
