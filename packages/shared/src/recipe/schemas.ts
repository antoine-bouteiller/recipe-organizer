import { unitSlugSchema } from '@recipe-organizer/shared/unit-schema'
import * as z from 'zod'

import { CUISINE_TYPES, MEALS } from './constants'

export const recipeSchema = z.object({
  cuisineTypes: z.array(z.enum(CUISINE_TYPES)),
  image: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })]),
  ingredientGroups: z.array(
    z.object({
      _key: z.string(),
      groupName: z.string().optional(),
      ingredients: z.array(
        z.object({
          _key: z.string(),
          id: z.number().min(0),
          quantity: z.number().min(0),
          unitSlug: unitSlugSchema.optional(),
        })
      ),
    })
  ),
  instructions: z.string(),
  linkedRecipes: z.array(z.object({ _key: z.string().optional(), id: z.number().min(0), ratio: z.number().min(0) })).optional(),
  meals: z.array(z.enum(MEALS)),
  name: z.string().min(2),
  servings: z.number().min(0),
  video: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })]).optional(),
})

export const updateRecipeSchema = recipeSchema.extend({ id: z.number() })
export const deleteRecipeSchema = z.number()

const wireEntrySchema = z.union([z.string(), z.instanceof(File)])

// FormData transports each recipe field as either a JSON string or a File.
export const recipeFormWireSchema = z.object({
  cuisineTypes: wireEntrySchema,
  image: wireEntrySchema,
  ingredientGroups: wireEntrySchema,
  instructions: wireEntrySchema,
  linkedRecipes: wireEntrySchema.optional(),
  meals: wireEntrySchema,
  name: wireEntrySchema,
  servings: wireEntrySchema,
  video: wireEntrySchema.optional(),
})

export const updateRecipeFormWireSchema = recipeFormWireSchema.extend({ id: wireEntrySchema })

export const recipeFormDataToWire = (data: FormData) => recipeFormWireSchema.parse(Object.fromEntries(data))

export const updateRecipeFormDataToWire = (data: FormData) => updateRecipeFormWireSchema.parse(Object.fromEntries(data))

type RecipeFormValues = z.infer<typeof recipeSchema>
export type RecipeFormInput = Partial<RecipeFormValues>
type UpdateRecipeFormValues = z.infer<typeof updateRecipeSchema>
export type UpdateRecipeFormInput = Partial<UpdateRecipeFormValues>
