import { unitSlugSchema } from '@recipe-organizer/shared/units'
import * as z from 'zod'

import { CUISINE_TYPES, MEALS } from './constants'
import { allowedRotationSpeed, magimixProgram } from './magimix'

const magimixSchema = z.object({
  program: z.enum(magimixProgram),
  rotationSpeed: z.enum(allowedRotationSpeed),
  temperature: z.number().int().min(0).max(200).optional(),
  time: z.number().int().min(1).max(3660),
})

// A step is text with an optional linked Magimix program.
export const recipeStepSchema = z.object({
  magimix: magimixSchema.optional(),
  text: z.string().trim().min(1),
})
export type RecipeStep = z.infer<typeof recipeStepSchema>

const ownStepGroupSchema = z.object({
  groupName: z.string().optional(),
  kind: z.literal('steps'),
  steps: z.array(recipeStepSchema),
})

// A sub-recipe group shows the linked recipe's default step group.
const subrecipeStepGroupSchema = z.object({
  kind: z.literal('subrecipe'),
  recipeId: z.number().int().positive(),
})

const recipeStepGroupSchema = z.discriminatedUnion('kind', [ownStepGroupSchema, subrecipeStepGroupSchema])
export type RecipeStepGroup = z.infer<typeof recipeStepGroupSchema>

const keyed = { _key: z.string() }

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
  linkedRecipes: z.array(z.object({ _key: z.string().optional(), id: z.number().min(0), ratio: z.number().min(0) })).optional(),
  meals: z.array(z.enum(MEALS)),
  name: z.string().min(2),
  servings: z.number().min(0),
  // The first group is the recipe's default, unnamed own-steps group.
  stepGroups: z
    .array(
      z.discriminatedUnion('kind', [
        ownStepGroupSchema.extend({ ...keyed, steps: z.array(recipeStepSchema.and(z.object(keyed))) }),
        subrecipeStepGroupSchema.extend(keyed),
      ])
    )
    .refine((groups) => groups[0]?.kind === 'steps'),
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
  linkedRecipes: wireEntrySchema.optional(),
  meals: wireEntrySchema,
  name: wireEntrySchema,
  servings: wireEntrySchema,
  stepGroups: wireEntrySchema,
  video: wireEntrySchema.optional(),
})

export const updateRecipeFormWireSchema = recipeFormWireSchema.extend({ id: wireEntrySchema })

export const recipeFormDataToWire = (data: FormData) => recipeFormWireSchema.parse(Object.fromEntries(data))

export const updateRecipeFormDataToWire = (data: FormData) => updateRecipeFormWireSchema.parse(Object.fromEntries(data))

type RecipeFormValues = z.infer<typeof recipeSchema>
export type RecipeFormInput = Partial<RecipeFormValues>
type UpdateRecipeFormValues = z.infer<typeof updateRecipeSchema>
export type UpdateRecipeFormInput = Partial<UpdateRecipeFormValues>
