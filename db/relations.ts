import { relations } from 'drizzle-orm'

import { ingredient } from './schema/ingredient'
import { recipe } from './schema/recipe'
import { groupIngredient, recipeIngredientGroup } from './schema/recipe-ingredients'
import { recipeLinkedRecipes } from './schema/recipe-linked-recipes'
import { user } from './schema/user'

export const userRelations = relations(user, ({ many }) => ({
  recipes: many(recipe),
}))

export const recipeRelations = relations(recipe, ({ one, many }) => ({
  creator: one(user, { fields: [recipe.createdBy], references: [user.id] }),
  ingredientGroups: many(recipeIngredientGroup),
  linkedRecipes: many(recipeLinkedRecipes, { relationName: 'recipe.linkedRecipes' }),
  linkedTo: many(recipeLinkedRecipes, { relationName: 'recipe.linkedTo' }),
}))

export const recipeIngredientGroupRelations = relations(recipeIngredientGroup, ({ one, many }) => ({
  groupIngredients: many(groupIngredient),
  recipe: one(recipe, { fields: [recipeIngredientGroup.recipeId], references: [recipe.id] }),
}))

export const groupIngredientRelations = relations(groupIngredient, ({ one }) => ({
  group: one(recipeIngredientGroup, { fields: [groupIngredient.groupId], references: [recipeIngredientGroup.id] }),
  ingredient: one(ingredient, { fields: [groupIngredient.ingredientId], references: [ingredient.id] }),
}))

export const ingredientRelations = relations(ingredient, ({ one, many }) => ({
  groupIngredients: many(groupIngredient),
  parent: one(ingredient, { fields: [ingredient.parentId], references: [ingredient.id], relationName: 'ingredient.parent' }),
}))

export const recipeLinkedRecipesRelations = relations(recipeLinkedRecipes, ({ one }) => ({
  linkedRecipe: one(recipe, { fields: [recipeLinkedRecipes.linkedRecipeId], references: [recipe.id], relationName: 'recipe.linkedTo' }),
  recipe: one(recipe, { fields: [recipeLinkedRecipes.recipeId], references: [recipe.id], relationName: 'recipe.linkedRecipes' }),
}))
