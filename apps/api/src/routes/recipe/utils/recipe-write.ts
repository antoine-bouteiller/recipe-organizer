// oxlint-disable-next-line import/consistent-type-specifier-style -- an inline type import keeps a runtime import of `cloudflare:workers`, which unit tests cannot load.
import type { getDb } from '@recipe-organizer/api/lib/db'
import { groupIngredient, ingredient, recipe, recipeIngredientGroup, recipeLinkedRecipes } from '@recipe-organizer/api/schema'
import { type RecipeStep, type RecipeStepGroup } from '@recipe-organizer/shared/recipe/schemas'
import { type UnitSlug } from '@recipe-organizer/shared/units'
import { isNotEmpty } from '@recipe-organizer/shared/utils/array'
import { inArray } from 'drizzle-orm'

import { writeRecipeSteps } from './recipe-steps'

interface IngredientGroupWrite {
  readonly groupName?: string
  readonly ingredients: readonly { readonly id: number; readonly quantity: number; readonly unitSlug?: UnitSlug }[]
}

interface LinkedRecipeWrite {
  readonly id: number
  readonly ratio: number
}

interface ResolveAutoFlagsInput {
  readonly allIngredientIds: number[]
  readonly linkedRecipeIds: number[]
  readonly meals: string[]
  readonly steps: readonly RecipeStep[]
}

interface AutoFlags {
  readonly isMagimix: boolean
  readonly isSpice: boolean
  readonly isVegetarian: boolean
}

export const computeAutoFlags = (
  ingredientCategories: { category: string | null }[],
  linkedRecipesData: { isVegetarian: boolean }[],
  steps: readonly RecipeStep[],
  meals: string[]
): AutoFlags => {
  const ownVegetarian = ingredientCategories.every((item) => item.category !== 'meat' && item.category !== 'fish')
  const linkedVegetarian = linkedRecipesData.every((item) => item.isVegetarian)
  return {
    isMagimix: steps.some((step) => step.kind === 'magimix'),
    isSpice: ingredientCategories.length > 0 && ingredientCategories.every((item) => item.category === 'spices'),
    isVegetarian: ownVegetarian && linkedVegetarian && !meals.includes('dessert'),
  }
}

export const resolveAutoFlags = async (
  db: ReturnType<typeof getDb>,
  { allIngredientIds, linkedRecipeIds, meals, steps }: ResolveAutoFlagsInput
): Promise<AutoFlags> => {
  const [ingredientCategories, linkedRecipesData] = await db.batch([
    db.select({ category: ingredient.category }).from(ingredient).where(inArray(ingredient.id, allIngredientIds)),
    db.select({ isVegetarian: recipe.isVegetarian }).from(recipe).where(inArray(recipe.id, linkedRecipeIds)),
  ])

  return computeAutoFlags(ingredientCategories, linkedRecipesData, steps, meals)
}

export const writeRecipeIngredientGraph = async (
  db: ReturnType<typeof getDb>,
  recipeId: number,
  ingredientGroups: readonly IngredientGroupWrite[],
  linkedRecipes: LinkedRecipeWrite[] | undefined,
  stepGroups: readonly RecipeStepGroup[]
): Promise<void> => {
  await Promise.all(
    ingredientGroups.map(async (group, index) => {
      const [createdGroup] = await db
        .insert(recipeIngredientGroup)
        .values({
          groupName: group.groupName,
          isDefault: index === 0,
          recipeId,
        })
        .returning()

      if (group.ingredients.length > 0) {
        await db.insert(groupIngredient).values(
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
    await db.insert(recipeLinkedRecipes).values(
      linkedRecipes.map((lr) => ({
        linkedRecipeId: lr.id,
        ratio: lr.ratio,
        recipeId,
      }))
    )
  }

  await writeRecipeSteps(db, recipeId, stepGroups)
}
