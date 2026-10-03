import { HTTPException } from 'hono/http-exception'
import type { CloudContext } from 'void'
import { ValidationError } from 'void/pages-protocol'
import type * as z from 'zod'

const numericFields = new Set(['id', 'recipeId', 'quantity', 'ratio', 'servings', 'temperature', 'time'])
const optionalFields = new Set(['image', 'video', 'groupName', 'unitSlug', 'magimix', 'temperature'])
type MultipartValue = string | number | File | undefined | MultipartObject | MultipartValue[]
interface MultipartObject {
  [key: string]: MultipartValue
}

const normalizeScalar = (path: string[], value: FormDataEntryValue): MultipartValue => {
  const field = path.at(-1) ?? ''
  if (typeof value === 'string' && numericFields.has(field) && !['image', 'video'].includes(path[0] ?? '')) {
    return value.trim() === '' ? undefined : Number(value)
  }
  return value === '' && optionalFields.has(field) ? undefined : value
}

const isContainer = (value: MultipartValue): value is MultipartObject | MultipartValue[] => typeof value === 'object' && !(value instanceof File)
const insertField = (root: MultipartObject, path: string[], value: MultipartValue) => {
  let node: MultipartObject | MultipartValue[] = root
  for (const [index, part] of path.entries()) {
    if (index === path.length - 1) {
      if (Array.isArray(node)) {
        node[Number(part)] = value
      } else {
        node[part] = value
      }
      return
    }
    let child: MultipartValue = Array.isArray(node) ? node[Number(part)] : node[part]
    if (child === undefined) {
      child = /^\d+$/.test(path[index + 1] ?? '') ? [] : {}
    }
    if (!isContainer(child)) {
      throw new HTTPException(400, { message: 'Invalid form field' })
    }
    if (Array.isArray(node)) {
      node[Number(part)] = child
    } else {
      node[part] = child
    }
    node = child
  }
}

const restoreEmptyArrays = (root: MultipartObject) => {
  // Void omits empty arrays, including the default group's empty steps.
  for (const key of ['cuisineTypes', 'meals', 'ingredientGroups', 'linkedRecipes', 'stepGroups']) {
    root[key] ??= []
  }
  if (Array.isArray(root.ingredientGroups)) {
    for (const group of root.ingredientGroups) {
      if (isContainer(group) && !Array.isArray(group)) {
        group.ingredients ??= []
      }
    }
  }
  if (Array.isArray(root.stepGroups)) {
    for (const group of root.stepGroups) {
      if (isContainer(group) && !Array.isArray(group) && group.kind === 'steps') {
        group.steps ??= []
      }
    }
  }
}

const readMultipart = (formData: FormData): MultipartObject => {
  const root: MultipartObject = {}
  for (const [key, value] of formData) {
    const path = key.replaceAll(']', '').split('[')
    if (path.some((part) => ['__proto__', 'constructor', 'prototype'].includes(part) || (/^\d+$/.test(part) && Number(part) > 10_000))) {
      throw new HTTPException(400, { message: 'Invalid form field' })
    }
    insertField(root, path, normalizeScalar(path, value))
  }
  restoreEmptyArrays(root)
  return root
}

export const readRecipeFormData = async (context: CloudContext): Promise<unknown> => {
  if (context.req.header('Content-Type')?.includes('application/json')) {
    return context.req.json().catch(() => {
      throw new HTTPException(400, { message: 'Invalid Schema; expected JSON form data' })
    })
  }
  const formData = await context.req.formData().catch(() => {
    throw new HTTPException(400, { message: 'Invalid Schema; expected multipart form data' })
  })
  return readMultipart(formData)
}

export const validateRecipeForm = <TSchema extends z.ZodType>(schema: TSchema, data: unknown): z.output<TSchema> => {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ValidationError(Object.fromEntries(result.error.issues.map((issue) => [issue.path.join('.'), issue.message])))
  }
  return result.data
}
