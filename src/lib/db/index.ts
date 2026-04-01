import { env as cloudflareEnv } from 'cloudflare:workers'
import { defineRelations } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

import { groupIngredient, ingredient, ingredientCategory, recipe, recipeIngredientGroup, recipeLinkedRecipes, unit, user } from './schema'

const relations = defineRelations(
  { groupIngredient, ingredient, ingredientCategory, recipe, recipeIngredientGroup, recipeLinkedRecipes, unit, user },
  (relation) => ({
    groupIngredient: {
      group: relation.one.recipeIngredientGroup({
        from: relation.groupIngredient.groupId,
        to: relation.recipeIngredientGroup.id,
      }),
      ingredient: relation.one.ingredient({
        from: relation.groupIngredient.ingredientId,
        optional: false,
        to: relation.ingredient.id,
      }),
      unit: relation.one.unit({
        from: relation.groupIngredient.unitId,
        to: relation.unit.id,
      }),
    },
    ingredient: {
      groupIngredients: relation.many.groupIngredient(),
      parent: relation.one.ingredient({
        from: relation.ingredient.parentId,
        to: relation.ingredient.id,
      }),
    },
    recipe: {
      creator: relation.one.user({
        from: relation.recipe.createdBy,
        to: relation.user.id,
      }),
      ingredientGroups: relation.many.recipeIngredientGroup(),
      linkedRecipes: relation.many.recipeLinkedRecipes({
        from: relation.recipe.id,
        to: relation.recipeLinkedRecipes.recipeId,
      }),
      linkedTo: relation.many.recipeLinkedRecipes({
        from: relation.recipe.id,
        to: relation.recipeLinkedRecipes.linkedRecipeId,
      }),
    },
    recipeIngredientGroup: {
      groupIngredients: relation.many.groupIngredient(),
      recipe: relation.one.recipe({
        from: relation.recipeIngredientGroup.recipeId,
        to: relation.recipe.id,
      }),
    },
    recipeLinkedRecipes: {
      linkedRecipe: relation.one.recipe({
        from: relation.recipeLinkedRecipes.linkedRecipeId,
        optional: false,
        to: relation.recipe.id,
      }),
      recipe: relation.one.recipe({
        from: relation.recipeLinkedRecipes.recipeId,
        optional: false,
        to: relation.recipe.id,
      }),
    },
    unit: {
      parent: relation.one.unit({
        from: relation.unit.parentId,
        to: relation.unit.id,
      }),
    },
    user: {
      recipes: relation.many.recipe(),
    },
  })
)

export const getDb = () => drizzle(cloudflareEnv.DB, { relations })
