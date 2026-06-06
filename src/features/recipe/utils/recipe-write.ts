import { inArray } from 'drizzle-orm'

import { getDb } from '@/lib/db'
import { groupIngredient, ingredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@/lib/db/schema'
import { type UnitSlug } from '@/lib/db/schema/unit'
import { isNotEmpty } from '@/utils/array'

import { type RecipeTag } from './constants'

interface IngredientGroupWrite {
  readonly groupName?: string
  readonly ingredients: readonly { readonly id: number; readonly quantity: number; readonly unitSlug?: UnitSlug }[]
}

interface LinkedRecipeWrite {
  readonly id: number
  readonly ratio: number
}

interface ResolveAutoTagsInput {
  readonly allIngredientIds: number[]
  readonly linkedRecipeIds: number[]
  readonly instructions: string
  readonly tags: string[]
}

const computeAutoTags = (
  ingredientCategories: { category: string | null }[],
  linkedRecipesData: { tags: string[] | null }[],
  instructions: string,
  tags: string[]
): RecipeTag[] => {
  const ownVegetarian = ingredientCategories.every((item) => item.category !== 'meat' && item.category !== 'fish')
  const linkedVegetarian = linkedRecipesData.every((item) => item.tags?.includes('vegetarian'))
  const autoTags: RecipeTag[] = []
  if (ownVegetarian && linkedVegetarian && !tags.includes('dessert')) {
    autoTags.push('vegetarian')
  }
  if (instructions.includes('"type":"magimixProgram"')) {
    autoTags.push('magimix')
  }
  return autoTags
}

export const resolveAutoTags = async ({ allIngredientIds, linkedRecipeIds, instructions, tags }: ResolveAutoTagsInput): Promise<RecipeTag[]> => {
  const [ingredientCategories, linkedRecipesData] = await getDb().batch([
    getDb().select({ category: ingredient.category }).from(ingredient).where(inArray(ingredient.id, allIngredientIds)),
    getDb().select({ tags: recipe.tags }).from(recipe).where(inArray(recipe.id, linkedRecipeIds)),
  ])

  return computeAutoTags(ingredientCategories, linkedRecipesData, instructions, tags)
}

export const writeRecipeIngredientGraph = async (
  recipeId: number,
  ingredientGroups: readonly IngredientGroupWrite[],
  linkedRecipes: LinkedRecipeWrite[] | undefined
): Promise<void> => {
  await Promise.all(
    ingredientGroups.map(async (group, index) => {
      const [createdGroup] = await getDb()
        .insert(recipeIngredientGroup)
        .values({
          groupName: group.groupName,
          isDefault: index === 0,
          recipeId,
        })
        .returning()

      if (group.ingredients.length > 0) {
        await getDb()
          .insert(groupIngredient)
          .values(
            group.ingredients.map((ingredientEntry) => ({
              groupId: createdGroup.id,
              ingredientId: ingredientEntry.id,
              quantity: ingredientEntry.quantity,
              unitSlug: ingredientEntry.unitSlug ?? undefined,
            }))
          )
      }
    })
  )

  if (isNotEmpty(linkedRecipes)) {
    await getDb()
      .insert(recipeLinkedRecipes)
      .values(
        linkedRecipes.map((lr) => ({
          linkedRecipeId: lr.id,
          ratio: lr.ratio,
          recipeId,
        }))
      )
  }
}
