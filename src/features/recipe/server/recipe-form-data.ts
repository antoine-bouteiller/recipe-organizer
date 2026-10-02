import { HTTPException } from 'hono/http-exception'
import type { CloudContext } from 'void'
import * as z from 'zod'

import { parseFormData } from '@/utils/form-data'

const jsonFormSchema = z.record(z.string(), z.string())

export const readRecipeFormData = async (context: CloudContext) => {
  if (context.req.header('Content-Type')?.includes('application/json')) {
    const body = await context.req.json().catch(() => {
      throw new HTTPException(400, { message: 'Invalid Schema; expected JSON form data' })
    })
    const formData = new FormData()
    for (const [key, value] of Object.entries(jsonFormSchema.parse(body))) {
      formData.append(key, value)
    }
    return parseFormData(formData)
  }
  const formData = await context.req.formData().catch(() => {
    throw new HTTPException(400, { message: 'Invalid Schema; expected multipart form data' })
  })
  return parseFormData(formData)
}
