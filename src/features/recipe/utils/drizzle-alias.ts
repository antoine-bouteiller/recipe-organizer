import { alias } from 'drizzle-orm/sqlite-core'

import { groupIngredient, ingredient, recipe, recipeIngredientGroup } from '@/lib/db/schema'

export const embeddedRecipe = alias(recipe, 'embedded_recipe')

export const embeddedRecipeIngredientGroup = alias(recipeIngredientGroup, 'embedded_recipe_ingredient_groups')

export const embeddedRecipeGroupIngredient = alias(groupIngredient, 'embedded_recipe_group_ingredients')

export const embeddedRecipeIngredient = alias(ingredient, 'embedded_recipe_ingredient')
