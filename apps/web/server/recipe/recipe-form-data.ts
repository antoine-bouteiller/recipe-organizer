import { parseFormData } from '@recipe-organizer/shared/utils/form-data'
import { HTTPException } from 'hono/http-exception'
import type { CloudContext } from 'void'

export const readRecipeFormData = async (context: CloudContext) => {
  const formData = await context.req.formData().catch(() => {
    throw new HTTPException(400, { message: 'Invalid Schema; expected multipart form data' })
  })
  return parseFormData(formData)
}
