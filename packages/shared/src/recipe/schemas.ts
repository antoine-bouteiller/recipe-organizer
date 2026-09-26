import { unitSlugSchema } from '@recipe-organizer/shared/units'
import * as z from 'zod'

import { CUISINE_TYPES, MEALS } from './constants'
import { allowedRotationSpeed, magimixProgram } from './magimix'

const textStepSchema = z.object({
  kind: z.literal('text'),
  text: z.string().trim().min(1),
})

const magimixStepSchema = z.object({
  kind: z.literal('magimix'),
  program: z.enum(magimixProgram),
  rotationSpeed: z.enum(allowedRotationSpeed),
  temperature: z.number().int().min(0).max(200).optional(),
  time: z.number().int().min(1).max(3660),
})

const subrecipeStepSchema = z
  .object({
    fromStep: z.number().int().min(1).optional(),
    kind: z.literal('subrecipe'),
    recipeId: z.number().int().positive(),
    toStep: z.number().int().min(1).optional(),
  })
  .refine((step) => step.fromStep === undefined || step.toStep === undefined || step.fromStep <= step.toStep)

export const recipeStepSchema = z.discriminatedUnion('kind', [textStepSchema, magimixStepSchema, subrecipeStepSchema])
export type RecipeStep = z.infer<typeof recipeStepSchema>

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
