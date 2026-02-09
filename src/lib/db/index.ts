import { env as cloudflareEnv } from 'cloudflare:workers'
import { defineRelations } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from './schema'

const relations = defineRelations(schema, (relation) => ({
  ingredient: {
    parent: relation.one.ingredient({
      from: relation.ingredient.parentId,
      to: relation.ingredient.id,
    }),
    groupIngredients: relation.many.groupIngredient(),
  },
  recipe: {
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
  groupIngredient: {
    group: relation.one.recipeIngredientGroup({
      from: relation.groupIngredient.groupId,
      to: relation.recipeIngredientGroup.id,
    }),
    ingredient: relation.one.ingredient({
      from: relation.groupIngredient.ingredientId,
      to: relation.ingredient.id,
      optional: false,
    }),
    unit: relation.one.unit({
      from: relation.groupIngredient.unitId,
      to: relation.unit.id,
    }),
  },
  recipeLinkedRecipes: {
    linkedRecipe: relation.one.recipe({
      from: relation.recipeLinkedRecipes.linkedRecipeId,
      to: relation.recipe.id,
      optional: false,
    }),
    recipe: relation.one.recipe({
      from: relation.recipeLinkedRecipes.recipeId,
      to: relation.recipe.id,
      optional: false,
    }),
  },
  unit: {
    parent: relation.one.unit({
      from: relation.unit.parentId,
      to: relation.unit.id,
    }),
  },
}))

export const getDb = () => drizzle(cloudflareEnv.DB, { relations })
