import { ingredient, recipe, recipeIngredientsSection, sectionIngredient } from '@/lib/db/schema'
import { alias } from 'drizzle-orm/sqlite-core'

export const subRecipe = alias(recipe, 'sub_recipe')

export const subRecipeIngredientsSection = alias(
  recipeIngredientsSection,
  'subrecipe_ingredients_sections'
)

export const subRecipeSectionIngredient = alias(sectionIngredient, 'subrecipe_section_ingredients')

export const subRecipeIngredient = alias(ingredient, 'subrecipe_ingredient')
